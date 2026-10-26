import React, { useState } from 'react';
import { PET_SFX } from '../lib/sounds';
import { PixelMusic, PixelSparkle } from './PixelIcons';

const SFX_BUTTONS = [
  { name: 'Purr', sfx: 'purr', icon: '🐱', desc: 'Warm vibration purr' },
  { name: 'Boop', sfx: 'boop', icon: '👆', desc: 'High sine blip' },
  { name: 'Dance', sfx: 'dance', icon: '🎵', desc: '7-note arpeggio melody' },
  { name: 'Chime', sfx: 'chime', icon: '✨', desc: 'Sparkling triad chord' },
  { name: 'Munch', sfx: 'munch', icon: '🍪', desc: 'Snack crunch noise' },
  { name: 'Fanfare', sfx: 'fanfare', icon: '🎺', desc: 'Celebration trumpet' },
  { name: 'Drumroll', sfx: 'drum', icon: '🥁', desc: 'Mini-game tension build' },
  { name: 'Boing', sfx: 'boing', icon: '🟢', desc: 'Squishy spring jump' },
];

export function SoundJukebox() {
  const [activeSfx, setActiveSfx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = (s) => {
    PET_SFX.unlock();
    if (PET_SFX[s.sfx]) {
      PET_SFX[s.sfx]();
      setActiveSfx(s.name);
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setActiveSfx(null);
      }, 700);
    }
  };

  return (
    <section className="relative py-24 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelMusic className="w-4 h-4 text-coral" />
          <span>Live WebAudio Synthesizer</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight">
          Interactive Retro Soundboard
        </h2>
        <p className="mt-3 text-lg text-espresso-muted dark:text-cocoa-muted font-sans max-w-xl mx-auto leading-relaxed">
          Pixel Pals synthesizes every sound live in code. Zero MP3 downloads, zero audio delay. Tap any button to test-drive:
        </p>
      </div>

      {/* Retro Cassette Player Deck */}
      <div className="retro-card p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-espresso/15 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-honey/30 border-2 border-espresso flex items-center justify-center text-2xl">
              📻
            </div>
            <div>
              <span className="font-arcade text-xs text-coral font-bold block">SYNTH CHIP 1.2</span>
              <h3 className="font-heading text-2xl font-bold">WebAudio Oscillators</h3>
            </div>
          </div>

          {/* Animated Retro Equalizer Bars */}
          <div className="flex items-end gap-1.5 h-10 px-4 py-2 rounded-xl bg-cream-surface dark:bg-cocoa-canvas border-2 border-espresso">
            {[4, 8, 3, 9, 6, 10, 5, 7].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isPlaying ? `${Math.min(32, (h * 4) + Math.random() * 10)}px` : '6px',
                  transition: 'height 0.1s ease',
                }}
                className="w-2 rounded-t-sm bg-coral"
              />
            ))}
          </div>
        </div>

        {/* 8 SFX Pads */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SFX_BUTTONS.map((s, idx) => {
            const isSelected = activeSfx === s.name;
            return (
              <button
                key={idx}
                onClick={() => playSound(s)}
                className={`retro-btn flex-col p-4 text-center transition-all ${
                  isSelected
                    ? 'bg-honey text-espresso scale-95 shadow-none translate-y-1'
                    : 'bg-cream-surface dark:bg-cocoa-canvas text-espresso dark:text-cream hover:bg-honey/30'
                }`}
              >
                <span className="text-2xl mb-1">{s.icon}</span>
                <span className="font-pixel font-bold text-sm">{s.name}</span>
                <span className="text-[11px] font-sans opacity-75">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
