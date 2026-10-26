/* ============================================================
 * PIXEL PALS — pet renderer v3
 * ------------------------------------------------------------
 * FIXES / NEW in v3:
 * - Bubble anchored via GPU-composited transform on a wrapper
 *   (#bubble-anchor) instead of layout writes to style.bottom.
 *   This keeps the bubble glued to the pet while the OS window
 *   moves (fixes "message slides off while dragging").
 * - Bubble pop animation lives on the inner element and can
 *   never fight the position anchor again.
 * - QUESTIONS: the pet asks YOU things with clickable choice
 *   buttons (yes/no, this-or-that, trivia, RPS, coin flip,
 *   magic 8-ball, knock-knock, feelings, snack picker).
 * - Interactions: tickle (wiggle mouse over pet), scroll wheel
 *   reactions, shake-while-drag detection, story time, guided
 *   breathing, session stats, boba snack, animalese typing.
 * - Keyboard: main process global shortcuts route to commands;
 *   Alt+Shift+1/2/3 answers open questions (see main.js).
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- constants ---------------- */
  const W = 340, H = 400;
  const SCALE = 6;                 // sprite pixel size on screen
  const SPR = 32;                  // sprite grid size
  const CENTER_X = 170;
  const GROUND_Y = 372;            // where the paws rest

  const params = new URLSearchParams(location.search);
  const PET_ID = params.get('pet') || 'mochi';
  const sprite = PIXEL_PALS.build(PET_ID);
  const FLOATS = !!sprite.meta.float;
  const MSG = window.PET_MESSAGES;
  const SFX = window.PET_SFX;

  /* ---------------- canvas (DPR-aware!) ---------------- */
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  // base transform: everything below is drawn in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  /* ---------------- runtime state ---------------- */
  const settings = {
    sound: true, messages: true, eyeTracking: true, wander: true, sleep: true,
    waterReminder: false, waterEveryMin: 45,
    stretchReminder: false, stretchEveryMin: 50,
    hourlyChime: false
  };
  let mode = 'idle';              // idle | drag | fling | sleep | pet | dance | breathe
  let winX = 0, winY = 0;         // window origin on screen (from main)
  let cursor = { x: -9999, y: -9999 };
  let localCursor = { x: -9999, y: -9999 };
  let hovering = false;
  let lastInteraction = Date.now();
  const bootAt = Date.now();
  let interactionCount = 0;

  // spring squash-stretch
  let sx = 1, sy = 1, vsx = 0, vsy = 0;
  function impulseSquash(a) { vsy -= a; vsx += a * 0.7; }
  function impulseStretch(a) { vsy += a; vsx -= a * 0.7; }

  // hop
  let hop = null;
  // fling tumble
  let flingStart = 0, wasFlung = false;
  // happy burst
  let petUntil = 0;
  // dance
  let danceUntil = 0, lastNoteAt = 0;
  // squish (hold)
  let mouseDown = false, downAt = 0, downPos = null, squishing = false, squishTimer = null, squishHeartTimer = null;
  // poke combo
  let pokeTimes = [], dizzyUntil = 0, dizzyCoolUntil = 0, wideUntil = 0, spinUntil = 0;
  // tickle
  let tickleSamples = [], tickleCoolUntil = 0, tickleUntil = 0;
  // wheel
  let lastWheelAt = 0, wheelHopCount = 0, wheelHopResetAt = 0;
  // shake during drag
  let shakeSamples = [], shakeDetected = false;
  // blink
  let nextBlink = 0, blinkUntil = 0;
  // pupils
  let pupil = { x: 0, y: 0 };
  let lookOverride = null;
  // tail
  let tailFrame = 0, tailToggleAt = 0;
  // slime sprout
  let sproutFrame = 0;
  // particles
  const particles = [];
  // snack
  let snack = null;               // {kind,x,y,vy,state,bites,nextMunch}
  // mood
  let mood = 72, moodDecayAt = 0;
  // wander
  let wanderState = null, nextWanderAt = 0;
  // sleep
  let zTimer = null, sleepTalkTimer = null;
  // breathing exercise
  let breatheStart = 0, breathePhase = -1, breatheUntil = 0;
  // bubble
  const anchorEl = document.getElementById('bubble-anchor');
  const bubbleEl = document.getElementById('bubble');
  const bubbleText = document.getElementById('bubble-text');
  const bubbleChoicesEl = document.getElementById('bubble-choices');
  let bubbleTimer = null, typeTimer = null, bubbleQueue = [], lastSayEnd = 0;
  let bubbleY = 0;                // current anchor y (for hover math)
  // questions
  let ask = null;                 // {choices:[{label,fn}], timer, h}
  let lastAskAt = 0;
  // messages
  let nextChatterAt = 0, lastTimeBucket = null, bags = {};
  // focus
  let focus = { active: false, endsAt: 0, totalMin: 0, halfSaid: false };
  // reminders
  let nextWaterAt = 0, nextStretchAt = 0, lastChimeHour = -1;
  // keyboard hint
  let kbHintAt = Date.now() + 75000, kbHintShown = false;

  const now = () => Date.now();
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const arr = (v) => Array.isArray(v) ? v : [v];

  function isNight() {
    const h = new Date().getHours();
    return h >= 22 || h < 7;
  }

  function fmtDur(ms) {
    const m = Math.max(1, Math.round(ms / 60000));
    if (m < 60) return m + 'm';
    return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
  }

  /* ---------------- shuffle bags ---------------- */
  function drawFrom(key, v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (!Array.isArray(v)) return null;
    if (!bags[key] || !bags[key].length) {
      bags[key] = v.slice();
      for (let i = bags[key].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bags[key][i], bags[key][j]] = [bags[key][j], bags[key][i]];
      }
    }
    return bags[key].pop();
  }

  function timeBucket() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    if (h >= 5 && h < 11.5) return 'morning';
    if (h >= 11.5 && h < 17) return 'afternoon';
    if (h >= 17 && h < 22) return 'evening';
    return 'night';
  }

  function dayKey() {
    const d = new Date().getDay();
    if (d === 1) return 'monday';
    if (d === 5) return 'friday';
    if (d === 0 || d === 6) return 'weekend';
    return null;
  }

  function fmtTime() {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  function dayProgress() {
    const d = new Date();
    const secs = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    return Math.round((secs / 86400) * 100);
  }

  function fillTemplate(t) {
    return String(t)
      .replace('%TIME', fmtTime())
      .replace('%PCT', String(dayProgress()))
      .replace('%DUR', fmtDur(now() - bootAt))
      .replace('%MIN', String(arguments[1] != null ? arguments[1] : ''));
  }

  function pickIdleLine() {
    const bucket = timeBucket();
    if (bucket !== lastTimeBucket) {
      lastTimeBucket = bucket;
      return fillTemplate(drawFrom('greet' + bucket, MSG.greet[bucket]));
    }
    const dk = dayKey();
    if (dk && Math.random() < 0.14) return fillTemplate(drawFrom('day' + dk, MSG.day[dk]));

    if (mood < 30 && Math.random() < 0.25) return fillTemplate(drawFrom('lonely', MSG.react.lonely));

    const roll = Math.random();
    if (roll < 0.20) return fillTemplate(drawFrom('idle', MSG.idle));
    if (roll < 0.38) return fillTemplate(drawFrom('pet' + PET_ID, MSG.pets[PET_ID]));
    if (roll < 0.48) return fillTemplate(drawFrom('jokes', MSG.jokes));
    if (roll < 0.58) return fillTemplate(drawFrom('facts', MSG.facts));
    if (roll < 0.67) return fillTemplate(drawFrom('encourage', MSG.encourage));
    if (roll < 0.75) return fillTemplate(drawFrom('whimsy', MSG.whimsy));
    if (roll < 0.82) return fillTemplate(drawFrom('compliments', MSG.compliments));
    if (roll < 0.90) return fillTemplate(drawFrom('showerThoughts', MSG.showerThoughts));
    return fillTemplate(drawFrom('procrastinate', MSG.procrastinate));
  }

  /* ============================================================
   * SPEECH BUBBLE
   * Position lives on #bubble-anchor (composited transform,
   * updated every frame in render()). Pop animation lives on
   * #bubble itself. They never interfere — this is the fix for
   * the bubble trailing off the pet during window drags.
   * ============================================================ */
  function showBubble() {
    bubbleEl.classList.remove('hidden');
    bubbleEl.classList.add('show');
  }
  function hideBubble() {
    bubbleEl.classList.remove('show');
    bubbleEl.classList.add('hidden');
  }

  function clearType() {
    if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
  }
  function clearHold() {
    if (bubbleTimer) { clearTimeout(bubbleTimer); bubbleTimer = null; }
  }

  // typewriter with tiny "animalese" blips (very quiet, every 2nd char)
  function typeInto(text, onDone) {
    clearType();
    bubbleText.textContent = '';
    showBubble();
    SFX.pop();
    let i = 0;
    typeTimer = setInterval(() => {
      i++;
      bubbleText.textContent = text.slice(0, i);
      if (i % 2 === 0 && text[i - 1] && text[i - 1] !== ' ') SFX.blip(text[i - 1]);
      if (i >= text.length) {
        clearType();
        if (onDone) onDone();
      }
    }, 22);
  }

  function holdThenHide(dur, done) {
    clearHold();
    bubbleTimer = setTimeout(() => {
      bubbleTimer = null;
      hideBubble();
      lastSayEnd = now();
      setTimeout(pumpBubble, 400);
      if (done) done();
    }, dur);
  }

  // How long a finished line stays readable before hiding.
  // Calm pace: even short lines get a comfy minimum hold.
  function holdFor(text, custom) {
    if (custom) return custom;
    return Math.min(2400 + String(text).length * 55, 8500);
  }

  function say(text, opts) {
    opts = opts || {};
    if (!text) return;
    const cap = opts.important ? 4 : 2;
    if (bubbleQueue.length >= cap) return;
    bubbleQueue.push({ text: fillTemplate(String(text), opts.min), done: opts.done, hold: opts.hold });
    pumpBubble();
  }

  function pumpBubble() {
    if (typeTimer || ask) return;
    // Never yank a line that is still on screen: if the previous
    // message is in its hold phase, wait — its hide timer re-pumps
    // the queue when it is done. This is the fix for "message
    // appears and disappears suddenly to show a new message".
    if (bubbleTimer) return;
    const item = bubbleQueue.shift();
    if (!item) return;
    clearHold();
    typeInto(item.text, () => {
      holdThenHide(holdFor(item.text, item.hold), item.done);
    });
  }

  function clearBubble() {
    closeAsk();
    bubbleQueue = [];
    clearHold();
    clearType();
    hideBubble();
  }

  /* ============================================================
   * QUESTIONS — the pet asks, YOU answer with buttons
   * (or Alt+Shift+1/2/3 — see main.js keyboard shortcuts)
   * ============================================================ */
  function openAsk(questionText, choices, opts) {
    opts = opts || {};
    closeAsk();
    bubbleQueue = [];
    clearHold();
    ask = { choices: choices, timer: null, h: 0 };
    lastAskAt = now();
    bubbleEl.classList.add('ask');       // enables pointer events on bubble
    typeInto(questionText, () => {
      if (!ask) return;
      bubbleChoicesEl.innerHTML = '';
      choices.forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = '<b>' + (i + 1) + '</b>' + c.label;
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          answerAsk(i);
        });
        bubbleChoicesEl.appendChild(b);
      });
      if (ask) ask.h = bubbleEl.offsetHeight;
      SFX.click();
    });
    ask.timer = setTimeout(() => {
      if (!ask) return;
      closeAsk();
      if (settings.messages) say(drawFrom('askTimeout', MSG.ask.timeout));
    }, opts.timeout || 45000);
  }

  function answerAsk(i) {
    if (!ask || !ask.choices[i]) return;
    const c = ask.choices[i];
    closeAsk();
    interactionCount++;
    bumpMood(4);
    interacted();
    SFX.click();
    impulseSquash(0.1);
    if (c.fn) c.fn();
  }

  function closeAsk() {
    if (!ask) return;
    if (ask.timer) { clearTimeout(ask.timer); ask.timer = null; }
    ask = null;
    bubbleChoicesEl.innerHTML = '';
    bubbleEl.classList.remove('ask');
  }

  /* ---------------- question builders ---------------- */
  function canAsk() {
    return !ask && mode !== 'drag' && mode !== 'fling' && mode !== 'dance' && !snack;
  }

  function askRandom() {
    if (!canAsk()) return;
    if (mode === 'sleep') wake(false);
    if (mode === 'breathe') return;
    const roll = Math.random();
    if (roll < 0.24) askYesNo();
    else if (roll < 0.46) askThisOrThat();
    else if (roll < 0.64) askTrivia();
    else if (roll < 0.76) askFeelings();
    else if (roll < 0.84) askSnack();
    else if (roll < 0.90) askRPS();
    else if (roll < 0.95) askEightball();
    else if (roll < 0.98) askKnock();
    else askCoin();
  }

  function askYesNo() {
    const item = drawFrom('askYesno', MSG.ask.yesno);
    if (!item) return;
    openAsk(item.q, [
      { label: 'Yes!', fn: () => { bumpMood(3); say(pick(item.yes), { important: true }); } },
      { label: 'Nope', fn: () => say(pick(item.no), { important: true }) }
    ]);
  }

  function askThisOrThat() {
    const item = drawFrom('askThisOrThat', MSG.ask.thisOrThat);
    if (!item) return;
    const choices = [
      { label: item.a, fn: () => say(pick(arr(item.ra)), { important: true }) },
      { label: item.b, fn: () => say(pick(arr(item.rb)), { important: true }) }
    ];
    if (item.tie) choices.push({ label: 'Both!', fn: () => say(item.tie, { important: true }) });
    openAsk(item.q, choices);
  }

  function askTrivia() {
    const item = drawFrom('askTrivia', MSG.ask.trivia);
    if (!item) return;
    const choices = item.choices.map((label, i) => ({
      label: label,
      fn: () => {
        if (i === item.answer) {
          bumpMood(6);
          spawn('heart', 6, petOrigin());
          spawn('star', 4, headOrigin());
          SFX.correct();
          say(pick(item.right), { important: true });
        } else {
          SFX.wrong();
          say(pick(item.wrong), { important: true });
        }
      }
    }));
    openAsk(item.q, choices);
  }

  function askFeelings() {
    const f = MSG.ask.feelings;
    if (!f) return;
    const boosts = [8, 2, 0];
    const choices = f.choices.map((c, i) => ({
      label: c.label,
      fn: () => {
        bumpMood(boosts[i] || 0);
        if (i === 2) spawn('heart', 3, petOrigin());
        if (i === 0) doHop(16, 320);
        say(pick(c.react), { important: true });
      }
    }));
    openAsk(f.q, choices);
  }

  function askSnack() {
    const s = MSG.ask.snack;
    if (!s) return;
    const kinds = [
      { key: 'cookie', label: 'Cookie' },
      { key: 'donut', label: 'Donut' },
      { key: 'boba', label: 'Boba' }
    ];
    openAsk(s.q, kinds.map((k) => ({
      label: k.label,
      fn: () => {
        if (mode === 'sleep') wake(false);
        say(pick(s.lines[k.key]), { important: true });
        dropSnack(k.key);
      }
    })));
  }

  function askRPS() {
    const r = MSG.ask.rps;
    if (!r) return;
    const names = ['Rock', 'Paper', 'Scissors'];
    openAsk(pick(r.intro), names.map((label, i) => ({
      label: label,
      fn: () => {
        const mine = Math.floor(Math.random() * 3);
        SFX.drum();
        let outcome;
        if (i === mine) outcome = 'tie';
        else if ((i - mine + 3) % 3 === 1) outcome = 'lose';   // player beat pet
        else outcome = 'win';                                   // pet beat player
        const beats = ['Rock crushes Scissors!', 'Paper covers Rock!', 'Scissors cut Paper!'];
        // the reveal waits until the drumroll line has fully shown —
        // a queued say used to cut the drumroll off mid-display
        say('Drumroll...', { important: true, hold: 1500, done: () => {
          if (outcome === 'tie') {
            bumpMood(2);
            say(pick(r.tie) + ' We both picked ' + names[mine].toLowerCase() + '!', { important: true });
          } else if (outcome === 'lose') {
            bumpMood(3);
            spawn('heart', 4, petOrigin());
            say(pick(r.lose) + ' ' + beats[i], { important: true });
          } else {
            say('I picked ' + names[mine].toLowerCase() + '! ' + beats[mine] + ' ' + pick(r.win), { important: true });
          }
        }});
      }
    })));
  }

  function askCoin() {
    const c = MSG.ask.coin;
    if (!c) return;
    openAsk(pick(c.intro), [
      { label: 'Flip it!', fn: () => {
        doHop(20, 360);
        SFX.whoosh();
        setTimeout(() => {
          const heads = Math.random() < 0.5;
          if (heads) { spawn('sparkle', 4, headOrigin()); say(pick(c.heads), { important: true }); }
          else { spawn('star', 3, headOrigin()); say(pick(c.tails), { important: true }); }
        }, 500);
      } }
    ]);
  }

  function askEightball() {
    const e = MSG.ask.eightball;
    if (!e) return;
    openAsk(pick(e.intro), [
      { label: 'Ask!', fn: () => {
        dizzyUntil = now() + 900;
        SFX.wobble();
        setTimeout(() => {
          SFX.sparkle();
          say(drawFrom('eightballA', e.answers), { important: true });
        }, 950);
      } }
    ]);
  }

  function askKnock() {
    const k = MSG.ask.knock;
    if (!k) return;
    const item = drawFrom('askKnock', MSG.knockKnock);
    if (!item) return;
    const m = item.setup.match(/^Knock knock\. Who is there\? (.+)\.$/);
    const answer = m ? m[1] + '.' : item.who;
    openAsk(pick(k.intro), [
      { label: 'Sure!', fn: () => {
        // chain each step AFTER the previous line has fully shown
        // (blind setTimeouts used to swap messages mid-display)
        say('Knock knock!', { important: true, hold: 1400, done: () => {
          openAsk('Who is there?', [
            { label: 'Hmm... who?', fn: () => {
              say(answer, { important: true, done: () => {
                openAsk(item.who, [
                  { label: '...who?', fn: () => {
                    SFX.giggle();
                    spawn('heart', 3, petOrigin());
                    say(item.punch, { important: true });
                  } }
                ], { timeout: 30000 });
              }});
            } }
          ], { timeout: 30000 });
        }});
      } },
      { label: 'Later!', fn: () => say(drawFrom('askTimeout', MSG.ask.timeout), { important: true }) }
    ]);
  }

  /* ---------------- particles ---------------- */
  const HEART = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0]
  ];
  const SPARK = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ];
  const DROP = [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 2, 1, 1],
    [1, 2, 2, 2, 1],
    [0, 1, 1, 1, 0]
  ];
  const NOTE_COLORS = ['#ff6d8a', '#7ec8ff', '#ffd76e', '#a5e29a'];
  const CRUMB_COLORS = ['#8a5a34', '#b07a4a', '#d8b28a'];

  function spawn(type, n, origin, extra) {
    for (let i = 0; i < n; i++) {
      const p = {
        type,
        x: origin.x + rand(-30, 30),
        y: origin.y + rand(-10, 6),
        vx: rand(-16, 16),
        vy: rand(-70, -30),
        life: type === 'z' ? 2.2 : rand(0.9, 1.5),
        age: 0,
        size: rand(0.7, 1.3),
        sway: rand(0, Math.PI * 2),
        color: null,
        angle: 0
      };
      if (type === 'note') p.color = pick(NOTE_COLORS);
      if (type === 'crumb') { p.color = pick(CRUMB_COLORS); p.vy = rand(30, 90); p.vx = rand(-50, 50); p.life = rand(0.5, 0.9); }
      if (type === 'drop') { p.vy = rand(40, 90); p.vx = rand(-10, 10); p.life = rand(0.8, 1.3); }
      if (type === 'streak') { p.angle = (extra && extra.angle) || 0; p.vx = 0; p.vy = 0; p.life = rand(0.25, 0.4); p.x = origin.x + rand(-40, 40); p.y = origin.y + rand(-30, 30); }
      if (type === 'ring') { p.life = 0.55; p.vx = 0; p.vy = 0; }
      if (extra) Object.assign(p, extra);
      particles.push(p);
    }
  }
  function petOrigin() {
    return { x: CENTER_X, y: GROUND_Y - 96 - hopY() - floatLift() };
  }
  function headOrigin() {
    return { x: CENTER_X + rand(-16, 16), y: GROUND_Y - 150 - hopY() - floatLift() };
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) { particles.splice(i, 1); continue; }
      p.sway += dt * 5;
      if (p.type === 'crumb' || p.type === 'drop') p.vy += 420 * dt;
      else if (p.type !== 'z' && p.type !== 'streak' && p.type !== 'ring') p.vy += 30 * dt;
      p.x += (p.vx + (p.type === 'heart' ? Math.sin(p.sway) * 14 : 0) + (p.type === 'note' ? Math.sin(p.sway * 0.8) * 10 : 0)) * dt;
      p.y += p.vy * dt;
    }
  }

  function drawMap(map, x, y, s, colorBody, colorShade) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(s, s);
    ctx.translate(-map[0].length / 2, -map.length / 2);
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        const v = map[r][c];
        if (!v) continue;
        ctx.fillStyle = v === 2 ? (colorShade || '#d94f6e') : colorBody;
        ctx.fillRect(c, r, 1, 1);
      }
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      const t = p.age / p.life;
      const alpha = t < 0.15 ? t / 0.15 : 1 - Math.max(0, (t - 0.6) / 0.4);
      ctx.globalAlpha = clamp(alpha, 0, 1);
      if (p.type === 'heart' || p.type === 'sparkle') {
        const map = p.type === 'heart' ? HEART : SPARK;
        const s = (p.type === 'heart' ? 2.6 : 2.2) * p.size;
        drawMap(map, p.x, p.y, s, p.type === 'heart' ? '#ff6d8a' : '#ffd76e', '#d94f6e');
      } else if (p.type === 'drop') {
        drawMap(DROP, p.x, p.y, 2.4 * p.size, '#5db8f0', '#a9e2ff');
      } else if (p.type === 'z') {
        ctx.font = `${Math.round(15 * p.size + p.age * 6)}px VT323, monospace`;
        ctx.fillStyle = '#5b6b9e';
        ctx.fillText('z', Math.round(p.x), Math.round(p.y));
      } else if (p.type === 'star') {
        ctx.fillStyle = '#ffd76e';
        const s = 7 * p.size;
        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(p.sway * 0.5);
        ctx.fillRect(-s / 2, -1, s, 2);
        ctx.fillRect(-1, -s / 2, 2, s);
        ctx.fillRect(-s / 4, -s / 4, 2, 2);
        ctx.fillRect(s / 4 - 2, s / 4 - 2, 2, 2);
        ctx.restore();
      } else if (p.type === 'note') {
        const s = 2.2 * p.size;
        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.scale(s, s);
        ctx.fillStyle = p.color;
        ctx.fillRect(0, 3, 3, 2);       // note head
        ctx.fillRect(2, 0, 1, 4);       // stem
        ctx.fillRect(3, 0, 2, 1);       // flag
        ctx.fillRect(3, 1, 1, 1);
        ctx.restore();
      } else if (p.type === 'crumb') {
        ctx.fillStyle = p.color;
        const s = 3 * p.size;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      } else if (p.type === 'streak') {
        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(p.angle);
        ctx.fillStyle = '#ffffff';
        const len = 26 * (1 - t) + 8;
        ctx.fillRect(-len / 2, -1, len, 2);
        ctx.restore();
      } else if (p.type === 'ring') {
        const r = 8 + t * 46;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(Math.round(p.x), Math.round(p.y), r, r * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- snacks ---------------- */
  const SNACKS = {
    cookie: {
      map: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 1, 1, 2, 1],
        [1, 1, 1, 2, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0]
      ],
      base: '#e0a866', chip: '#7a4a26'
    },
    donut: {
      map: [
        [0, 2, 2, 2, 2, 2, 0],
        [2, 2, 3, 2, 3, 2, 2],
        [2, 3, 0, 0, 0, 3, 2],
        [2, 2, 0, 0, 0, 2, 2],
        [2, 3, 0, 0, 0, 3, 2],
        [2, 2, 2, 3, 2, 2, 2],
        [0, 2, 2, 2, 2, 2, 0]
      ],
      base: '#f2c98a', chip: '#ff9fb2', extra: '#ffd76e'
    },
    boba: {
      map: [
        [0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 2, 1, 2, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 2, 1, 2, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0]
      ],
      base: '#f2e3c8', chip: '#5a3220', extra: '#ff8fa8'
    }
  };

  function dropSnack(kind) {
    if (snack) return;
    const kinds = Object.keys(SNACKS);
    snack = {
      kind: kind && SNACKS[kind] ? kind : pick(kinds),
      x: CENTER_X + rand(-46, 46),
      y: -16,
      vy: 40,
      state: 'falling',
      bites: 3,
      nextMunch: 0
    };
  }

  function updateSnack(dt, t) {
    if (!snack) return;
    if (snack.state === 'falling') {
      snack.vy = Math.min(420, snack.vy + 380 * dt);
      snack.y += snack.vy * dt;
      const mouthY = GROUND_Y - 140 - hopY() - floatLift();
      if (snack.y >= mouthY) {
        snack.state = 'eating';
        interacted();
        bumpMood(12);
        impulseSquash(0.18);
      }
    } else if (snack.state === 'eating') {
      if (t >= snack.nextMunch) {
        snack.nextMunch = t + 300;
        snack.bites--;
        SFX.munch();
        spawn('crumb', 3, { x: snack.x, y: snack.y + 8 });
        impulseSquash(0.1);
        if (snack.bites <= 0) {
          snack = null;
          spawn('heart', 5, petOrigin());
          if (settings.messages) say(drawFrom('feed', MSG.react.feed), { important: true });
          setMode('idle');
        }
      }
    }
  }

  function drawSnack() {
    if (!snack) return;
    const def = SNACKS[snack.kind];
    const s = 3.4;
    ctx.save();
    ctx.translate(Math.round(snack.x), Math.round(snack.y));
    if (snack.state === 'falling') ctx.rotate(Math.sin(now() / 90) * 0.12);
    ctx.scale(s, s);
    ctx.translate(-3.5, -3);
    const map = def.map;
    // shrink as bites are taken
    const frac = snack.state === 'eating' ? snack.bites / 3 : 1;
    if (frac < 1) {
      ctx.beginPath();
      ctx.rect(-4, -4 - (1 - frac) * 10, 8, 8 + (1 - frac) * 10 + 1);
      ctx.clip();
    }
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        const v = map[r][c];
        if (!v) continue;
        ctx.fillStyle = v === 1 ? def.base : (v === 2 ? def.chip : (def.extra || def.chip));
        ctx.fillRect(c, r, 1, 1);
      }
    }
    ctx.restore();
  }

  /* ---------------- mood ---------------- */
  function bumpMood(n) {
    mood = clamp(mood + n, 0, 100);
  }

  /* ---------------- animation helpers ---------------- */
  function floatLift() {
    if (!FLOATS) return 0;
    if (mode === 'sleep') return 2;
    return 10 + Math.sin(performance.now() / 700) * 4;
  }

  function hopY() {
    if (!hop) return 0;
    const t = (now() - hop.start) / hop.dur;
    if (t >= 1) { hop = null; return 0; }
    return hop.h * Math.sin(Math.PI * t);
  }

  function doHop(h, dur) {
    hop = { start: now(), dur: dur || 260, h: h || 14 };
  }

  /* ---------------- mode helpers ---------------- */
  function interacted() {
    lastInteraction = now();
    interactionCount++;
    nextChatterAt = lastInteraction + rand(24000, 55000);
    if (mode === 'sleep') wake(false);
  }

  function setMode(m) {
    mode = m;
  }

  function sleep() {
    if (mode === 'sleep') return;
    if (ask) closeAsk();
    setMode('sleep');
    clearBubble();
    if (zTimer) clearInterval(zTimer);
    zTimer = setInterval(() => {
      if (mode !== 'sleep') return;
      spawn('z', 1, { x: CENTER_X + 34, y: GROUND_Y - 150 });
      if (settings.sound && Math.random() < 0.35) SFX.snore();
    }, 1700);
    if (sleepTalkTimer) clearInterval(sleepTalkTimer);
    sleepTalkTimer = setInterval(() => {
      if (mode === 'sleep' && settings.messages && Math.random() < 0.22) {
        say(drawFrom('sleepy', MSG.react.sleepy));
      }
    }, 36000);
  }

  function wake(showLine) {
    if (mode !== 'sleep') return;
    if (zTimer) { clearInterval(zTimer); zTimer = null; }
    if (sleepTalkTimer) { clearInterval(sleepTalkTimer); sleepTalkTimer = null; }
    setMode('idle');
    impulseStretch(0.22);
    if (settings.sound) SFX.yawn();
    if (showLine !== false && settings.messages) say(drawFrom('wake', MSG.react.wake), { important: true });
    scheduleChatter();
  }

  function petMe(big) {
    if (mode === 'sleep') wake(false);
    if (mode === 'dance' || mode === 'breathe') setMode('idle');
    setMode('pet');
    petUntil = now() + 1600;
    impulseSquash(0.2);
    doHop(20, 340);
    spawn('heart', big ? 12 : 7, petOrigin());
    bumpMood(big ? 10 : 6);
    if (settings.sound) SFX.purr();
    if (settings.messages && Math.random() < 0.75) {
      say(drawFrom('petted', MSG.react.petted), { important: true });
    }
    interacted();
  }

  function startDance() {
    if (mode === 'sleep') wake(false);
    if (mode === 'drag' || mode === 'fling') return;
    closeAsk();
    setMode('dance');
    danceUntil = now() + 2800;
    lastNoteAt = 0;
    bumpMood(6);
    interacted();
    if (settings.sound) SFX.dance();
    if (settings.messages && Math.random() < 0.8) {
      say(drawFrom('dance', MSG.react.dance), { important: true });
    }
  }

  function poke() {
    // fast multi-tap = dizzy
    const n = now();
    pokeTimes = pokeTimes.filter((t) => n - t < 1600);
    pokeTimes.push(n);
    bumpMood(3);
    interacted();
    if (pokeTimes.length >= 3 && n > dizzyCoolUntil) {
      pokeTimes = [];
      dizzyCoolUntil = n + 9000;
      dizzyUntil = n + 1900;
      spawn('star', 6, headOrigin());
      if (settings.sound) SFX.dizzy();
      if (settings.messages) say(drawFrom('dizzy', MSG.react.dizzy), { important: true });
      return;
    }
    // single poke: random cute reaction
    const roll = Math.random();
    if (roll < 0.3) {
      // jump scare
      wideUntil = n + 700;
      doHop(30, 380);
      impulseSquash(0.2);
      spawn('sparkle', 3, headOrigin());
      if (settings.sound) SFX.boing();
    } else if (roll < 0.55) {
      // giggle
      spawn('heart', 2, petOrigin());
      impulseSquash(0.14);
      if (settings.sound) SFX.giggle();
    } else if (roll < 0.8) {
      // spin
      spinUntil = n + 620;
      if (settings.sound) SFX.whoosh();
    } else {
      // squish
      impulseSquash(0.22);
      spawn('sparkle', 2, petOrigin());
      if (settings.sound) SFX.boop();
    }
    if (settings.messages && Math.random() < 0.45) {
      say(drawFrom('tapped', MSG.react.tapped));
    }
  }

  /* ---------------- tickle (wiggle mouse over the pet) ---------------- */
  function tickleCheck() {
    if (mouseDown || mode !== 'idle' || wanderState) { tickleSamples = []; return; }
    const n = now();
    while (tickleSamples.length && n - tickleSamples[0].t > 800) tickleSamples.shift();
    // count left/right direction reversals in the recent samples
    let reversals = 0, lastDir = 0;
    for (let i = 1; i < tickleSamples.length; i++) {
      const dx = tickleSamples[i].x - tickleSamples[i - 1].x;
      if (Math.abs(dx) < 3) continue;
      const dir = dx > 0 ? 1 : -1;
      if (lastDir && dir !== lastDir) reversals++;
      lastDir = dir;
    }
    if (reversals >= 6 && n > tickleCoolUntil) {
      tickleCoolUntil = n + 9000;
      tickleSamples = [];
      setMode('pet');
      petUntil = n + 1300;
      spinUntil = n + 560;
      spawn('heart', 6, petOrigin());
      if (settings.sound) SFX.giggle();
      if (settings.messages) say(drawFrom('tickle', MSG.react.tickle), { important: true });
      interacted();
    }
  }

  /* ---------------- scroll wheel reactions ---------------- */
  function onWheel(e) {
    const n = now();
    if (n - lastWheelAt < 650) return;
    if (!(mode === 'idle' || mode === 'pet') || mouseDown || snack) return;
    const r = petRect();
    if (localCursor.x < r.x || localCursor.x > r.x + r.w) return;
    lastWheelAt = n;
    interacted();
    if (e.deltaY < 0) {
      // scroll up = happy hops
      doHop(26, 380);
      impulseStretch(0.2);
      spawn('sparkle', 3, headOrigin());
      if (settings.sound) SFX.boing();
      wheelHopCount++;
      if (n > wheelHopResetAt) wheelHopResetAt = n + 4000;
      if (settings.messages && Math.random() < 0.5) say(drawFrom('wheelUp', MSG.react.wheelUp), { important: true });
    } else {
      // scroll down = squish flat
      impulseSquash(0.3);
      spawn('star', 2, petOrigin());
      if (settings.sound) SFX.boop();
      if (settings.messages && Math.random() < 0.5) say(drawFrom('wheelDown', MSG.react.wheelDown), { important: true });
    }
  }

  /* ---------------- shake detection while dragging ---------------- */
  function shakeCheck() {
    if (mode !== 'drag') { if (!mouseDown) shakeSamples = []; return; }
    const n = now();
    while (shakeSamples.length && n - shakeSamples[0].t > 1000) shakeSamples.shift();
    let reversals = 0, lastDir = 0;
    for (let i = 1; i < shakeSamples.length; i++) {
      const dx = shakeSamples[i].x - shakeSamples[i - 1].x;
      if (Math.abs(dx) < 12) continue;
      const dir = dx > 0 ? 1 : -1;
      if (lastDir && dir !== lastDir) reversals++;
      lastDir = dir;
    }
    if (reversals >= 4) shakeDetected = true;
  }

  /* ---------------- wander ---------------- */
  function scheduleWander() {
    nextWanderAt = now() + rand(60000, 150000);
  }

  function startWander() {
    if (!settings.wander || mode !== 'idle' || wanderState) return;
    if (focus.active || ask) return;
    const steps = 6 + Math.floor(Math.random() * 9);
    const dx = rand(-240, 240);
    const dy = rand(-50, 50);
    wanderState = { i: 0, steps, sdx: dx / steps, sdy: dy / steps };
    if (settings.messages && Math.random() < 0.3) say(drawFrom('wander', MSG.react.wander));
    wanderHop();
  }

  function wanderHop() {
    if (!wanderState) return;
    if (mode !== 'idle' || mouseDown) { wanderState = null; return; }
    const ws = wanderState;
    if (ws.i >= ws.steps) {
      wanderState = null;
      impulseSquash(0.12);
      scheduleWander();
      return;
    }
    ws.i++;
    petAPI.hopMove(Math.round(ws.sdx), Math.round(ws.sdy));
    doHop(rand(10, 18), 235);
    if (ws.i % 3 === 0 && settings.sound) SFX.boing();
    tailToggle();
    setTimeout(wanderHop, 255);
  }

  /* ---------------- chatter ---------------- */
  function scheduleChatter() {
    nextChatterAt = now() + rand(22000, 55000);
  }

  function chatterTick() {
    if (!settings.messages) return;
    if (mode !== 'idle' || mouseDown) return;
    if (focus.active || ask || snack) return;
    if (bubbleTimer || typeTimer || bubbleQueue.length) return;
    if (now() - lastSayEnd < 8000) return;
    if (now() >= nextChatterAt) {
      // occasionally the pet asks YOU a question instead of talking
      if (canAsk() && now() - lastAskAt > 300000 && Math.random() < 0.18) {
        askRandom();
      } else {
        const line = pickIdleLine();
        if (line) say(line);
      }
      scheduleChatter();
    }
  }

  /* ---------------- micro actions ---------------- */
  let nextMicroAt = 0;
  function microTick() {
    if (mode !== 'idle' || wanderState || mouseDown) return;
    if (now() < nextMicroAt) return;
    nextMicroAt = now() + rand(7000, 17000);
    const roll = Math.random();
    if (roll < 0.26) {
      lookOverride = { x: rand(-2, 2), y: rand(-1, 2), until: now() + 1400 };
    } else if (roll < 0.48) {
      tailToggle();
    } else if (roll < 0.66) {
      doHop(rand(8, 14), 300);
      impulseSquash(0.1);
      if (settings.sound && Math.random() < 0.5) SFX.boing();
    } else if (roll < 0.8) {
      impulseStretch(0.16);
    } else if (roll < 0.92) {
      spawn('sparkle', 2, headOrigin());
    } else if (mood > 80) {
      spawn('heart', 1, headOrigin());
    }
  }

  function tailToggle() {
    tailFrame = tailFrame ? 0 : 1;
    tailToggleAt = now();
  }

  /* ---------------- stories ---------------- */
  function tellStory() {
    if (mode === 'drag' || mode === 'fling') return;
    if (mode === 'sleep') wake(false);
    closeAsk();
    setMode('idle');
    interacted();
    bumpMood(5);
    SFX.page();
    const story = drawFrom('stories', MSG.stories);
    if (!story) return;
    say('Story time! ' + story.parts[0], { important: true });
    say(story.parts[1], { important: true });
    say(story.parts[2], { important: true });
  }

  /* ---------------- guided breathing ---------------- */
  function startBreathe() {
    if (mode === 'drag' || mode === 'fling') return;
    if (mode === 'sleep') wake(false);
    closeAsk();
    wanderState = null;
    setMode('breathe');
    breatheStart = now();
    breathePhase = -1;
    breatheUntil = now() + 37500;   // 3 cycles of 12.5s (4s in, 4s hold, 4.5s out)
    interacted();
    say('Breathing break! Just follow me for one minute.', { important: true });
  }

  const BREATHE_PHASE_MS = [4000, 4000, 4500];
  function breatheTick() {
    if (mode !== 'breathe') return;
    const n = now();
    if (n >= breatheUntil) {
      setMode('idle');
      bumpMood(6);
      spawn('heart', 6, petOrigin());
      if (settings.sound) SFX.bell();
      if (settings.messages) say(drawFrom('breatheDone', MSG.react.breatheDone), { important: true });
      return;
    }
    const cyc = (n - breatheStart) % 12500;
    let phase;
    if (cyc < BREATHE_PHASE_MS[0]) phase = 0;
    else if (cyc < BREATHE_PHASE_MS[0] + BREATHE_PHASE_MS[1]) phase = 1;
    else phase = 2;
    if (phase !== breathePhase) {
      breathePhase = phase;
      const bag = phase === 0 ? MSG.react.breatheIn : phase === 1 ? MSG.react.breatheHold : MSG.react.breatheOut;
      // hold: 2600 keeps the line inside its 4s breathing phase
      if (settings.messages && bag) say(drawFrom('breathe' + phase, bag), { important: true, hold: 2600 });
      if (settings.sound) { phase === 2 ? SFX.breathOut() : SFX.breathIn(); }
    }
  }

  // breathing scale factor for render
  function breatheScale() {
    if (mode !== 'breathe') return 1;
    const cyc = (now() - breatheStart) % 12500;
    if (cyc < 4000) return 1 + (cyc / 4000) * 0.12;                    // in
    if (cyc < 8000) return 1.12;                                        // hold
    return 1.12 - ((cyc - 8000) / 4500) * 0.12;                         // out
  }

  /* ---------------- reminders & focus ---------------- */
  function scheduleReminders() {
    nextWaterAt = now() + settings.waterEveryMin * 60000;
    nextStretchAt = now() + settings.stretchEveryMin * 60000;
  }

  function reminderTick() {
    const n = now();
    const busy = mode !== 'idle' || mouseDown || snack || focus.active || ask;
    if (settings.waterReminder && n >= nextWaterAt) {
      nextWaterAt = n + settings.waterEveryMin * 60000;
      if (!busy) {
        SFX.drop();
        spawn('drop', 7, headOrigin());
        if (settings.messages) say(drawFrom('water', MSG.react.water), { important: true });
      }
    }
    if (settings.stretchReminder && n >= nextStretchAt) {
      nextStretchAt = n + settings.stretchEveryMin * 60000;
      if (!busy) {
        impulseStretch(0.34);
        doHop(12, 300);
        SFX.yawn();
        if (settings.messages) say(drawFrom('stretch', MSG.react.stretch), { important: true });
      }
    }
    // hourly chime
    const h = new Date().getHours();
    if (settings.hourlyChime && new Date().getMinutes() === 0 && lastChimeHour !== h) {
      lastChimeHour = h;
      if (!busy && mode === 'idle') {
        SFX.chime();
        if (settings.messages) say(drawFrom('hourly', MSG.timeLines), { important: true });
      }
    }
  }

  function focusStart(minutes) {
    if (mode === 'sleep') wake(false);
    focus.active = true;
    focus.totalMin = minutes;
    focus.endsAt = now() + minutes * 60000;
    focus.halfSaid = false;
    interacted();
    wanderState = null;
    if (settings.sound) SFX.chime();
    if (settings.messages) {
      say(fillTemplate(drawFrom('focusStart', MSG.react.focusStart), minutes), { important: true });
    }
  }

  function focusStop() {
    if (!focus.active) return;
    focus.active = false;
    if (settings.messages) say(drawFrom('focusStop', MSG.react.focusStop), { important: true });
  }

  // main is the timer authority; it sends focus-done when time is up
  function focusTick() {
    if (!focus.active) return;
    const n = now();
    const remainMs = Math.max(0, focus.endsAt - n);
    if (!focus.halfSaid && remainMs < focus.totalMin * 30000 && remainMs > 0) {
      focus.halfSaid = true;
      if (settings.messages) say(drawFrom('focusHalf', MSG.react.focusHalf));
    }
  }

  function showStats() {
    if (mode === 'sleep') wake(false);
    interacted();
    say(fillTemplate(drawFrom('stats', MSG.react.stats)), { important: true });
  }

  /* ---------------- hover / eye tracking ---------------- */
  function petRect() {
    return { x: CENTER_X - 100, y: GROUND_Y - 210 - (FLOATS ? 16 : 0), w: 200, h: 214 };
  }

  function updateHover() {
    let h;
    if (mode === 'drag' || mode === 'fling') h = true;
    else if (ask && ask.h) {
      // interactive bubble: whole bubble strip stays hoverable so
      // the window never click-throughs over the choice buttons
      const r = petRect();
      const bx = CENTER_X - 165, bw = 330;
      const by = bubbleY - ask.h - 6, bh = ask.h + 6;
      const inBubble = localCursor.x >= bx && localCursor.x <= bx + bw &&
                       localCursor.y >= by && localCursor.y <= by + bh;
      const inPet = localCursor.x >= r.x && localCursor.x <= r.x + r.w &&
                    localCursor.y >= r.y && localCursor.y <= r.y + r.h;
      h = inBubble || inPet;
    } else {
      const r = petRect();
      h = localCursor.x >= r.x && localCursor.x <= r.x + r.w &&
          localCursor.y >= r.y && localCursor.y <= r.y + r.h;
    }
    if (h !== hovering) {
      hovering = h;
      petAPI.hover(h);
    }
  }

  function updatePupils() {
    if (!settings.eyeTracking || mode === 'sleep') {
      pupil.x += (0 - pupil.x) * 0.15;
      pupil.y += (0 - pupil.y) * 0.15;
      return;
    }
    let tx = 0, ty = 0;
    if (lookOverride && now() < lookOverride.until) {
      tx = lookOverride.x; ty = lookOverride.y;
    } else {
      const ex = winX + CENTER_X;
      const ey = winY + GROUND_Y - 100;
      const dx = cursor.x - ex;
      const dy = cursor.y - ey;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        tx = clamp(Math.round((dx / dist) * 2.6), -2, 2);
        ty = clamp(Math.round((dy / dist) * 1.8), -1, 2);
      }
    }
    pupil.x += (tx - pupil.x) * 0.22;
    pupil.y += (ty - pupil.y) * 0.22;
  }

  /* ---------------- main loop ---------------- */
  let lastT = performance.now();

  function loop(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    const n = now();

    // springs
    vsy += (-(sy - 1) * 130 - vsy * 11) * dt;
    vsx += (-(sx - 1) * 130 - vsx * 11) * dt;
    sy += vsy * dt;
    sx += vsx * dt;

    // breathing
    let breathe = 1;
    if (mode === 'idle') breathe = 1 + Math.sin(t / 450) * 0.012;
    if (mode === 'sleep') breathe = 1 + Math.sin(t / 1400) * 0.03;
    if (mode === 'drag') breathe = 1.05;
    if (mode === 'dance') breathe = 1 + Math.sin(t / 130) * 0.03;

    // blink scheduling
    if (n >= nextBlink && mode !== 'sleep' && mode !== 'breathe') {
      blinkUntil = n + 130;
      nextBlink = n + (Math.random() < 0.2 ? 300 : rand(2600, 5600));
    }

    // tail wag timing
    const wagSpeed = (mode === 'pet' || mode === 'dance' || (wanderState && mode === 'idle')) ? 170 : 950;
    if (n - tailToggleAt > wagSpeed) tailToggle();

    // sprout sway
    sproutFrame = Math.floor(t / 1600) % 2;

    updatePupils();
    updateHover();
    updateParticles(dt);
    updateSnack(dt, t);
    tickleCheck();
    shakeCheck();
    breatheTick();
    chatterTick();
    microTick();
    reminderTick();
    focusTick();

    // mood decay (1 per 2.5 min, floor 8)
    if (n > moodDecayAt) {
      moodDecayAt = n + 150000;
      if (mood > 8) mood--;
    }

    if (settings.sleep && mode === 'idle' && !wanderState && !mouseDown && !focus.active && !snack && !ask) {
      if (n - lastInteraction > (isNight() ? 75000 : 160000)) sleep();
    }
    if (settings.wander && mode === 'idle' && !wanderState && n >= nextWanderAt && !mouseDown) {
      startWander();
    }
    if (mode === 'pet' && n > petUntil) setMode('idle');
    if (mode === 'dance' && n > danceUntil) setMode('idle');

    // one-time keyboard hint
    if (!kbHintShown && n >= kbHintAt) {
      kbHintShown = true;
      if (settings.messages && mode === 'idle' && !ask) {
        say(drawFrom('kbHint', MSG.keyboardHints));
      }
    }

    render(t);
    requestAnimationFrame(loop);
  }

  /* ---------------- render ---------------- */
  function render(t) {
    ctx.clearRect(0, 0, W, H);

    const hopOffset = hopY();
    const lift = floatLift();
    const ground = GROUND_Y;

    // shadow
    const shadowScale = clamp(1 - hopOffset / 90, 0.55, 1);
    ctx.globalAlpha = 0.16 * shadowScale * (FLOATS ? 0.6 : 1);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(CENTER_X, ground + 6, 64 * sx * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // face / mouth / tail selection
    let face = 'open';
    let mouth = 'idle';
    const n = now();
    if (mode === 'sleep') { face = 'blink'; mouth = null; }
    else if (mode === 'breathe') { face = 'blink'; mouth = null; }
    else if (mode === 'pet' || mode === 'dance') { face = 'happy'; mouth = 'open'; }
    else if (mode === 'drag') { face = 'wide'; mouth = 'open'; }
    else if (mode === 'fling') { face = 'wide'; mouth = 'open'; }
    else if (n < wideUntil) { face = 'wide'; mouth = 'open'; }
    else if (snack && snack.state === 'eating') { face = 'happy'; mouth = 'open'; }
    else if (wanderState) { face = 'open'; mouth = 'smile'; }
    else if (focus.active && mode === 'idle') { face = 'blink'; mouth = null; }
    else if (ask) { face = 'open'; mouth = 'idle'; }
    else if (n < blinkUntil) { face = 'blink'; mouth = 'idle'; }

    let tsx = sx, tsy = sy;
    if (mode === 'drag') { tsy *= 1.07; tsx *= 0.94; }
    if (squishing) { tsy *= 0.86; tsx *= 1.12; }
    if (mode === 'sleep') { tsy *= 0.965; tsx *= 1.03; }
    // guided breathing: slow inflate/deflate
    if (mode === 'breathe') {
      const bs = breatheScale();
      tsy *= bs;
      tsx *= 1 + (1 - bs) * 0.55;
    }

    // dance wiggle
    let rot = 0;
    if (mode === 'dance') {
      rot = Math.sin(t / 110) * 0.14;
      tsy *= 1 + Math.sin(t / 130) * 0.03;
      if (t - lastNoteAt > 300) {
        lastNoteAt = t;
        spawn('note', 1, headOrigin());
      }
    }
    // dizzy wobble
    if (n < dizzyUntil) {
      rot = Math.sin(t / 90) * 0.1;
      if (Math.random() < 0.04) spawn('star', 1, headOrigin());
    }
    // focus meditation: slow deep breath
    if (focus.active && mode === 'idle') tsy *= 1 + Math.sin(t / 1200) * 0.02;

    const wagTail = (mode === 'idle' && !wanderState) || mode === 'pet' || mode === 'dance' || wanderState;
    const tail = wagTail ? (tailFrame ? 1 : 0) : 0;

    let dx = Math.round(pupil.x);
    let dy = Math.round(pupil.y);
    if (face !== 'open') { dx = 0; dy = 0; }

    // fling: tumble + streaks
    if (mode === 'fling') {
      const flip = Math.floor((t - flingStart) / 110) % 2 ? -1 : 1;
      tsx *= flip;
      if (Math.random() < 0.18) {
        spawn('streak', 1, { x: CENTER_X, y: ground - 110 }, { angle: Math.atan2(0.4, 0.6) });
      }
    }

    // spin (poke / tickle reaction)
    if (n < spinUntil) {
      const phase = Math.floor((spinUntil - n) / 155) % 2;
      tsx *= phase ? -1 : 1;
    }

    // sprite (anchored bottom-center, squash from the ground)
    ctx.save();
    ctx.translate(CENTER_X, ground - hopOffset - lift);
    ctx.rotate(rot);
    ctx.scale(SCALE * tsx, SCALE * tsy);
    ctx.translate(-SPR / 2, -30);
    sprite.draw(ctx, {
      face,
      mouth,
      tail,
      sprout: sproutFrame,
      dx, dy,
      bob: (mode === 'idle' && Math.sin(t / 900) > 0.93) ? -1 : 0
    });
    ctx.restore();

    drawSnack();
    drawParticles();

    // ---- bubble anchor: ONE composited transform per frame ----
    // The sprite's top row lands at y = ground - hop - lift - 30*SCALE.
    // Keep the bubble exactly above it. transform (not bottom!) so the
    // bubble rides the GPU layer and never trails the window.
    const petTop = ground - hopOffset - lift - 192;
    bubbleY = clamp(petTop - 12, 6, H - 60);
    anchorEl.style.transform = 'translateY(' + bubbleY.toFixed(1) + 'px)';
  }

  function petWinBounds() { return { x: winX, y: winY, w: W, h: H }; }

  /* ---------------- input ---------------- */
  function cursorLocal() {
    localCursor.x = cursor.x - winX;
    localCursor.y = cursor.y - winY;
  }

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    SFX.unlock();
    interacted();
    wanderState = null;
    mouseDown = true;
    downAt = now();
    downPos = { x: localCursor.x, y: localCursor.y };
    squishing = false;

    // clicking the pet itself dismisses an open question (buttons
    // handle their own clicks and stop propagation)
    if (ask && !e.target.closest('#bubble')) {
      closeAsk();
      say(drawFrom('askTimeout', MSG.ask.timeout));
    }

    if (mode === 'breathe') {
      setMode('idle');
      if (settings.messages) say('Breathing paused! Back to the fun.', { important: true });
    }

    if (mode === 'sleep') {
      wake(true);
      return;
    }

    // begin potential squish (hold in place) — drag begins on real movement
    squishTimer = setTimeout(() => {
      if (!mouseDown || mode === 'drag' || mode === 'fling') return;
      const moved = Math.hypot(localCursor.x - downPos.x, localCursor.y - downPos.y);
      if (moved < 14) {
        squishing = true;
        impulseSquash(0.24);
        spawn('heart', 2, petOrigin());
        if (settings.sound) SFX.purr();
        squishHeartTimer = setInterval(() => {
          if (!squishing) return;
          spawn('heart', 1, petOrigin());
        }, 380);
      }
    }, 420);
  });

  window.addEventListener('mousemove', (e) => {
    localCursor.x = e.clientX; localCursor.y = e.clientY;
    cursor.x = winX + e.clientX; cursor.y = winY + e.clientY;
    tickleSamples.push({ x: localCursor.x, t: now() });
    if (tickleSamples.length > 24) tickleSamples.shift();

    if (mouseDown && !squishing && (mode === 'idle' || mode === 'pet' || mode === 'dance' || mode === 'breathe')) {
      const moved = Math.hypot(localCursor.x - downPos.x, localCursor.y - downPos.y);
      if (moved > 8) {
        if (squishTimer) { clearTimeout(squishTimer); squishTimer = null; }
        if (squishHeartTimer) { clearInterval(squishHeartTimer); squishHeartTimer = null; }
        squishing = false;
        setMode('drag');
        shakeDetected = false;
        petAPI.dragStart();
        if (settings.sound) SFX.boop();
        spawn('sparkle', 2, { x: CENTER_X, y: GROUND_Y - 170 });
      }
    }
  });

  window.addEventListener('wheel', onWheel, { passive: true });

  function releasePointer() {
    if (!mouseDown) return;
    mouseDown = false;
    if (squishTimer) { clearTimeout(squishTimer); squishTimer = null; }
    if (squishHeartTimer) { clearInterval(squishHeartTimer); squishHeartTimer = null; }

    if (squishing) {
      squishing = false;
      impulseSquash(0.18);
      petMe(true);
      return;
    }

    if (mode === 'drag') {
      setMode('idle');
      petAPI.dragEnd();
      impulseSquash(0.12);
      if (shakeDetected) {
        shakeDetected = false;
        dizzyUntil = now() + 2000;
        spawn('star', 6, headOrigin());
        if (settings.sound) SFX.dizzy();
        if (settings.messages) say(drawFrom('shake', MSG.react.shake), { important: true });
      }
      return;
    }

    // simple tap (no drag, no squish) → poke reaction
    const held = now() - downAt;
    if (held < 280) {
      impulseSquash(0.16);
      doHop(10, 240);
      if (settings.sound) SFX.boop();
      poke();
    }
  }

  window.addEventListener('mouseup', releasePointer);
  window.addEventListener('mouseleave', () => {
    if (mouseDown && mode !== 'drag') releasePointer();
  });

  window.addEventListener('dblclick', (e) => {
    if (e.button !== 0) return;
    startDance();
  });

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    petAPI.contextMenu();
  });

  /* ---------------- IPC wiring ---------------- */
  window.petAPI.onCursor((p) => {
    cursor.x = p.x; cursor.y = p.y;
    if (typeof p.wx === 'number') { winX = p.wx; winY = p.wy; }
    cursorLocal();
    if (mode === 'drag') shakeSamples.push({ x: cursor.x, t: now() });
    if (shakeSamples.length > 40) shakeSamples.shift();
  });

  window.petAPI.onState((s) => {
    if (s.bounds) { winX = s.bounds.x; winY = s.bounds.y; }
    Object.assign(settings, s.settings || {});
    SFX.setEnabled(settings.sound);
    scheduleChatter();
    scheduleWander();
    scheduleReminders();
    lastChimeHour = new Date().getHours();
  });

  window.petAPI.onCommand((c) => {
    switch (c.type) {
      case 'say':
        interacted();
        say(pickIdleLine(), { important: true });
        break;
      case 'pet':
        petMe(true);
        break;
      case 'feed':
        if (mode === 'sleep') wake(false);
        closeAsk();
        dropSnack(c.kind);
        interacted();
        break;
      case 'dance':
        startDance();
        break;
      case 'nap':
        if (mode === 'sleep') wake(true); else sleep();
        break;
      case 'wake':
        wake(true);
        break;
      case 'time':
        interacted();
        say(fillTemplate(drawFrom('time', MSG.timeLines)), { important: true });
        break;
      case 'stats':
        showStats();
        break;
      case 'ask':
        interacted();
        askRandom();
        break;
      case 'ask-yesno':
        interacted(); askYesNo();
        break;
      case 'ask-trivia':
        interacted(); askTrivia();
        break;
      case 'ask-feelings':
        interacted(); askFeelings();
        break;
      case 'ask-rps':
        interacted(); askRPS();
        break;
      case 'ask-coin':
        interacted(); askCoin();
        break;
      case 'ask-8ball':
        interacted(); askEightball();
        break;
      case 'ask-knock':
        interacted(); askKnock();
        break;
      case 'ask-snack':
        interacted(); askSnack();
        break;
      case 'choice':
        if (ask) answerAsk(c.index || 0);
        break;
      case 'dismiss':
        if (ask) {
          closeAsk();
          say(drawFrom('askTimeout', MSG.ask.timeout));
        } else if (bubbleTimer || typeTimer || bubbleQueue.length) {
          clearBubble();
          lastSayEnd = now();
        }
        break;
      case 'story':
        tellStory();
        break;
      case 'breathe':
        startBreathe();
        break;
      case 'focus-start':
        focusStart(c.minutes || 25);
        break;
      case 'focus-tick':
        if (focus.active) focusTick();
        break;
      case 'focus-done':
        if (focus.active) {
          focus.active = false;
          bumpMood(10);
          spawn('star', 8, headOrigin());
          spawn('heart', 6, petOrigin());
          SFX.bell();
          if (settings.messages) say(drawFrom('focusDone', MSG.react.focusDone), { important: true });
        }
        break;
      case 'focus-stop':
        focusStop();
        break;
      case 'countdown-done':
        bumpMood(6);
        spawn('star', 9, headOrigin());
        spawn('ring', 2, { x: CENTER_X, y: GROUND_Y - 6 });
        SFX.alarm();
        if (settings.messages) {
          say(fillTemplate(drawFrom('countdownDone', MSG.react.countdownDone), c.minutes), { important: true });
        }
        interacted();
        break;
      case 'countdown-set':
        if (mode === 'sleep') wake(false);
        interacted();
        if (settings.sound) SFX.click();
        say(fillTemplate(drawFrom('countdownSet', MSG.react.countdownSet), c.minutes), { important: true });
        break;
      case 'drag-start':
        wanderState = null;
        shakeDetected = false;
        closeAsk();
        setMode('drag');
        break;
      case 'fling':
        wasFlung = true;
        setMode('fling');
        flingStart = performance.now();
        interacted();
        if (settings.sound) SFX.ouch();
        break;
      case 'settle':
        if (mode === 'drag') setMode('idle');
        if (mode === 'fling') {
          setMode('idle');
          impulseSquash(0.34);
          spawn('ring', 2, { x: CENTER_X, y: GROUND_Y - 6 });
          spawn('star', 5, headOrigin());
          if (settings.messages && Math.random() < 0.6) {
            say(drawFrom('flung', MSG.react.flung), { important: true });
          }
          wasFlung = false;
        } else {
          impulseSquash(0.14);
        }
        interacted();
        break;
      case 'settings':
        Object.assign(settings, c.settings || {});
        SFX.setEnabled(settings.sound);
        scheduleReminders();
        break;
    }
  });

  /* ---------------- boot ---------------- */
  function sendTrayFace() {
    try {
      const c32 = document.createElement('canvas');
      c32.width = 32; c32.height = 32;
      const g = c32.getContext('2d');
      const full = sprite.renderToCanvas(1, { face: 'open', mouth: 'idle', tail: 0 });
      g.imageSmoothingEnabled = false;
      g.drawImage(full, 0, 0, 32, 26, 0, 3, 32, 26);
      petAPI.trayFace(c32.toDataURL('image/png'));
    } catch (e) { /* non-fatal */ }
  }

  setTimeout(() => {
    say(MSG.hello[PET_ID] || 'Hello!', { important: true });
    spawn('sparkle', 5, { x: CENTER_X, y: GROUND_Y - 130 });
    impulseStretch(0.2);
    sendTrayFace();
    scheduleChatter();
    scheduleWander();
    scheduleReminders();
  }, 900);

  requestAnimationFrame(loop);

  // tiny debug/readout hook used by the automated drag test harness
  window.__petdbg = function () {
    return {
      mode: mode,
      mouseDown: mouseDown,
      downPos: downPos,
      localCursor: { x: localCursor.x, y: localCursor.y },
      squishing: squishing,
      hovering: hovering,
      bubbleY: bubbleY,
      askOpen: !!ask,
      shake: shakeDetected
    };
  };
})();
