import React, { useState, useEffect } from 'react';
import { PixelSparkle } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

const SHORTCUTS = [
  { keys: ['Alt', 'Shift', 'P'], title: 'Pet Your Buddy', desc: 'Squeezes them with love & purrs', sfx: 'purr', color: 'bg-coral' },
  { keys: ['Alt', 'Shift', 'F'], title: 'Drop a Snack', desc: 'Feeds a fresh crunchy cookie', sfx: 'pop', color: 'bg-honey' },
  { keys: ['Alt', 'Shift', 'D'], title: 'Dance Party', desc: 'Plays music notes & victory hops', sfx: 'dance', color: 'bg-mint' },
  { keys: ['Alt', 'Shift', 'Q'], title: 'Ask a Question', desc: 'Pops a fun dilemma or trivia choice', sfx: 'sparkle', color: 'bg-sky' },
  { keys: ['Alt', 'Shift', 'R'], title: 'Rock, Paper, Scissors', desc: 'Drumroll match against your pal', sfx: 'drum', color: 'bg-lavender' },
  { keys: ['Alt', 'Shift', '1'], title: 'Answer Choice #1', desc: 'Quick answer without touching mouse', sfx: 'click', color: 'bg-honey' },
  { keys: ['Alt', 'Shift', 'E'], title: '1-Min Breathing', desc: 'Soothing inhale and exhale guide', sfx: 'chime', color: 'bg-sky' },
  { keys: ['Alt', 'Shift', 'G'], title: '25-Min Focus Timer', desc: 'Gentle bell when focus period ends', sfx: 'bell', color: 'bg-coral' }
];

export function KeyboardDeck() {
  const [activeKey, setActiveKey] = useState(null);

  const triggerAction = (s) => {
    PET_SFX.unlock();
    if (PET_SFX[s.sfx]) PET_SFX[s.sfx]();
    setActiveKey(s.keys.join('+'));
    setTimeout(() => setActiveKey(null), 300);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.altKey && e.shiftKey) {
        const k = e.key.toUpperCase();
        const found = SHORTCUTS.find((s) => s.keys[2] === k);
        if (found) {
          triggerAction(found);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section id="shortcuts" className="relative py-28 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Tactile Controls</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-heading font-black text-espresso dark:text-[#fff8f0] tracking-tight">
          Keyboard Shortcuts
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-[#cfbea9] font-sans max-w-lg mx-auto leading-relaxed">
          The pet window never steals focus from your games or code. Press these hotkeys from any application (or click any keycap below!):
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SHORTCUTS.map((s, idx) => {
          const isPressed = activeKey === s.keys.join('+');
          return (
            <div
              key={idx}
              onClick={() => triggerAction(s)}
              className={`retro-card p-6 cursor-pointer flex flex-col justify-between select-none transition-all duration-150 ${
                isPressed ? 'scale-95 shadow-none translate-y-2' : ''
              }`}
            >
              <div>
                {/* 3D Mechanical Keycaps */}
                <div className="flex items-center gap-1.5 mb-4">
                  {s.keys.map((k, ki) => (
                    <span
                      key={ki}
                      className={`inline-block px-2.5 py-1 text-xs font-arcade text-espresso bg-cream-surface border-2 border-espresso rounded-lg shadow-[0_3px_0_#3a2b20] transition-transform ${
                        isPressed ? 'translate-y-[3px] shadow-none' : ''
                      }`}
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <h3 className="font-pixel font-bold text-lg text-espresso dark:text-[#fff8f0]">
                  {s.title}
                </h3>
                <p className="text-xs text-espresso-muted dark:text-[#cfbea9] mt-1 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-espresso/15 flex items-center justify-between text-xs font-pixel text-espresso-muted dark:text-cocoa-muted">
                <span>Sound feedback</span>
                <span className="font-bold text-coral">♪ {s.sfx}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
