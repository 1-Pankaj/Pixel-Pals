# Pixel Pals 🐱🐶🟢👻🐰🩷

[![CI](https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml/badge.svg)](https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/1-Pankaj/Pixel-Pals)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A cute pixelated desktop pet that lives **on top of your windows**. Adopt one of **six pals**, watch its eyes follow your mouse, drag it around (or fling it), pet it, feed it snacks, start a dance party — and enjoy **2,500+ hand-written messages**. It will also **ask YOU questions with clickable choice buttons**, play games with you, tell stories, guide breathing breaks, and help you focus with timers and gentle reminders. No AI, no accounts, no nonsense — just a tiny friend.

Built with **Electron**. Works on **Windows** (and macOS/Linux).

---

## Quick start

```bash
npm install
npm run desktop
```

That's it. On first launch the **adopt-a-buddy** picker appears — choose your pal and it spawns on your desktop.

> Requires Node.js 18+ and internet access for the first `npm install` (Electron downloads its runtime).

## Mouse controls

| Action | What happens |
|---|---|
| **Click (tap)** | Poke! Random reaction: jump-scare, giggle, spin, squish — 3 fast pokes = dizzy stars |
| **Double-click** | Dance party! Wiggle + music notes + a little melody |
| **Hold (≈0.5s)** | Squish! Squeeze hearts out of it |
| **Drag** | Pick it up — it dangles with wide eyes (the speech bubble stays glued to its head) |
| **Shake while dragging** | Wiggle the cursor back & forth fast — it gets dizzy when you put it down |
| **Fling (fast drag + release)** | Physics! It tumbles, shows speed streaks, and bounces off screen edges |
| **Tickle (wiggle mouse over it)** | Giggle fit with hearts and wiggling |
| **Scroll wheel over it** | Scroll up = happy hops. Scroll down = squish flat |
| **Right-click** | Context menu (pet, snack, question, RPS, story, dance, time, focus, nap, switch pal, quit) |
| **Just leave it alone** | It wanders, blinks, wags, chats, occasionally asks you a question... then naps with Zzz |
| **Tray icon (near the clock)** | All settings, games, timers, pet switching, quit |

## Keyboard shortcuts (global, toggleable in the tray menu)

The pet window never steals focus, so keyboard control uses system-wide shortcuts:

| Keys | Action |
|---|---|
| `Alt+Shift+P` | Pet it (hearts!) |
| `Alt+Shift+B` | Say something |
| `Alt+Shift+F` | Drop a snack |
| `Alt+Shift+D` | Dance party |
| `Alt+Shift+N` | Nap / wake |
| `Alt+Shift+T` | What time is it? |
| `Alt+Shift+S` | How long have we hung out? |
| `Alt+Shift+Q` | Ask me a question (random) |
| `Alt+Shift+R` | Rock, paper, scissors |
| `Alt+Shift+C` | Flip a coin |
| `Alt+Shift+M` | Magic 8-ball |
| `Alt+Shift+K` | Knock-knock joke |
| `Alt+Shift+A` | Snack, please? (pet picks) |
| `Alt+Shift+Y` | Tell me a story |
| `Alt+Shift+E` | One-minute breathing break |
| `Alt+Shift+G` | Start 25-min focus timer |
| `Alt+Shift+H` | Stop focus timer |
| `Alt+Shift+1` / `2` / `3` | Answer the open question choice 1/2/3 |
| `Alt+Shift+X` | Dismiss bubble / question |

In the **picker window**: arrow keys browse, `Enter` adopts, `Esc` closes.

## Questions & games

Your pal asks **you** things — the speech bubble grows clickable choice buttons:

- **Yes / No** — "Do you like rainy days?" (28 questions, each with tailored reactions)
- **This or that** — "Cats or dogs?" (30 dilemmas, including a *Both!* escape)
- **Trivia** — 3 choices, gentle right/wrong reactions, hearts for correct answers (34 questions)
- **How are you feeling?** — it actually adapts its mood to your answer
- **Snack, please?** — Cookie / Donut / Boba, and it eats the one you pick
- **Rock, paper, scissors** — with a drumroll and outcome lines
- **Coin flip** and **Magic 8-ball** — it shakes and answers
- **Knock-knock jokes** — full 3-step setup with buttons
- Plus it pops an unprompted question every so often while you work

## The six pals

