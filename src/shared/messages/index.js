/**
 * Message engine. Knows nothing about the screen, only about words.
 *
 *   Messages.line(petId, 'petted', ctx)   -> { text, mood, pool }   (reaction lines)
 *   Messages.random(petId, ctx)           -> { text, mood, pool }   (spontaneous chatter)
 *   Messages.greeting(petId, ctx)         -> { text, mood, pool }
 *
 * ctx = { date: Date, reminders: bool, fun: bool }
 *
 * Lines are drawn from shuffled "bags", so nothing repeats until the whole list has been seen,
 * and a global recent-memory stops near-repeats across different lists.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    ['core', 'shared', 'facts', 'mochi', 'waddle', 'axo'].forEach((n) => require('./' + n));
    module.exports = factory(globalThis, Math.random);
  } else root.Messages = factory(root, Math.random);
})(typeof self !== 'undefined' ? self : this, function (g, defaultRandom) {
  'use strict';

  let R = defaultRandom;
  const D = () => g.MessageData;

  /** Expression each pool leans towards (the brain maps these to eyes + mouth). */
  const MOOD = {
    voice: 'calm', idle: 'calm', cheer: 'happy', compliment: 'love', focus: 'glad', wisdom: 'calm', fact: 'wide',
    joke: 'happy', care: 'glad', time: 'calm', week: 'glad', special: 'happy', greet: 'happy', back: 'love', adopt: 'happy',
    bye: 'sad', petted: 'love', petSpam: 'squint', dizzy: 'dizzy', lifted: 'wide', dropped: 'dizzy', fed: 'happy',
    trick: 'happy', startled: 'wide', wake: 'sleepy', sleepTalk: 'sleep', bored: 'sad', hover: 'glad', yawn: 'sleepy',
    daydream: 'glad', walk: 'glad', sneeze: 'squint', hiccup: 'wide',
  };

  const bags = new Map();
  const recent = [];
  const REMEMBER = 36;

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const textOf = (e) => (Array.isArray(e) ? e[0] : e);

  function draw(key, list) {
    let bag = bags.get(key);
    if (!bag || !bag.length) { bag = shuffle(list.slice()); bags.set(key, bag); }
    let idx = bag.length - 1;
    for (let i = bag.length - 1; i >= 0; i--) if (!recent.includes(textOf(bag[i]))) { idx = i; break; }
    const e = bag.splice(idx, 1)[0];
    recent.push(textOf(e));
    if (recent.length > REMEMBER) recent.shift();
    return e;
  }

  const pack = (e, pool) => (Array.isArray(e) ? { text: e[0], mood: e[1] || MOOD[pool] || 'calm', pool } : { text: e, mood: MOOD[pool] || 'calm', pool });

  function period(h) {
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    if (h >= 21 && h < 24) return 'night';
    return 'late';
  }

  function specialKey(date) { return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'); }

  /** Resolve a pool name to a list for this pet and moment. */
  function resolve(petId, pool, ctx) {
    const d = D(), own = (d.pets && d.pets[petId]) || {};
    const date = (ctx && ctx.date) || new Date();
    switch (pool) {
      case 'voice': return { key: petId + ':voice', list: own.idle || [] };
      case 'time': { const p = period(date.getHours()); return { key: 'time:' + p, list: d.core.time[p] }; }
      case 'week': return { key: 'week:' + date.getDay(), list: d.core.week[date.getDay()] };
      case 'special': { const k = specialKey(date); return { key: 'special:' + k, list: d.core.special[k] || [] }; }
      case 'greet': { const p = period(date.getHours()); return { key: 'greet:' + p, list: d.core.greet[p] }; }
      default: {
        const shared = d.core[pool] || d.shared[pool] || d.facts[pool] || [];
        const mine = own[pool];
        // pets prefer their own voice for reactions, but mix in the shared lines too
        if (mine && mine.length && (!shared.length || R() < 0.62)) return { key: petId + ':' + pool, list: mine };
        return { key: 'shared:' + pool, list: shared };
      }
    }
  }

  function line(petId, pool, ctx) {
    const r = resolve(petId, pool, ctx);
    if (!r.list || !r.list.length) return null;
    return pack(draw(r.key, r.list), pool);
  }

  function greeting(petId, ctx) {
    const date = (ctx && ctx.date) || new Date();
    const sp = D().core.special[specialKey(date)];
    if (sp && R() < 0.7) return line(petId, 'special', ctx);
    return line(petId, 'greet', ctx);
  }

  /** Weighted choice of what to chatter about next. */
  function random(petId, ctx) {
    ctx = ctx || {};
    const date = ctx.date || new Date();
    const fun = ctx.fun !== false, care = ctx.reminders !== false;
    const special = !!D().core.special[specialKey(date)];
    const table = [
      ['voice', 28], ['idle', 18], ['cheer', 9], ['compliment', 7], ['focus', 6], ['wisdom', 6],
      ['fact', fun ? 10 : 0], ['joke', fun ? 8 : 0], ['care', care ? 5 : 0], ['time', 9], ['week', 3], ['special', special ? 22 : 0],
    ];
    let total = 0;
    for (const t of table) total += t[1];
    let x = R() * total, pool = 'idle';
    for (const t of table) { x -= t[1]; if (x < 0) { pool = t[0]; break; } }
    return line(petId, pool, ctx) || line(petId, 'idle', ctx);
  }

  /** How many lines exist in total. Handy for the README and the self-test. */
  function stats() {
    const d = D(), out = { shared: 0, pets: {}, total: 0 };
    const count = (o) => Object.values(o).reduce((n, v) => n + (Array.isArray(v) ? v.length : (v && typeof v === 'object' ? count(v) : 0)), 0);
    out.shared = count(d.core) + count(d.shared) + count(d.facts);
    for (const id of Object.keys(d.pets)) out.pets[id] = count(d.pets[id]);
    out.total = out.shared + Object.values(out.pets).reduce((a, b) => a + b, 0);
    return out;
  }

  return {
    line, random, greeting, stats, period, MOOD,
    setRandom(fn) { R = fn || defaultRandom; },
    reset() { bags.clear(); recent.length = 0; },
  };
});
