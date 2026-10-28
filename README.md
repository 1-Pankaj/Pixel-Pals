# Pixel Pals

<p align="center">
  <img src="build/icon.png" alt="Pixel Pals Icon" width="80">
</p>

<p align="center">
  <strong>Cute pixel pets that live on your desktop.</strong><br>
  Pick a <b>cat</b>, a <b>penguin</b>, or an <b>axolotl</b>. They float above your windows, their eyes follow your cursor wherever it goes, and they keep you company with over a thousand little messages, tricks, naps and treats.
</p>

<p align="center">
  <a href="https://1-pankaj.github.io/Pixel-Pals/"><img src="https://img.shields.io/badge/Website-Live%20Showcase-fab387?style=flat" alt="Live Website"></a>
  <a href="https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml"><img src="https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <a href="https://github.com/1-Pankaj/Pixel-Pals/releases"><img src="https://img.shields.io/github/v/release/1-Pankaj/Pixel-Pals?include_prereleases&color=fab387&label=release" alt="GitHub Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://github.com/1-Pankaj/Pixel-Pals"><img src="https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011-blue.svg" alt="Platform"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</p>

<p align="center">
  <a href="https://1-pankaj.github.io/Pixel-Pals/"><strong>Explore the Interactive Web Showcase &rarr;</strong></a>
</p>

---

## What makes Pixel Pals special?

* 🎨 **100% Procedural Pixel Software Rasterizer**: No static PNG sprite sheets or font files are shipped. Every pixel, shadow ramp, outline, and expression is drawn in code via a tiny, custom software rasterizer (`Pixel`).
* 🖥️ **Always-on-Top & Click-Through**: Lives in a transparent, frameless window. Empty space around the pet is click-through, and interacting with your pet never steals focus from your IDE, browser, or game.
* 👀 **Global Cursor Eye-Tracking**: Your pet's eyes track your mouse cursor across your entire multi-monitor setup in real-time.
* 💬 **1,000+ Handcrafted Dialogue Lines**: Shuffled bags of context-aware lines covering morning/evening greetings, weekdays, calendar holidays, jokes, animal facts, and gentle wellness check-ins. No repetition until the whole bag is seen.
* 🏠 **Interactive "Pet Home" Hub**: A cozy desktop dashboard featuring real-time animated pixel habitats, instant pet switcher, size adjustment, chattiness tuning, and interaction buttons.
* 🧲 **Organic Physics Rig**: Dragging picks your pet up to dangle and swing with momentum, landing with an elastic squish-and-stretch bounce.
* 🔊 **WebAudio Cozy Sound Synthesis**: Warm purrs, beeps, chirps, and crunch effects synthesized live with WebAudio oscillators—completely asset-free.
* 🔒 **Zero Telemetry, 100% Offline**: No accounts, no internet required, no analytics, and no AI hallucinations.

---

## Meet the Pals

| Pal | Species | Habitat | Personality & Quirks | Favorite Treat |
|:---|:---|:---|:---|:---|
| **Mochi** | Tabby Cat | Cozy Sunlit Room | Warm, curious and always up for a long nap in a sunbeam. Twitching ears, swishing tail, and cozy purrs. | Fish 🐟 |
| **Waddle** | Penguin | Mountain Tundra | Dressed in his finest tuxedo, Waddle brings endless optimism, sliding dances on snowdrifts, and pebble gifts. | Fish 🐟 |
| **Axo** | Axolotl | Oceanic Lagoon | A forever-smiling aquatic dragon with pulsing frilly gills, blowing bubbles and reminding you to stay hydrated. | Shrimp 🦐 |

---

## How to Play

| Action | Result |
|:---|:---|
| **Move mouse anywhere** | Eyes smoothly follow cursor across the screen |
| **Click the pet** | Happy hearts, a friendly sound, and a message. Click repeatedly to make them dizzy with spinning stars |
| **Double-click** | A special trick: 360° spin, backflip hop, or dance |
| **Click & Drag** | Picks the pet up! It dangles and swings with cursor momentum, then lands with an elastic bounce |
| **Right-click** | Context menu: treat, trick, nap, jokes, facts, switch pal, size, chattiness, and settings |
| **Leave mouse idle** | Your pal yawns, curls up, and takes a peaceful nap with floating "Z"s. Moving the mouse gently wakes them |
| **System Tray icon** | Single-click to toggle visibility. Right-click for quick actions or to summon your pal back to the corner |

---

## Quick Start

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
# Clone the repository
git clone https://github.com/1-Pankaj/Pixel-Pals.git
cd Pixel-Pals

# Install dependencies
npm install

