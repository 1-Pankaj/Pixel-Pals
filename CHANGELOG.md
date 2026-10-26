# Changelog

All notable changes to Pixel Pals are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
