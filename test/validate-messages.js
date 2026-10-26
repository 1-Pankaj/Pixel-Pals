/* Validates message packs: parse-ability, key presence for pet.js, total count */
const fs = require('fs');
const path = require('path');

const files = ['messages.js', 'messages-fun.js', 'messages-react.js', 'messages-ask.js'];
const srcDir = path.join(__dirname, '..', 'src');

const sandbox = { window: {} };
global.window = sandbox.window;

function countStrings(obj) {
  let n = 0;
  if (typeof obj === 'string') return 1;
  if (Array.isArray(obj)) { obj.forEach(x => { n += countStrings(x); }); return n; }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) n += countStrings(obj[k]);
  }
  return n;
}

for (const f of files) {
  try {
    new Function('window', fs.readFileSync(path.join(srcDir, f), 'utf8'))(global.window);
    console.log('OK   ' + f);
  } catch (e) {
    console.error('FAIL ' + f + ': ' + e.message);
    process.exit(1);
  }
}

const M = global.window.PET_MESSAGES;

// every key path pet.js references
const required = [
  'hello', 'timeLines', 'statLines', 'keyboardHints', 'greet.morning', 'greet.afternoon',
  'greet.evening', 'greet.night', 'day.monday', 'day.friday', 'day.weekend', 'idle',
  'pets.mochi', 'pets.biscuit', 'pets.pudding', 'pets.luna', 'pets.clover', 'pets.miso',
  'jokes', 'facts', 'compliments', 'encourage', 'whimsy', 'procrastinate', 'showerThoughts',
  'stories', 'knockKnock',
  'react.petted', 'react.tapped', 'react.feed', 'react.dance', 'react.dizzy', 'react.flung',
  'react.wake', 'react.sleepy', 'react.lonely', 'react.wander', 'react.water', 'react.stretch',
  'react.focusStart', 'react.focusHalf', 'react.focusDone', 'react.focusStop', 'react.tickle',
  'react.wheelUp', 'react.wheelDown', 'react.shake', 'react.breatheIn', 'react.breatheHold',
  'react.breatheOut', 'react.breatheDone', 'react.countdownSet', 'react.countdownDone',
  'react.stats', 'react.dismissAsk',
  'ask.yesno', 'ask.thisOrThat', 'ask.trivia', 'ask.feelings', 'ask.snack', 'ask.rps',
  'ask.coin', 'ask.eightball', 'ask.knock', 'ask.timeout'
];

let fail = 0;
for (const key of required) {
  const parts = key.split('.');
  let cur = M;
  for (const p of parts) {
    if (cur === undefined || cur === null) break;
    cur = cur[p];
  }
  if (cur === undefined || (Array.isArray(cur) && cur.length === 0)) {
    console.error('MISSING: ' + key);
    fail++;
  }
}

// structural checks
if (!Array.isArray(M.stories) || !M.stories.every(s => Array.isArray(s.parts) && s.parts.length === 3)) {
  console.error('BAD stories structure'); fail++;
}
if (!Array.isArray(M.knockKnock) || !M.knockKnock.every(k => k.setup && k.who && k.punch)) {
  console.error('BAD knockKnock structure'); fail++;
}
for (const t of M.ask.trivia) {
  if (t.choices.length !== 3 || t.answer < 0 || t.answer > 2) { console.error('BAD trivia: ' + t.q); fail++; }
}
for (const t of M.ask.yesno) {
  if (!t.q || !t.yes || !t.no) { console.error('BAD yesno: ' + t.q); fail++; }
}
for (const t of M.ask.thisOrThat) {
  if (!t.q || !t.a || !t.b || !t.ra || !t.rb) { console.error('BAD thisOrThat: ' + t.q); fail++; }
}

// non-ASCII scan (pixel font coverage)
const all = files.map(f => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('');
const bad = all.match(/[^\x00-\x7F]/g);
if (bad) { console.error('NON-ASCII chars found: ' + [...new Set(bad)].join(' ')); fail++; }

const total = countStrings(M);
console.log('Total message strings: ' + total);
console.log(fail ? 'VALIDATION FAILED' : 'ALL CHECKS PASSED');
process.exit(fail ? 1 : 0);
