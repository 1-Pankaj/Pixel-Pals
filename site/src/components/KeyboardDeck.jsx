import React, { useState, useEffect } from 'react';
import { Keyboard, Sparkles } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

const SHORTCUTS = [
  { keys: ['Alt', 'Shift', 'P'], title: 'Pet Your Buddy', desc: 'Squeezes them with love and hearts', sfx: 'purr' },
  { keys: ['Alt', 'Shift', 'F'], title: 'Drop a Snack', desc: 'Drops a fresh cookie, donut, or boba', sfx: 'pop' },
  { keys: ['Alt', 'Shift', 'D'], title: 'Dance Party', desc: 'Plays music notes and happy wiggles', sfx: 'dance' },
  { keys: ['Alt', 'Shift', 'Q'], title: 'Ask a Question', desc: 'Pops a fun dilemma or trivia choice', sfx: 'ask' },
  { keys: ['Alt', 'Shift', 'R'], title: 'Rock, Paper, Scissors', desc: 'Drumroll reveal against your buddy', sfx: 'drum' },
  { keys: ['Alt', 'Shift', '1'], title: 'Answer Choice #1', desc: 'Quick answer without using mouse', sfx: 'click' },
  { keys: ['Alt', 'Shift', 'E'], title: '1-Min Breathing', desc: 'Soothing inhale and exhale guide', sfx: 'chime' },
  { keys: ['Alt', 'Shift', 'G'], title: '25-Min Focus Timer', desc: 'Pomodoro timer with gentle alarms', sfx: 'bell' }
];

export function KeyboardDeck() {
  const [activeKey, setActiveKey] = useState(null);

  const triggerAction = (s) => {
    PET_SFX.unlock();
    if (PET_SFX[s.sfx]) PET_SFX[s.sfx]();
    setActiveKey(s.keys.join('+'));
    setTimeout(() => setActiveKey(null), 350);
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3">
          <Keyboard className="w-4 h-4 text-pink-400" />
          <span>Interactive Shortcuts</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
          Keyboard Magic
        </h2>
        <p className="mt-4 text-lg text-zinc-300 font-sans max-w-lg mx-auto leading-relaxed">
          The pet window never takes focus away from what you are doing. Press these keys anywhere in Windows (or click any keycap below to test-drive!):
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SHORTCUTS.map((s, idx) => {
          const isPressed = activeKey === s.keys.join('+');
          return (
            <div
              key={idx}
              onClick={() => triggerAction(s)}
              className={`cursor-pointer p-6 rounded-3xl bg-[#10111a] border transition-all duration-150 select-none flex flex-col justify-between ${
                isPressed
                  ? 'border-pink-500 bg-[#1b1c2b] scale-95 shadow-inner'
                  : 'border-[#222336] hover:border-pink-500/60 hover:bg-[#151624] shadow-lg'
              }`}
            >
              {/* 3D Keycap Row */}
              <div className="flex gap-2 mb-4">
                {s.keys.map((k, ki) => (
                  <span
                    key={ki}
                    className={`font-mono text-sm px-3 py-2 rounded-xl font-bold transition-all ${
                      isPressed
                        ? 'bg-pink-500 text-black shadow-none translate-y-1'
                        : 'bg-[#202133] text-white shadow-[0_4px_0_0_#2d2f47] border border-[#2d2f47]'
                    }`}
                  >
                    {k}
                  </span>
                ))}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white font-heading">{s.title}</h4>
                <p className="text-sm text-zinc-400 mt-1">{s.desc}</p>
                <span className="text-xs font-semibold text-pink-400 mt-3 inline-block">
                  Click to test sound →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
