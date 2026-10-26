import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PET_SFX } from '../lib/sounds';

const DOCK_ITEMS = [
  { id: 'mochi', label: 'Mochi (Cat)', icon: '🐱', bg: 'bg-[#ff7a59]' },
  { id: 'biscuit', label: 'Biscuit (Shiba)', icon: '🐶', bg: 'bg-[#ffd76e]' },
  { id: 'pudding', label: 'Pudding (Slime)', icon: '🟢', bg: 'bg-[#7ed6a0]' },
  { id: 'luna', label: 'Luna (Ghost)', icon: '👻', bg: 'bg-[#cbb2fe]' },
  { id: 'clover', label: 'Clover (Bunny)', icon: '🐰', bg: 'bg-[#ff6d8a]' },
  { id: 'miso', label: 'Miso (Axolotl)', icon: '🩷', bg: 'bg-[#7ec8ff]' },
  { id: 'cookie', label: 'Drop Cookie', icon: '🍪', bg: 'bg-[#e5be50]', action: 'snack' },
  { id: 'music', label: 'Dance Party', icon: '🎵', bg: 'bg-[#5dbb82]', action: 'dance' },
  { id: 'cuddle', label: 'Pet Buddy', icon: '♥', bg: 'bg-[#ff6d8a]', action: 'pet' },
];

export function SpringDock({ selectedPet, onSelectPet, onAction }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleClick = (item) => {
    PET_SFX.unlock();
    if (item.action) {
      if (onAction) onAction(item.action);
    } else {
      PET_SFX.boing();
      if (onSelectPet) onSelectPet(item.id);
    }
  };

  return (
    <div className="flex items-center justify-center my-6 z-20">
      <div
        onMouseLeave={() => setHoveredIdx(null)}
        className="flex items-end gap-2.5 px-4 py-2.5 rounded-2xl bg-cream-surface/90 dark:bg-cocoa-canvas/90 backdrop-blur-md border-3 border-espresso shadow-pixel-lg"
      >
        {DOCK_ITEMS.map((item, idx) => {
          const isSelected = selectedPet === item.id;
          let scale = 1;
          if (hoveredIdx !== null) {
            const distance = Math.abs(hoveredIdx - idx);
            if (distance === 0) scale = 1.35;
            else if (distance === 1) scale = 1.18;
            else if (distance === 2) scale = 1.06;
          }

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              {/* Tooltip on hover */}
              {hoveredIdx === idx && (
                <div className="absolute -top-10 px-2.5 py-1 rounded-md bg-espresso text-cream text-[11px] font-pixel font-bold whitespace-nowrap shadow-md pointer-events-none z-30">
                  {item.label}
                </div>
              )}

              {/* Spring Icon Button */}
              <motion.button
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => handleClick(item)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl select-none border-2 border-espresso transition-shadow shadow-xs ${
                  item.bg
                } ${isSelected ? 'ring-3 ring-honey ring-offset-2' : ''}`}
              >
                <span>{item.icon}</span>
              </motion.button>

              {/* Active Dot */}
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-honey border border-espresso mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
