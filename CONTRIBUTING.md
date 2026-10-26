# Contributing to Pixel Pals

Thank you for your interest in contributing to Pixel Pals. Whether you want to add new messages, design a new pet, improve performance, or fix a bug, here is what you need to know.

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm (comes with Node)

### Setup
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development build:
   ```bash
   npm run dev
   ```
   This starts the pet and opens the DevTools console in a detached window for debugging.

---

## Project Architecture

Pixel Pals is structured as a lightweight Electron application designed to sit unobtrusively on top of other desktop windows:

```
pixel-pals/
├── main.js              # Electron main process (lifecycle, physics, tray, timers, shortcuts)
├── preload.js           # Minimal, isolated IPC bridge (contextBridge)
├── src/
│   ├── pet.html/css/js  # Pet window: canvas rendering, interaction state machine, speech bubbles
│   ├── picker.html/css/js # Adopt-a-buddy window
│   ├── sprites.js       # Hand-authored 32x32 sprite generator & palette tables
│   ├── sounds.js        # Pure WebAudio synthesizer (zero audio files)
│   ├── messages.js      # Core greetings, idle lines, pet personalities
│   ├── messages-fun.js  # Jokes, facts, stories, knock-knock jokes
│   ├── messages-react.js# Interaction reactions (petting, flinging, naps, timers)
│   └── messages-ask.js  # Questions, trivia, games (RPS, coin, 8-ball)
└── test/                # Test harnesses and message validators
```

### Key Design Constraints
1. **Window pass-through**: The pet window uses `setIgnoreMouseEvents(true, { forward: true })` with pointer tracking. Only the sprite and active choice bubbles capture clicks.
2. **Anchor positioning**: Speech bubbles are positioned using GPU-composited CSS transforms on `#bubble-anchor`. Do not position bubbles using layout properties like `bottom` or `top`—this prevents trailing during drag physics.
3. **Audio**: All sound effects are generated via WebAudio oscillators and noise filters in `src/sounds.js`. Do not add audio media files.
4. **ASCII messages**: Because the bundled pixel font is a latin font, all message strings must remain ASCII. The test validator rejects non-ASCII characters.

---

## Common Contributions

### 1. Adding or Editing Messages
Message banks live in `src/messages*.js`:
- `src/messages.js`: Daily greetings, time-of-day phrases, pet-specific personality lines.
- `src/messages-fun.js`: Jokes, trivia, shower thoughts, stories.
- `src/messages-react.js`: Reactions to petting, clicks, scroll wheel, drag/fling, timers.
- `src/messages-ask.js`: Questions with choices, games (trivia, rock-paper-scissors, coin flip).

**Message guidelines:**
- Keep text warm, friendly, and concise. Avoid programmer jargon or dry corporate phrasing.
- Supported template tokens:
  - `%TIME` — Current time (e.g. `2:30 PM`)
  - `%PCT` — Progress through the day as a percentage (e.g. `45%`)
  - `%DUR` — Length of current session (e.g. `1h 20m`)
  - `%MIN` — Timer duration in minutes
- Verify all message files after changes:
  ```bash
  npm test
  ```

### 2. Adding or Modifying a Pet
Pets are defined in `src/sprites.js`.
- Pets use a 32x32 pixel grid.
- Body and head layers are defined as 16-pixel left halves and mirrored horizontally using `row()` helpers to maintain perfect symmetry.
- Asymmetrical details (tails, sprout, gloss) use separate overlay layers.
- Eye states (`open`, `blink`, `happy`, `wide`) must share a centered anchor point so facial transitions never jump position.
- If you add a pet, register its metadata in:
  - `main.js` (`PET_META`)
  - `src/messages.js` (`hello`, `pets`)
  - `src/picker.js` (`pets` array)
  - `test/asset-gen.html` (for generating tray icon)
- Run `npm run preview:sprites` to inspect all rendered frames in `out/sprites.png`.

---

## Running Tests & Previews

Before submitting changes, run the validation suite:

```bash
# Validate message keys, structure, and character sets
npm test

# Generate a visual sheet of all sprites
npm run preview:sprites

# Launch the interactive picker preview
npm run preview:app
```

---

## Submitting Pull Requests

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and ensure `npm test` passes cleanly.
3. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add new trivia questions about ocean life"
   ```
4. Push to your fork and submit a Pull Request.
5. In your PR description, briefly explain what you changed and include testing details.
