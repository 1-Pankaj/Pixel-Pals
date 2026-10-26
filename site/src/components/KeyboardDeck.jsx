import React, { useState, useEffect } from 'react';
import { Keyboard, Sparkles } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

const SHORTCUTS = [
  { keys: ['Alt', 'Shift', 'P'], action: 'Pet buddy (burst hearts)', sfx: 'purr' },
  { keys: ['Alt', 'Shift', 'F'], action: 'Drop snack (cookie / donut / boba)', sfx: 'pop' },
  { keys: ['Alt', 'Shift', 'D'], action: 'Start dance party (wiggle + notes)', sfx: 'dance' },
  { keys: ['Alt', 'Shift', 'Q'], action: 'Ask random question / game', sfx: 'ask' },
  { keys: ['Alt', 'Shift', 'R'], action: 'Rock, Paper, Scissors', sfx: 'drum' },
  { keys: ['Alt', 'Shift', '1'], action: 'Answer choice #1', sfx: 'click' },
  { keys: ['Alt', 'Shift', 'E'], action: 'Guided 1-minute breathing', sfx: 'chime' },
  { keys: ['Alt', 'Shift', 'G'], action: 'Start 25-min focus timer', sfx: 'bell' }
];

export function KeyboardDeck() {
  const [activeKey, setActiveKey] = useState(null);

  const triggerAction = (s) => {
    PET_SFX.unlock();
    if (PET_SFX[s.sfx]) PET_SFX[s.sfx]();
    setActiveKey(s.keys.join('+'));
    setTimeout(() => setActiveKey(null), 300);
  };

  // Listen to real keyboard events!
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
    <section id="shortcuts" className="relative py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/30 text-peach text-xs font-mono mb-3">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Interactive Control Deck</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-pixel font-bold text-white tracking-wide">
          Global Shortcuts
        </h2>
        <p className="mt-3 text-subtext text-sm sm:text-base font-sans">
          The pet window never steals keyboard focus. Control everything globally from anywhere in Windows with custom shortcuts. Click any keycap below to test-drive!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHORTCUTS.map((s, idx) => {
          const isPressed = activeKey === s.keys.join('+');
          return (
            <div
              key={idx}
              onClick={() => triggerAction(s)}
              className={`cursor-pointer p-4 rounded-2xl bg-[#121320] border transition-all duration-150 select-none group flex flex-col justify-between ${
                isPressed
                  ? 'border-peach bg-[#1e2038] scale-95 shadow-inner'
                  : 'border-card-border hover:border-peach/50 hover:bg-[#161728] shadow-md'
              }`}
            >
              {/* Keycaps row */}
              <div className="flex gap-1.5 mb-3">
                {s.keys.map((k, ki) => (
                  <span
                    key={ki}
                    className={`font-mono text-xs px-2.5 py-1.5 rounded-lg border font-bold transition-all ${
                      isPressed
                        ? 'bg-peach text-[#11111b] border-peach shadow-none translate-y-0.5'
                        : 'bg-[#1e1f32] text-white border-card-border shadow-[0_3px_0_0_#2b2d45] group-hover:border-peach/40'
                    }`}
                  >
                    {k}
                  </span>
                ))}
              </div>

              {/* Action label */}
              <div>
                <span className="text-xs font-sans text-subtext group-hover:text-white transition-colors block font-medium">
                  {s.action}
                </span>
                <span className="text-[10px] font-mono text-peach/70 mt-1 block">
                  Click or press key
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