| Pet | Species | Personality |
|---|---|---|
| **Mochi** 🐱 | Orange Tabby | Professional napper. Will judge your playlist, lovingly. |
| **Biscuit** 🐶 | Shiba Inu | Maximum loyalty, minimum chill. 10/10 would fetch. |
| **Pudding** 🟢 | Mint Slime | Small, squishy, full of big dreams and jelly. |
| **Luna** 👻 | Little Ghost | Mostly here for the cozy vibes and gentle hovering. (Actually floats!) |
| **Clover** 🐰 | Bunny | Ears at maximum altitude. Heart at maximum softness. |
| **Miso** 🩷 | Axolotl | Always smiling. Scientifically unable to frown. |

Each pal has its own **40 personality lines**, on top of the shared collection:
greetings (time-of-day aware), 130+ jokes, 150+ fun facts, compliments,
encouragement, whimsy, shower thoughts, procrastination nudges, 16 multi-part
stories, 22 knock-knock jokes, Monday/Friday/weekend lines, and reactions to
everything you do to it.

## Feature list

- 🎨 **Hand-authored pixel art** — 32×32 sprites, 5 face expressions per pet, wagging tails, swaying sprout, baked blush and gloss
- 👀 **Eyes follow your mouse** — globally, even when the cursor is outside the pet window (toggleable)
- 🫧 **Floats above everything** — always-on-top, frameless, transparent, click-through everywhere except the pet (and its question bubbles)
- 🖥️ **Crisp at any display scaling** — DPR-aware rendering (no blurry/shrunken sprite at 125%–200% Windows scaling)
- 🖱️ **Drag with real physics** — direct 1:1 follow, velocity tracking, flinging with gravity + bouncy screen-edge collisions
- 💬 **2,500+ messages** with anti-repeat shuffle bags, time-of-day greetings, day-aware lines
- 🗣️ **Animalese** — it "speaks" its lines with tiny pentatonic voice-blips while text types out
- ❤️ **Interactions** — petting, hold-to-squish, poke reactions, dizzy combo, tickling, scroll reactions, shake detection, snack feeding, dance parties
- 🧁 **Snack time** — cookie, donut, or boba (with pearls!); 3 crunchy bites, crumbs, hearts
- 🎲 **Questions & games** — clickable choice bubbles (see above)
- 📖 **Story time** — 16 three-part cozy stories told one bubble at a time
- 🌬️ **Breathing break** — one minute of guided 4-4-4 breathing; the pet inflates and deflates with you
- 🔔 **Useful stuff**:
  - **Focus timer** (15/25/50 min) — meditation face, half-time encouragement, celebration
  - **Countdown timer** (1/5/10/20/30 min) — sweet alarm + stars when time is up
  - **Water break reminder** — gentle drop particles + a nudge to hydrate
  - **Stretch reminder** — it demonstrates a big stretch so you copy it
  - **Hourly chime** — soft bell + the time and day-progress
  - **"What time is it?"** and **hangout stats** on demand
- 🌡️ **Hidden mood system** — pets and snacks raise it, neglect lowers it; sad pets ask for attention (politely)
- 😴 **Sleep mode** — after ~2.5 min of ignoring it (faster at night) it dozes off with floating Z's
- 🚶 **Wandering** — occasionally hops across your screen on its own
- 🔊 **Soft cozy sound engine** — synthesized live with WebAudio (no audio files): warm plucks, bells, purrs, giggles, drumrolls, gentle alarms — all through a lowpass + compressor
- ⌨️ **Global keyboard shortcuts** — full control without the mouse (toggleable)
- ⚙️ **Tray menu** — pets, fun, questions & games, useful timers, reminders, toggles
- 🧠 **Remembers everything** — chosen pet, screen position, and settings persist between runs
- 🪟 **Single instance** — launching twice just focuses the existing app

## Project structure

```
pixel-pals/
├── main.js              # Electron main process (windows, tray, drag/fling physics, timers, shortcuts, state)
├── preload.js           # Safe IPC bridge (contextBridge)
├── package.json         # Scripts + electron-builder config
├── assets/
│   ├── icon.png/.ico    # App icon (generated from the pixel art)
│   ├── tray-*.png       # Per-pet tray icons (6 pets)
│   └── fonts/           # Bundled pixel fonts (woff2)
├── src/
│   ├── sprites.js       # Pixel-art engine + all 6 pets (half-mirrored maps, underlays, centered eye anchors)
│   ├── messages.js      # Core messages (hello, greetings, idle, personalities)
│   ├── messages-fun.js  # Jokes, facts, stories, knock-knocks...
│   ├── messages-react.js# Reactions to every interaction
│   ├── messages-ask.js  # The question bank (choices, trivia, games)
│   ├── sounds.js        # WebAudio soft-cozy synth engine
│   ├── pet.html/css/js  # Pet window (DPR canvas, state machine, particles, snacks, question bubbles)
│   └── picker.html/css/js  # Adopt-a-buddy window with live previews + keyboard nav
└── test/                # Dev-only preview, probe & screenshot harnesses
```

