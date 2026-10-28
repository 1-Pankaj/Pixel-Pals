# Pixel Pals

<p align="center">
  <img src="build/icon.png" alt="Pixel Pals Icon" width="80">
</p>

<p align="center">
  <strong>Cute pixel pets that live on your Windows desktop.</strong><br>
  Pick a <b>cat</b>, a <b>penguin</b>, or an <b>axolotl</b>. They float above your windows, follow your cursor with their eyes, and keep you company while you work or study.
</p>

<p align="center">
  <a href="https://1-pankaj.github.io/Pixel-Pals/"><img src="https://img.shields.io/badge/Website-Try%20it%20online-ff7aa8?style=flat" alt="Live Website"></a>
  <a href="https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml"><img src="https://github.com/1-Pankaj/Pixel-Pals/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <a href="https://github.com/1-Pankaj/Pixel-Pals/releases"><img src="https://img.shields.io/github/v/release/1-Pankaj/Pixel-Pals?color=7f8cff&label=download" alt="Download Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-ffe27a?style=flat" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="https://1-pankaj.github.io/Pixel-Pals/"><strong>Try the interactive web playground &rarr;</strong></a>
</p>

---

Everything is drawn in code using a custom software pixel rasterizer. There are no image files or font assets to ship, no AI, no accounts, and no internet connection needed. 

The pet lives in a transparent, frameless window. Any empty space around the buddy is click-through, so it never steals focus or gets in the way of what you are typing or clicking.

---

## The Pals

| Pal | Species | Habitat | Personality | Treat |
|:---|:---|:---|:---|:---|
| **Mochi** | Tabby cat | Sunlit room with wooden floorboards | Warm, curious, and loves long naps in a sunbeam. Twitching ears, swishing tail, and cozy purrs. | Fish 🐟 |
| **Waddle** | Penguin | Mountain tundra with falling snow | Dressed in his finest tuxedo, bringing quiet optimism, sliding dances, and little pebble gifts. | Fish 🐟 |
| **Axo** | Axolotl | Lagoon with swaying seaweed | A forever-smiling aquatic dragon with frilly gills who blows bubbles and reminds you to stay hydrated. | Shrimp 🦐 |

---

## How to play

| Do this | Get this |
|:---|:---|
| **Move the mouse anywhere** | Eyes follow your cursor across the screen, even outside the pet's window |
| **Click the pet** | Hearts, a friendly sound, and a message. Click repeatedly and it gets dizzy with spinning stars |
| **Double-click** | A trick: 360° spin, backflip hop, or a dance |
| **Drag** | Picks the pet up. It dangles and swings with momentum, then lands with a soft squish |
| **Right-click** | Menu: treat, trick, nap, jokes, facts, switch pal, size, chattiness, and settings |
| **Leave the mouse still** | The pet yawns, curls up, and naps with floating "Z"s. Move the mouse to wake it up |
| **System tray icon** | Click to hide or show. Right-click to summon your pal back to the corner |

---

## Quick start

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/1-Pankaj/Pixel-Pals.git
cd Pixel-Pals
npm install
npm run desktop
```

Your pal appears in the bottom-right corner, and the **Pet Home** window opens on first launch so you can adopt who you want.

---

## Windows installer & portable builds

```bash
# Build the NSIS installer and single-file portable .exe
npm run dist

# Or build an unpacked directory for quick testing
npm run dist:dir
```

Output files are created in `dist/`:
* `Pixel Pals Setup 2.0.0.exe` (installer with desktop and start menu shortcuts)
* `Pixel Pals-portable-2.0.0.exe` (portable executable, runs anywhere without installation)

*(Note: Windows SmartScreen may show an "Unrecognized app" prompt on first run for independent open-source apps. Click **More info** &rarr; **Run anyway**.)*

---

## Settings

Open **Pet Home** from the tray icon or the right-click menu:

* **Pet**: Switch between Mochi, Waddle, and Axo anytime.
* **Size**: Small (3×), Medium (4× default), or Large (5×). Whole-pixel scaling keeps sprites crisp on any DPI.
* **Chattiness**: Silent, Quiet, Normal, or Chatty.
* **Toggles**: Always on top, roam around screen edges, look at cursor, sleep when idle, wellness nudges (water, stretch, rest eyes), fun facts and jokes, synthesized sounds, and start on Windows login.

Settings are saved locally in your user data directory as `settings.json`.

---

## Project structure

```
pixel-pals/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js           # Transparent window, cursor tracking, tray, roaming, IPC
│   │   ├── preload.js        # Safe context bridge
│   │   └── settings.js       # Atomic settings store
│   ├── renderer/             # Windows
│   │   ├── pet.html/css/js   # Floating desktop pet and speech bubbles
│   │   └── home.html/css/js  # Pet Home dashboard and animated habitat cards
│   └── shared/               # Core engine (runs in Node and browser)
│       ├── pixel.js          # Software pixel rasterizer (cel-shading, outlines, ramps)
│       ├── pets.js           # Procedural sprite models for Mochi, Waddle, and Axo
│       ├── brain.js          # Personality, physics, sleep, roaming, reactions
│       ├── effects.js        # Hearts, stars, bubbles, and sleep particles
│       ├── scenes.js         # Animated habitat backgrounds
│       ├── sound.js          # Synthesized WebAudio sound effects
│       ├── icons.js, png.js  # Procedural icon generator
│       └── messages/         # 1,000+ dialogue lines in shuffled bags
├── scripts/
│   ├── selftest.js           # 175-check test suite (lifetime simulation)
│   ├── preview.js            # Generates preview of all pet expressions
│   └── make-icons.js         # Generates build/icon.ico and icon.png
├── website/                  # Live showcase website with habitat canvases
├── docs/                     # GitHub Pages mirror
└── build/                    # App and tray icons
```

---

## Adding your own dialogue

Open any file in `src/shared/messages/` and add a line to an array:
* `core.js`: Greetings, time of day, weekdays, calendar dates (`MM-DD`), petting reactions.
* `shared.js`: Encouragement, care reminders, work focus, compliments.
* `facts.js`: Animal facts, trivia, wholesome jokes.
* `mochi.js`, `waddle.js`, `axo.js`: Individual character voices.

An entry can be a plain string or `["text", "mood"]` to trigger an expression (`happy`, `love`, `wide`, `sleepy`, `sad`, `dizzy`, `squint`, `glad`, `calm`):

```javascript
"Enjoying the afternoon breeze.",
["Look what I found!", "happy"]
```

Lines are served from shuffled bags, so nothing repeats until the entire list has been shown.

---

## Adding a new pet

1. In `src/shared/pets.js`, write a drawing function (you can use `drawAxo` or `drawMochi` as a template) and add an entry to `PETS`.
2. Create `src/shared/messages/yourpet.js` and register it in `messages/index.js` and `<script>` tags in `pet.html` and `home.html`.
3. Add a habitat scene in `src/shared/scenes.js`.
4. Run `npm test` to test its simulation.

Pet Home, the menu, and the tray will pick up the new pet automatically.

---

## Tests

Run the built-in test suite:
```bash
npm test
```
This runs 175 checks:
* Simulates 2 hours of virtual life for every pet
* Validates message bags, shuffle mechanics, and expressions
* Checks settings store and procedural icons
* Tests the main process against a mocked Electron environment

To test the website:
```bash
python website/test_website.py
```

---

## License

MIT License. Free and open source for everyone.