# Launch Pixel Pals
npm run desktop
```

Your pal appears in the bottom-right corner of your desktop, and the **Pet Home** window opens on first launch so you can adopt your favorite buddy.

---

## Build Windows Installers

```bash
# Build both standard installer (.exe) and portable single-executable (.exe)
npm run dist

# Or build an unpacked directory for fast local testing
npm run dist:dir
```

Output executables are saved to `dist/`:
- `Pixel Pals Setup 2.0.0.exe` (NSIS installer with desktop & start menu shortcuts)
- `Pixel Pals-portable-2.0.0.exe` (Single-file portable executable, no install needed)

---

## Settings

Configure everything from the **Pet Home** window or the right-click tray menu:
* **Pet Selection**: Switch between Mochi, Waddle, and Axo anytime.
* **Size**: Small (3×), Medium (4× default), or Large (5×). Whole device-pixel scaling ensures crisp pixels on high-DPI displays.
* **Chattiness**: Silent, Quiet (occasional thoughts), Normal, or Chatty.
* **Behaviors**: Always on top, roam around screen edges, look at cursor, sleep when idle, wellness nudges (drink water, stretch, eye rest), fun facts & jokes, synthesized sounds, and launch at login.

Settings are saved atomically in your user data directory as `settings.json`.

---

## Project Structure

```
pixel-pals/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js           # Transparent window, cursor tracking, tray, IPC
│   │   ├── preload.js        # Context-isolated secure bridge
│   │   └── settings.js       # Validated atomic JSON store
│   ├── renderer/             # Frontend windows
│   │   ├── pet.html/css/js   # Floating pet view, speech bubble, organic physics
│   │   └── home.html/css/js  # Pet Home dashboard & animated habitat preview
│   └── shared/               # Plain JS engine (Node & browser compatible)
│       ├── pixel.js          # Software pixel rasterizer (cel-shading, outlines)
│       ├── pets.js           # Procedural sprite models & rigs (Mochi, Waddle, Axo)
│       ├── brain.js          # State machine, physics, roaming, emotions
│       ├── effects.js        # Burst particles (hearts, stars, bubbles, zzz)
│       ├── scenes.js         # Procedural animated habitat backgrounds
│       ├── sound.js          # WebAudio live sound synthesis
│       ├── icons.js, png.js  # Dynamic icon generation from pixel rigs
│       └── messages/         # 1,000+ dialogue lines in shuffled bags
├── scripts/
│   ├── selftest.js           # 175-check automated verification suite
│   ├── preview.js            # Sprite sheet preview generator
│   └── make-icons.js         # Generates build/icon.ico & build/icon.png
├── website/                  # Interactive landing page showcase
│   ├── index.html            # Responsive website with live procedural habitats
│   └── test_website.py       # Automated Playwright test suite
├── docs/                     # GitHub Pages deployment mirror
├── build/                    # Generated app & installer icons
└── package.json
```

---

## Adding Custom Dialogue

Dialogue files are organized cleanly in `src/shared/messages/`:
* `core.js`: Greetings, time-of-day phrases, weekdays, calendar dates (`MM-DD`), petting/feeding reactions.
* `shared.js`: Gentle encouragement, care reminders, work focus, compliments.
* `facts.js`: Curated world & animal trivia, wholesome jokes.
* `mochi.js`, `waddle.js`, `axo.js`: Individual character voices.

To add custom lines, open any of these files and append a string or an expression-tagged tuple:
```javascript
"Here is a brand new cozy thought!",
["I am super excited!", "happy"]
```
Available moods: `happy`, `love`, `wide`, `sleepy`, `sad`, `dizzy`, `squint`, `glad`, `calm`.

---

## Adding a New Pet

1. In `src/shared/pets.js`, define your pet drawing function (e.g. `drawBunny(rig, state)`) and register it in `PETS`.
2. Create `src/shared/messages/yourpet.js` with dialogue bags and register it in `src/shared/messages/index.js` and `<script>` tags in `pet.html`/`home.html`.
3. Add an animated habitat scene in `src/shared/scenes.js`.
4. Run `npm test` to validate the new pet's lifetime simulation.

---

## Testing & Quality Assurance

Run the built-in self-test suite:
```bash
npm test
```
This runs 175 automated checks:
- Simulates 2 hours of virtual life for every pet
- Verifies dialogue bags, shuffle integrity, and mood tags
- Validates the settings store and procedural icon generators
- Boots the Electron main process logic against a mocked harness

To test the landing page with Playwright:
```bash
python website/test_website.py
```

---

## Contributing

Contributions, custom pets, dialogue lines, and translations are very welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## License

Pixel Pals is free and open-source software licensed under the [MIT License](LICENSE).
Made with love for cozy desktops everywhere.