## Scripts

| Command | What it does |
|---|---|
| `npm run desktop` | Run the app (same as `npm start`) |
| `npm run dev` | Run the app with detached DevTools enabled |
| `npm test` | Run the automated message validation suite |
| `npm run preview:sprites` | Screenshot sheet of every pet frame (saved to `out/sprites.png`) |
| `npm run preview:app` | Launch the adopt-a-buddy picker preview window |
| `npm run dist` | Build Windows installer (NSIS) + portable `.exe` with electron-builder |
| `npm run dist:portable` | Build just the portable `.exe` |

## Building a distributable for Windows

```bash
npm run dist
```

Output lands in `release/` — an NSIS installer and a portable exe. The portable exe is the easiest way to share the pet with friends: one file, no install.

## Customizing

- **Add your own messages** → edit any `src/messages-*.js` file. Each category is a plain array; anti-repeat is automatic. Templates: `%TIME`, `%PCT` (day progress), `%DUR` (session length), `%MIN` (timer minutes).
- **Tune behavior** → in `src/pet.js`: chatter frequency (`scheduleChatter`), sleep timeouts (search `lastInteraction`), wander distance (`startWander`), question frequency (`chatterTick`), particle counts.
- **Add a new pet** → add a palette + half-map layers in `src/sprites.js`, register it in `main.js` (`PET_META`), `src/messages.js` (`hello`, `pets`), `src/picker.js`, and `test/asset-gen.html` (tray icon).
- **Change sprite size** → `SCALE` in `src/pet.js` and window size in `main.js`.

## Troubleshooting

- **Pet window looks black / no transparency** — update your GPU drivers, or run with `npx electron . --disable-gpu`. Some remote-desktop sessions disable window transparency entirely.
- **Pet hides behind a fullscreen game** — fullscreen exclusive apps draw above everything; use borderless-window mode in the game.
- **Global shortcuts don't respond** — another app may own them; try toggling "Global keyboard shortcuts" off and on in the tray menu, or pick different keys in `main.js` (`SHORTCUT_DEFS`).
- **No tray icon on Linux** — some distros need an appindicator extension; the app still runs.
- **"Start with Windows" doesn't work in dev** — Windows autostart points at the dev electron binary; use the packaged build (`npm run dist`) for a proper entry.

## Tech notes

- Context isolation is on, the preload exposes a minimal typed API (`window.petAPI`), and the CSP blocks remote code.
- The pet window uses `setIgnoreMouseEvents(true, { forward: true })` with hover detection so clicks fall through everywhere except the sprite and interactive bubbles.
- **Bubble anchoring**: the speech bubble is positioned by a GPU-composited `transform` on a wrapper element (updated once per frame), never by layout writes — so it stays glued to the pet even while the OS window is being dragged around (fixes the "message slides off while dragging" artifact on Windows).
- **Drag**: the window follows the cursor 1:1 (no smoothing chase), which also removes the transparent-window content-trail during sustained movement.
- All sprite frames are baked once at startup to offscreen canvases; the render loop just composites them, so CPU usage stays tiny.
- The canvas applies a devicePixelRatio base transform, so the sprite stays pixel-perfect at any Windows display scale.
- Eye states (open/blink/happy/wide) are baked **centered on a shared anchor** per pet, so faces never jump between expressions.
- The focus and countdown timers run in the main process, so they keep ticking even if the pet window reloads.
- Question choice buttons are plain DOM buttons inside the bubble; the hover detector treats the open bubble as part of the pet so clicks never fall through mid-question.

## Chat pacing (v1.2.1)

- **No message ever gets cut short.** New lines wait for the current one to finish showing (reading time scales with length, minimum ~2.4s) — this fixes the "message appears and disappears suddenly" artifact.
- **Multi-step chats flow calmly**: knock-knock jokes, rock-paper-scissors reveals, and breathing cues chain *after* the previous line has fully displayed, instead of swapping on a blind timer.
- **All 2,500+ lines use simple, friendly English** — no programmer talk, easy for anyone to read.

## Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for architecture details, message syntax, and guidelines on adding new pets. All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the [MIT License](LICENSE).
Bundled pixel fonts are open source under the SIL Open Font License 1.1 — see [CREDITS.md](CREDITS.md) for details.
