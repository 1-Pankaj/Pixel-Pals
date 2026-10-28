/**
 * PetBrain: everything a pet "does", with no DOM and no Electron.
 *
 * Each frame the renderer calls   pose = brain.update(dt, input)
 * and draws the pose with Pets.render(). The brain also fills brain.out with events
 * ({type:'say'|'walk'|'walk-stop'|'sound'}) that the renderer drains and acts upon.
 *
 * input = {
 *   look:        { dx, dy } | null    cursor relative to the pet's head, in sprite pixels
 *   cursorMoved: boolean              the real mouse moved since last frame
 *   hovering:    boolean              the mouse is over the pet
 *   room:        { left, right }      free screen space (css px) either side of the pet
 * }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./effects'));
  else root.PetBrain = factory(root.Effects);
})(typeof self !== 'undefined' ? self : this, function (Effects) {
  'use strict';

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const damp = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
  const smooth = (k) => k * k * (3 - 2 * k);

  const MOODS = {
    calm: { eyes: 'open', mouth: 'smile', blush: 0 },
    glad: { eyes: 'open', mouth: 'smile', blush: 0.55 },
    happy: { eyes: 'happy', mouth: 'open', blush: 0.75 },
    love: { eyes: 'love', mouth: 'tongue', blush: 1 },
    wide: { eyes: 'wide', mouth: 'o', blush: 0.2 },
    sleepy: { eyes: 'sleepy', mouth: 'yawn', blush: 0.2 },
    sleep: { eyes: 'sleep', mouth: 'sleep', blush: 0.2 },
    sad: { eyes: 'sad', mouth: 'frown', blush: 0 },
    dizzy: { eyes: 'dizzy', mouth: 'o', blush: 0.3 },
    squint: { eyes: 'squint', mouth: 'flat', blush: 0.4 },
    cheeky: { eyes: 'squint', mouth: 'tongue', blush: 0.7 },
  };

  /** seconds between spontaneous messages: [min, max] */
  const CHATTY = { silent: null, quiet: [420, 840], normal: [150, 330], chatty: [50, 130] };

  /** minimum seconds between *ambient* lines (yawns, sneezes, daydreams...) so the pet never babbles */
  const AMBIENT_GAP = { silent: null, quiet: 300, normal: 120, chatty: 45 };

  const G = 260;            // gravity in sprite pixels / s^2
  const WALK_SPEED = 54;    // css pixels / s

  /* ───────────────────────── scripted actions ─────────────────────────
     Each action runs for `dur` seconds; tick(b, p, dt, a) gets progress p in 0..1 and
     may write overrides into b.ov (reset every frame), or poke the brain directly. */
  const ACTS = {
    lookAround: {
      dur: 3.0,
      tick(b, p) { const seq = [[-0.95, 0.1], [0.95, -0.2], [0.1, -0.9], [0, 0]]; const s = seq[Math.min(3, Math.floor(p * 4))]; b.ov.lookX = s[0]; b.ov.lookY = s[1]; },
    },
    hop: { dur: 0.95, start(b) { b.jump(78); b.setMood('happy', 0.9); } },
    hop2: {
      dur: 1.8,
      start(b) { b.jump(70); b.setMood('happy', 1.7); },
      tick(b, p, dt, a) { if (p > 0.5 && !a.f.h) { a.f.h = 1; b.jump(86); } },
    },
    wiggle: {
      dur: 1.1,
      start(b) { b.setMood('happy', 1.1); },
      tick(b, p) { b.ov.ox = Math.round(Math.sin(p * Math.PI * 9) * 1.4 * (1 - p * 0.4)); b.ov.sq = Math.sin(p * Math.PI * 18) * 0.03; },
    },
    yawn: {
      dur: 2.4,
      tick(b, p) { const k = Math.sin(p * Math.PI); if (k > 0.15) b.ov.eyes = 'sleepy'; if (k > 0.3) b.ov.mouth = 'yawn'; b.ov.syAdd = 0.04 * k; b.ov.sleepy = k * 0.8; },
      end(b) { b.ambient('yawn', 0.4); },
    },
    stretch: {
      dur: 1.9,
      tick(b, p) { const k = Math.sin(Math.min(1, p * 1.1) * Math.PI); b.ov.syAdd = 0.09 * k; b.ov.sxAdd = -0.05 * k; if (k > 0.2) { b.ov.eyes = 'squint'; b.ov.mouth = 'flat'; } },
    },
    spin: {
      dur: 1.15,
      start(b) { b.jump(74); b.setMood('happy', 1.15); },
      tick(b, p) { const c = Math.cos(p * Math.PI * 4); b.ov.sx = Math.max(0.14, Math.abs(c)); b.ov.back = c < 0.25 && p < 0.94; },
    },
    earTwitch: { dur: 1.2, tick(b, p) { b.ov.ear = Math.sin(p * Math.PI * 6) * (1 - p); } },
    tailFlick: { dur: 1.5, tick(b, p) { b.ov.tailSpeed = 13 * (1 - p); b.ov.eyes = 'happy'; } },
    flap: { dur: 1.5, tick(b, p) { b.ov.flap = Math.max(0, Math.sin(p * Math.PI * 6)) * 0.9; b.ov.eyes = 'happy'; b.ov.mouth = 'open'; } },
    gillWave: { dur: 2.4, tick(b, p) { b.ov.gill = Math.sin(p * Math.PI); } },
    daydream: {
      dur: 4.6,
      start(b) { const icons = ['heart', 'star', 'note', 'sparkle', b.meta.treat || 'fish']; b.thought = { icon: icons[Math.floor(b.R() * icons.length)] }; },
      tick(b) { b.ov.lookX = 0.75; b.ov.lookY = -0.9; },
      end(b) { b.thought = null; b.ambient('daydream', 0.45); },
    },
    sneeze: {
      dur: 1.4,
      tick(b, p, dt, a) {
        if (p < 0.5) { b.ov.eyes = 'squint'; b.ov.mouth = 'o'; b.ov.syAdd = 0.05 * (p * 2); }
        else if (!a.f.s) { a.f.s = 1; b.sq = 0.32; b.fx.puff(32, 56 - (b.meta.mouthY || 16), 5); b.ambient('sneeze'); }
      },
    },
    hiccup: {
      dur: 2.1,
      tick(b, p, dt, a) {
        [0.1, 0.45, 0.8].forEach((m, i) => { if (p >= m && !a.f[i]) { a.f[i] = 1; b.jump(36); b.sq = 0.1; if (i === 0) b.ambient('hiccup'); } });
        b.ov.eyes = 'wide'; b.ov.mouth = 'o';
      },
    },
    dance: {
      dur: 3.4,
      tick(b, p, dt, a) {
        b.ov.ox = Math.round(Math.sin(p * Math.PI * 8) * 2.2); b.ov.eyes = 'happy'; b.ov.mouth = 'open';
        const beat = Math.floor(p * 8);
        if (beat !== a.beat) { a.beat = beat; b.sq = 0.1; if (beat % 2 === 0) b.fx.note(32 + b.R() * 16 - 8, b.meta.top - 2); }
      },
    },
    shy: { dur: 2.3, tick(b) { b.ov.blush = 1; b.ov.lookX = -0.8; b.ov.lookY = 0.7; b.ov.eyes = 'happy'; b.ov.mouth = 'smile'; } },
    sulk: {
      dur: 3.4,
      start(b) { b.setMood('sad', 3.2); b.ambient('bored'); },
      tick(b) { b.ov.eyes = 'sad'; b.ov.mouth = 'frown'; b.ov.lookY = 0.5; },
    },
    wakeup: {
      dur: 1.8,
      tick(b, p) { if (p < 0.5) b.ov.eyes = 'sleepy'; if (p < 0.6) b.ov.mouth = 'yawn'; b.ov.sleepy = 1 - p; b.ov.syAdd = 0.05 * Math.sin(p * Math.PI); },
    },
    drowse: {
      dur: 2.8,
      tick(b, p) { if (p > 0.3) b.ov.eyes = 'sleepy'; b.ov.mouth = p < 0.8 ? 'yawn' : 'sleep'; b.ov.sleepy = p; },
      end(b) { b.enterSleep(); },
    },
    eat: {
      dur: 4.0,
      start(b, a) { a.x = 32 + (b.R() - 0.5) * 4; a.y0 = 3; b.prop = { kind: b.meta.treat || 'fish', x: a.x, y: a.y0, spin: 0 }; },
      tick(b, p, dt, a) {
        const my = 56 - (b.meta.mouthY || 16);
        if (p < 0.3) {
          const k = p / 0.3;
          if (b.prop) { b.prop.y = lerp(a.y0, my - 2, smooth(k)); b.prop.spin += dt * 6; }
          b.ov.lookX = clamp((a.x - 32) / 16, -1, 1); b.ov.lookY = -0.9 * (1 - k);
          b.ov.eyes = 'wide'; if (k > 0.55) b.ov.mouth = 'open';
        } else if (p < 0.72) {
          if (b.prop) { b.prop = null; b.fx.crumbs(32, my, 5); b.out.push({ type: 'sound', name: 'crunch' }); }
          const n = Math.floor((p - 0.3) / 0.07);
          if (n !== a.n) { a.n = n; b.sq = 0.1; b.out.push({ type: 'sound', name: 'chomp' }); if (n % 2 === 0) b.fx.crumbs(32, my, 2); }
          b.ov.mouth = n % 2 ? 'open' : 'flat'; b.ov.eyes = 'happy';
        } else {
          if (!a.f.d) { a.f.d = 1; b.happy = 1; b.fx.hearts(32, b.meta.top + 2, 3, 16); b.speak('fed'); b.out.push({ type: 'sound', name: 'happy' }); }
          b.ov.eyes = 'happy'; b.ov.mouth = 'open';
        }
      },
      end(b) { b.prop = null; },
    },
  };

  class PetBrain {
    constructor(o) {
      o = o || {};
      this.R = o.random || Math.random;
      this.clock = o.clock || (() => new Date());
      this.msgs = o.messages;
      this.allMeta = o.pets || {};
      this.id = o.petId || 'mochi';
      this.cfg = Object.assign({ chatty: 'normal', roam: true, look: true, sleep: true, reminders: true, fun: true, sleepAfter: 150 }, o.settings);

      this.time = 0;
      this.out = [];
      this.fx = new Effects.Particles(this.R);
      this.prop = null;
      this.thought = null;

      // motion
      this.oy = 0; this.vy = 0; this.sq = 0; this.sqv = 0; this.swing = 0; this.swingV = 0; this.dragVx = 0;
      this.lookX = 0; this.lookY = 0; this.held = 0; this.sleepy = 0; this.blush = 0.28; this.happy = 0;
      this.step = 0; this.tailPh = 0; this.kicks = { ear: 0, flap: 0, gill: 0 };

      // behaviour
      this.state = 'idle';      // idle | walk | sleep | held
      this.act = null;
      this.ov = {};
      this.mood = null;
      this.walk = null;
      this.hovering = false; this.hoverSince = 0; this.hoverSaid = false;
      this.clicks = [];
      this.zStep = 0; this.nextZ = 0; this.nextSleepTalk = 0;
      this.blinkAt = 1.6; this.blinkUntil = 0; this.talkUntil = 0; this.bubbleUntil = 0;
      this.lastMove = 0; this.lastTouch = 0; this.sleptAt = 0; this.lastAmbient = -1e9;
      this.pending = null;

      this.pose = {};
      this.reschedule(true);
    }

    get meta() { return this.allMeta[this.id] || {}; }
    ctx() { return { date: this.clock(), reminders: this.cfg.reminders, fun: this.cfg.fun }; }
    rand(a, b) { return a + this.R() * (b - a); }

    reschedule(first) {
      const t = this.time, iv = CHATTY[this.cfg.chatty];
      this.nextAct = t + this.rand(2.5, 6);
      this.nextRoam = t + this.rand(60, 180);
      this.nextCare = t + this.rand(1500, 2700);
      this.nextMsg = iv ? t + (first ? this.rand(iv[0] * 0.5, iv[0]) : this.rand(iv[0], iv[1])) : Infinity;
    }

    configure(settings) {
      const chattyChanged = settings.chatty && settings.chatty !== this.cfg.chatty;
      Object.assign(this.cfg, settings);
      if (chattyChanged) this.reschedule(false);
    }

    /* ───────────── speech ───────────── */
    setMood(name, secs) {
      const m = MOODS[name] || MOODS.calm;
      this.mood = { eyes: m.eyes, mouth: m.mouth, blush: m.blush, until: this.time + secs };
    }

    say(m, opt) {
      opt = opt || {};
      if (!m || (this.cfg.chatty === 'silent' && !opt.force)) return;
      const ms = clamp(2600 + m.text.length * 60, 3400, 10000);
      this.out.push({ type: 'say', text: m.text, mood: m.mood, pool: m.pool, ms });
      this.bubbleUntil = this.time + ms / 1000;
      this.talkUntil = this.time + clamp(m.text.length * 0.045, 0.7, 2.0);
      this.setMood(m.mood, 1.7);
      this.out.push({ type: 'sound', name: 'talk' });
    }
    speak(pool, force) { this.say(this.msgs.line(this.id, pool, this.ctx()), { force }); }
    /** Optional, throttled chatter. Returns true if it spoke. Reactions to the user never go through here. */
    ambient(pool, chance) {
      const gap = AMBIENT_GAP[this.cfg.chatty];
      if (!gap || this.time - this.lastAmbient < gap || this.bubbleVisible()) return false;
      if (chance != null && this.R() > chance) return false;
      this.lastAmbient = this.time; this.speak(pool); return true;
    }
    chatter(force) { this.say(this.msgs.random(this.id, this.ctx()), { force }); }
    sayLater(msg, delay, force) { this.pending = { at: this.time + delay, msg, force }; }
    bubbleVisible() { return this.time < this.bubbleUntil; }

    /* ───────────── physics helpers ───────────── */
    jump(v) { this.vy = -v; this.oy = Math.min(this.oy, -0.01); this.sq = -0.14; this.out.push({ type: 'sound', name: 'hop' }); }
    kick(kind) { this.kicks[kind] = 1; }

    startAct(name) {
      const def = ACTS[name];
      if (!def) return false;
      this.act = { name, def, t0: this.time, dur: def.dur, f: {} };
      if (def.start) def.start(this, this.act);
      return true;
    }

    /* ───────────── lifecycle moments ───────────── */
    hello() {
      this.setMood('happy', 1.6);
      this.fx.sparkles(32, this.meta.top + 10, 4, 26);
      this.jump(60);
      this.sayLater(this.msgs.greeting(this.id, this.ctx()), 0.9);
    }
    goodbye() { this.stopWalk(); this.act = null; this.thought = null; this.setMood('sad', 2); this.say(this.msgs.line(this.id, 'bye', this.ctx()), { force: true }); }
    setPet(id) {
      this.id = id; this.act = null; this.thought = null; this.prop = null; this.fx.clear(); this.pending = null;
      this.stopWalk(); this.state = 'idle'; this.sleepy = 0; this.reschedule(false);
      this.lastMove = this.lastTouch = this.time;
      this.fx.puff(32, 52, 6); this.fx.sparkles(32, this.meta.top + 12, 5, 30);
      this.jump(66); this.setMood('happy', 1.8);
      this.sayLater(this.msgs.line(this.id, 'adopt', this.ctx()), 0.8, true);
    }

    command(type) {
      switch (type) {
        case 'treat': this.feed(); break;
        case 'pet': this.click(); break;
        case 'trick': this.doubleClick(); break;
        case 'say': this.wakeIfAsleep(); this.chatter(true); break;
        case 'joke': case 'fact': case 'cheer': case 'compliment': case 'care': this.wakeIfAsleep(); this.speak(type, true); break;
        case 'nap': if (this.state === 'idle' && !this.act) this.startAct('drowse'); break;
        case 'wake': this.wake('touch'); break;
        case 'hello': this.hello(); break;
        case 'goodbye': this.goodbye(); break;
        default: break;
      }
    }
    wakeIfAsleep() { if (this.state === 'sleep') this.wake('touch'); }

    /* ───────────── interactions ───────────── */
    setHover(h) {
      if (h === this.hovering) return;
      this.hovering = h;
      if (h) {
        this.hoverSince = this.time; this.hoverSaid = false;
        this.kick('ear');
        if (this.state === 'idle' && !this.act) this.setMood('wide', 0.4);
      }
    }

    click() {
      const t = this.time;
      this.lastTouch = this.lastMove = t;
      if (this.state === 'sleep') { this.wake('touch'); return; }
      if (this.state === 'walk') this.stopWalk();
      this.clicks = this.clicks.filter((c) => t - c < 3.4); this.clicks.push(t);
      const n = this.clicks.length;
      if (n >= 10) {
        this.clicks.length = 0;
        this.setMood('dizzy', 2.4); this.fx.stars(32, this.meta.top + 6, 2.2); this.sq = 0.25;
        this.say(this.msgs.line(this.id, 'dizzy', this.ctx()), { force: true });
      } else if (n >= 6) {
        this.setMood('squint', 1.3); this.fx.drop(32 + 11, this.meta.top + 8); this.sq = 0.12;
        if (n % 2 === 0) this.speak('petSpam');
      } else {
        this.happy = 1; this.setMood(n % 4 === 0 ? 'love' : 'happy', 1.2); this.sq = 0.22;
        this.kick('ear'); this.kick('flap'); this.kick('gill');
        this.fx.hearts(32, this.meta.top + 2, n % 3 === 0 ? 3 : 1, 14);
        if (this.R() < (n === 1 ? 0.75 : 0.4)) this.speak('petted');
      }
      this.out.push({ type: 'sound', name: 'pet' });
    }

    doubleClick() {
      this.lastTouch = this.lastMove = this.time;
      if (this.state === 'sleep') { this.wake('touch'); return; }
      if (this.state === 'held') return;
      this.stopWalk(); this.thought = null; this.prop = null;
      const tricks = ['spin', 'dance', 'hop2'];
      this.startAct(tricks[Math.floor(this.R() * tricks.length)]);
      this.fx.sparkles(32, this.meta.top + 14, 4, 30);
      this.speak('trick');
      this.out.push({ type: 'sound', name: 'tada' });
    }

    grab() {
      this.lastTouch = this.lastMove = this.time;
      this.stopWalk(); this.act = null; this.thought = null; this.prop = null; this.pending = null;
      this.state = 'held'; this.vy = 0;
      this.fx.bang(32, this.meta.top - 3);
      if (this.R() < 0.75) this.speak('lifted');
      this.out.push({ type: 'sound', name: 'whoa' });
    }
    dragMove(vx) { this.dragVx = vx; this.lastMove = this.lastTouch = this.time; }
    drop() {
      if (this.state !== 'held') return;
      this.state = 'idle'; this.vy = 0; this.oy = -8 * this.held;
      this.lastMove = this.lastTouch = this.time;
      if (Math.abs(this.dragVx) > 700) { this.setMood('dizzy', 1.3); this.fx.stars(32, this.meta.top + 6, 1.4); } else this.setMood('happy', 1.0);
      if (this.R() < 0.7) this.speak('dropped');
      this.nextAct = this.time + 3;
    }

    feed() {
      if (this.state === 'held') return;
      this.stopWalk(); this.thought = null;
      if (this.state === 'sleep') { this.state = 'idle'; }
      this.lastTouch = this.lastMove = this.time;
      this.startAct('eat');
    }

    enterSleep() { this.state = 'sleep'; this.sleptAt = this.time; this.thought = null; this.nextZ = this.time + 0.6; this.nextSleepTalk = this.time + this.rand(90, 240); }
    wake(reason) {
      if (this.state !== 'sleep') return;
      const away = this.time - this.sleptAt;
      this.state = 'idle';
      this.startAct('wakeup');
      this.nextAct = this.time + 3.5;
      if (reason === 'touch') { this.fx.bang(32, this.meta.top - 3); this.speak('startled'); return; }
      if (away > 600) this.speak('back');
      else if (this.R() < 0.65) this.speak('wake');
    }

    startWalk(room) {
      const min = 70, left = room ? room.left : 0, right = room ? room.right : 0;
      if (left < min && right < min) { this.nextRoam = this.time + 45; return; }
      let dir = this.R() < 0.5 ? -1 : 1;
      if (dir < 0 && left < min) dir = 1;
      if (dir > 0 && right < min) dir = -1;
      const maxd = Math.min(dir < 0 ? left : right, 340);
      const dist = min + this.R() * Math.max(0, maxd - min);
      const ms = (dist / WALK_SPEED) * 1000;
      this.state = 'walk'; this.walk = { dir, end: this.time + ms / 1000 + 1.0 };
      this.out.push({ type: 'walk', dx: dir * dist, ms });
      this.ambient('walk', 0.3);
    }
    stopWalk() { if (this.state === 'walk') { this.out.push({ type: 'walk-stop' }); this.walkDone(); } }
    walkDone() { if (this.state === 'walk') { this.state = 'idle'; this.walk = null; this.nextRoam = this.time + this.rand(150, 420); this.nextAct = this.time + 1.2; } }

    pickIdleAct() {
      const w = [['lookAround', 14], ['wiggle', 6], ['hop', 6], ['yawn', 7], ['stretch', 6], ['daydream', 6], ['spin', 3], ['dance', 3], ['shy', 3], ['sneeze', 1.5], ['hiccup', 1.5]];
      for (const s of this.meta.idle || []) w.push([s, 14]);
      if (this.time - this.lastTouch > 600) w.push(['sulk', 7]);
      let total = 0; for (const e of w) total += e[1];
      let x = this.R() * total;
      for (const e of w) { x -= e[1]; if (x < 0) return e[0]; }
      return 'lookAround';
    }

    /* ───────────── the frame ───────────── */
    update(dt, inp) {
      dt = clamp(dt, 0, 0.1);
      inp = inp || {};
      this.time += dt;
      const t = this.time, ov = (this.ov = {});
      const meta = this.meta;

      if (inp.hovering !== undefined) this.setHover(!!inp.hovering);
      if (inp.cursorMoved) { this.lastMove = t; if (this.state === 'sleep' && this.cfg.sleep) this.wake('cursor'); }

      // delayed speech
      if (this.pending && t >= this.pending.at) { const p = this.pending; this.pending = null; this.say(p.msg, { force: p.force }); }

      // run the current scripted action
      if (this.act) {
        const a = this.act, p = clamp((t - a.t0) / a.dur, 0, 1);
        if (a.def.tick) a.def.tick(this, p, dt, a);
        if (p >= 1) { const e = a.def.end; this.act = null; if (e) e(this, a); }
      }

      // state machine
      if (this.state === 'idle' && !this.act) {
        if (this.cfg.sleep && t - this.lastMove > this.cfg.sleepAfter) this.startAct('drowse');
        else if (t >= this.nextAct) { this.startAct(this.pickIdleAct()); this.nextAct = t + this.rand(3.5, 9); }
        else if (this.cfg.roam && t >= this.nextRoam && inp.room) this.startWalk(inp.room);
      }
      if (this.state === 'walk' && this.walk && t > this.walk.end) this.walkDone();

      // spontaneous speech and care reminders
      if (this.state === 'idle' && !this.act && !this.bubbleVisible()) {
        if (t >= this.nextCare && this.cfg.reminders && this.cfg.chatty !== 'silent') { this.nextCare = t + this.rand(1500, 2700); this.lastAmbient = t; this.speak('care'); }
        else if (t >= this.nextMsg) { const iv = CHATTY[this.cfg.chatty]; this.nextMsg = iv ? t + this.rand(iv[0], iv[1]) : Infinity; this.lastAmbient = t; this.chatter(false); }
      }
      if (this.state === 'sleep') {
        if (t >= this.nextZ) { this.nextZ = t + 1.5; this.fx.zzz(32 + 13, meta.top + 3, this.zStep++); }
        if (t >= this.nextSleepTalk) { this.nextSleepTalk = t + this.rand(120, 300); this.speak('sleepTalk'); }
      }
      if (this.hovering && !this.hoverSaid && t - this.hoverSince > 2.4 && this.state === 'idle') { this.hoverSaid = true; this.ambient('hover', 0.5); }

      // physics: gravity + squash spring
      this.held = damp(this.held, this.state === 'held' ? 1 : 0, 12, dt);
      if (this.state === 'held') { this.oy = -8 * this.held; this.vy = 0; }
      else {
        this.vy += G * dt; this.oy += this.vy * dt;
        if (this.oy >= 0) { if (this.vy > 30) { this.sq = Math.max(this.sq, Math.min(0.3, this.vy / 300)); this.out.push({ type: 'sound', name: 'land' }); } this.oy = 0; this.vy = 0; }
      }
      this.sqv += (-170 * this.sq - 13 * this.sqv) * dt; this.sq += this.sqv * dt;
      this.dragVx *= Math.exp(-6 * dt);
      const swingTarget = this.state === 'held' ? clamp(-this.dragVx / 450, -1, 1) : 0;
      this.swingV += (-60 * (this.swing - swingTarget) - 7 * this.swingV) * dt; this.swing += this.swingV * dt;

      // slow variables
      this.happy = Math.max(0, this.happy - dt * 0.35);
      for (const k of Object.keys(this.kicks)) this.kicks[k] = Math.max(0, this.kicks[k] - dt * 1.6);
      this.sleepy = damp(this.sleepy, this.state === 'sleep' ? 1 : (ov.sleepy || 0), 5, dt);
      this.tailPh += dt * (1.8 + 6 * this.happy + (ov.tailSpeed || 0));
      if (this.state === 'walk') this.step += dt * 10;

      // eyes follow the cursor
      let tx, ty;
      if (ov.lookX != null) { tx = ov.lookX; ty = ov.lookY || 0; }
      else if (this.state === 'sleep') { tx = 0; ty = 0.3; }
      else if (this.state === 'walk') { tx = this.walk.dir * 0.7; ty = 0; }
      else if (this.cfg.look && inp.look) { tx = Math.tanh(inp.look.dx / 26); ty = Math.tanh(inp.look.dy / 26); }
      else { tx = Math.sin(t * 0.37) * 0.35; ty = Math.sin(t * 0.23 + 1) * 0.2; }
      this.lookX = damp(this.lookX, tx, 14, dt); this.lookY = damp(this.lookY, ty, 14, dt);

      // blinking
      if (t >= this.blinkAt) { this.blinkUntil = t + 0.13; this.blinkAt = t + (this.R() < 0.2 ? 0.3 : 2.2 + this.R() * 3.6); }

      // face
      let eyes = 'open', mouth = 'smile', blush = 0.28;
      if (this.state === 'sleep') { eyes = 'sleep'; mouth = 'sleep'; }
      else if (this.state === 'held') { eyes = 'wide'; mouth = 'o'; }
      if (this.mood && t < this.mood.until && this.state !== 'sleep') { eyes = this.mood.eyes; mouth = this.mood.mouth; blush = Math.max(blush, this.mood.blush || 0); }
      if (this.hovering && t - this.hoverSince > 1.6 && this.state === 'idle' && !(this.mood && t < this.mood.until)) { eyes = 'happy'; blush = 0.65; }
      if (t < this.talkUntil && this.state !== 'sleep' && Math.floor(t * 10) % 2) mouth = 'open';
      if (ov.eyes) eyes = ov.eyes;
      if (ov.mouth) mouth = ov.mouth;
      if (ov.blush != null) blush = ov.blush;
      this.blush = damp(this.blush, blush, 10, dt);

      // body shape
      const breath = Math.sin(t * (this.state === 'sleep' ? 1.1 : 2.1)) * (this.state === 'sleep' ? 0.035 : 0.016);
      const sq = this.sq + (ov.sq || 0);
      let sy = 1 - sq * 0.85 + (ov.syAdd || 0) + breath;
      let sx = 1 + sq * 0.65 + (ov.sxAdd || 0);
      if (this.oy < -1.5) { const air = clamp(-this.vy / 90, -0.5, 1); sy += 0.06 * air; sx -= 0.04 * air; }
      if (ov.sx != null) sx = ov.sx;

      const walking = this.state === 'walk';
      const p = this.pose;
      p.t = t;
      p.ox = ov.ox != null ? ov.ox : (walking ? Math.round(Math.sin(this.step) * 0.9) : 0);
      p.oy = Math.round(this.oy);
      p.sx = clamp(sx, 0.12, 1.3);
      p.sy = clamp(sy, 0.72, 1.22);
      p.lookX = this.lookX; p.lookY = this.lookY;
      p.eyes = eyes; p.mouth = mouth;
      p.blink = t < this.blinkUntil ? 1 : 0;
      p.blush = this.blush;
      p.step = this.step; p.walking = walking ? 1 : 0;
      p.sleepy = this.sleepy; p.held = this.held; p.swing = this.swing;
      p.flap = Math.max(ov.flap || 0, this.kicks.flap * (0.5 + 0.5 * Math.sin(t * 24)));
      p.ear = ov.ear != null ? ov.ear : this.kicks.ear * Math.sin(t * 34);
      p.gill = Math.max(ov.gill || 0, this.kicks.gill);
      p.tail = this.tailPh;
      p.back = !!ov.back;

      this.fx.update(dt);
      return p;
    }

    /** Draw everything that is not the pet itself (call after Pets.render). */
    drawFx(buf) {
      if (this.prop) Effects.treat(buf, this.prop.kind, this.prop.x, this.prop.y, this.prop.spin);
      if (this.thought) Effects.thought(buf, 44, this.meta.top - 6 + Math.round(Math.sin(this.time * 2.2)), this.thought.icon);
      this.fx.draw(buf);
    }
  }

  PetBrain.CHATTY = CHATTY;
  PetBrain.ACTS = ACTS;
  return PetBrain;
});
