# Contributing to Pixel Pals

Thank you for wanting to help make Pixel Pals better! We welcome contributions from everyone, whether you want to add cute dialogue lines, create a new pet, improve performance, or fix a bug.

---

## Easiest Contributions for Newcomers

If you are new to the codebase, the easiest and most fun ways to contribute are:

1. **Adding New Messages:**
   - Open any file in `src/shared/messages/` (`core.js`, `shared.js`, `facts.js`, `mochi.js`, `waddle.js`, `axo.js`).
   - Add plain strings or expression-tagged tuples (`["My new line", "happy"]`).
   - Dialogue is served from shuffled bags, so lines stay fresh.

2. **Creating a New Pet:**
   - Define a procedural drawing function in `src/shared/pets.js` (copy `drawAxo` or `drawMochi` as a template).
   - Create a dialogue bag file `src/shared/messages/yourpet.js`.
   - Add a habitat scene in `src/shared/scenes.js`.
   - The Pet Home window, tray, and menu will adopt the new pet automatically.

3. **Translations & Internationalization:**
   - Expanding dialogue bags to support more languages and cultural holidays.

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org) 18 or newer
* npm

### Local Setup
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/1-Pankaj/Pixel-Pals.git
   cd Pixel-Pals
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the desktop app locally:
   ```bash
   npm run desktop
   ```

---

## Testing Your Changes

Before submitting a pull request, always run the self-test suite:

```bash
npm test
```

This runs 175 automated checks:
- Simulates 2 hours of virtual lifetime per animal (walking, talking, napping, waking)
- Validates message syntax, shuffle bags, and expression tags
- Verifies the settings store and procedural icon generators
- Tests the Electron main process logic against a mocked harness

If you tweaked the landing page, verify it with:
```bash
python website/test_website.py
```

---

## Originality & Content Guidelines

Pixel Pals is 100% original, asset-free, and procedural. To keep the project safe for everyone:

* **Original work only:** Do not submit characters from other franchises, copyrighted song lyrics, or copied external sprites.
* **Wholesome & cozy:** Keep messages friendly, comforting, humorous, and respectful.
* **No external binary media:** All sprites, lighting ramps, and particles must be drawn in code using the `Pixel` rasterizer. All sounds must be synthesized live with WebAudio oscillators in `src/shared/sound.js`.

---

## Submitting a Pull Request

1. Create a descriptive branch:
   ```bash
   git checkout -b add-bunny-pet
   ```
2. Commit your changes with a clear commit message.
3. Push to your fork and submit a Pull Request to `main`.
4. Fill out the PR template, confirm that `npm test` passes, and verify your contribution is your own original work.

Thank you for helping make cozy desktops for people around the world!
