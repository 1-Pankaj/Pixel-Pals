# Changelog

All notable changes to Pixel Pals are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-28

### Added
- **100% Procedural Software Pixel Rasterizer (`Pixel`)**: Completely asset-free rendering engine executing software cel-shading, hue-shifted lighting ramps, automatic dark outlines, and dynamic scaling in whole device pixels at zero GPU runtime cost.
- **Three Handcrafted Pals**:
  - **Mochi**: Tabby cat with twitching ears, swishing tail, loving naps on her woven rug, and fish treats.
  - **Waddle**: Cheerful tuxedo penguin with flappable wings, pebble gifts, and sliding dances on snowdrifts.
  - **Axo**: Smiling aquatic axolotl with pulsing frilly gills, bubble blows, and gentle hydration reminders.
- **Dynamic Procedural Habitats (`Scenes`)**:
  - Mochi's cozy room with wooden wall paneling, floorboards, window glints, yarn ball, and woven oval rug.
  - Waddle's mountain tundra with snow-capped peaks, soft gradient skies, translucent ice block, pebble rocks, and falling snowflakes.
  - Axo's deep aqua lagoon with sunlight caustics, depth bands, seabed rocks, swaying seaweed stalks, and rising air bubbles.
- **Interactive "Pet Home" Settings Suite**: Dedicated frameless hub window (`home.html`) featuring animated habitat cards, real-time pet switcher, size selection (Small, Medium, Large), chattiness controls, wellness toggles, and live interaction triggers.
- **Organic Physics & State Machine (`Brain`)**:
  - Real-time drag with inertia, velocity-based swinging, dangling states, gravity, and squish-and-stretch bounce on landing.
  - Global cursor tracking that follows the mouse across multi-monitors without stealing window focus.
  - Idle sleep cycles with snoring "Z" particles and organic awakening.
  - Gentle roaming behavior with smooth stepping animations.
- **1,000+ Dialogue Lines**: Context-aware shuffled bags covering greetings, time of day, weekdays, calendar events, wellness check-ins, jokes, and animal facts paired with expressive mood tags (`happy`, `love`, `wide`, `sleepy`, `sad`, `dizzy`, `squint`, `glad`, `calm`).
- **Comprehensive Self-Test Suite**: 175 rigorous automated unit checks simulating 2 hours of pet life per animal, message bags, and mock Electron main processes.
- **Modern Interactive Landing Website**: Responsive, asset-free showcase website with live procedural canvases, draggable notes, sound synthesizer, and Playwright verification suite.

### Changed
- Replaced static PNG sprite sheets and external font dependencies with zero-dependency procedural software rasterization.
- Replaced legacy picker with modern, responsive Pet Home interface.
- Upgraded desktop packaging to Electron 44 and Electron Builder 26 for streamlined NSIS installer and portable single-executable releases.

---

## [1.2.1] - 2026-10-25

### Added
- Interactive preview harness (`npm run preview:app`) for testing the picker window outside of production tray setups.
- CLI `--debug` flag support to automatically open detached DevTools.
- Global keyboard shortcuts (`Alt+Shift+1/2/3`) to answer on-screen questions without a mouse.
- Automated message validation test suite ensuring syntax, structure, and ASCII font compatibility.

### Changed
- Refactored speech bubble positioning onto a GPU-composited transform wrapper (`#bubble-anchor`), eliminating message trailing and layout artifacts during window drag.
- Calm chat pacing: messages stay on screen for a duration scaled to text length (minimum 2.4s) before advancing.
- Multi-step interactions (knock-knock jokes, rock-paper-scissors, breathing cues) now chain strictly after previous lines finish displaying.
- Platform-aware tray labels ("Start at login" on macOS, "Start with Windows" on Windows).

### Fixed
- Prevented speech bubble choices from allowing click-through while questions are awaiting user input.
- Addressed Content Security Policy warnings in development and test preview windows.

---

## [1.2.0] - 2026-10-20

### Added
- Questions with interactive choice buttons: Yes/No questions, This-or-That dilemmas, Trivia with heart and star particles, and emotional check-ins.
- Mini-games: Rock-Paper-Scissors, Coin Flip, Magic 8-Ball, and multi-part Knock-Knock jokes.
- Focus sessions (15, 25, 50 minutes) and countdown timers running in the Electron main process.
- Guided 1-minute 4-4-4 breathing exercise with synchronized pet scaling.
- Water and stretch reminders with customizable intervals in the tray menu.

---

## [1.1.0] - 2026-10-15

### Added
- Real-time physics engine: drag with 1:1 cursor tracking, velocity calculation, flinging, gravity, and elastic screen-edge bouncing.
- WebAudio cozy sound engine: all sound effects (plucks, bells, purrs, giggles, crunches, drumrolls) synthesized dynamically without audio media assets.
- Global cursor eye-tracking across multi-monitor setups.
- Snack feeding mechanic: cookies, donuts, and boba with crunchy bites, crumb particles, and mood boosts.

---

## [1.0.0] - 2026-10-01

### Added
- Initial release featuring six distinct pixel-art pets: Mochi (Cat), Biscuit (Dog), Pudding (Slime), Luna (Ghost), Clover (Bunny), and Miso (Axolotl).
- Frameless, transparent, always-on-top desktop window with click pass-through.
- Adopt-a-buddy picker window with live sprite animations and keyboard navigation.
- State persistence for pet selection, screen position, and tray settings.
