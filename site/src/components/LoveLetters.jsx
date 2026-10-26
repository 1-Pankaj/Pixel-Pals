import React from 'react';
import { PixelHeart, PixelStar, PixelSparkle } from './PixelIcons';

const LETTERS = [
  {
    name: 'Maya S.',
    role: 'Digital Illustrator & Student',
    pal: 'Mochi 🐱',
    color: 'bg-[#fff9d9] text-espresso border-espresso',
    rotation: '-rotate-2',
    text: 'Having Mochi sit right next to my Photoshop canvas makes late-night art commissions so much less lonely. The eye-following feature is insanely cute!'
  },
  {
    name: 'Leo K.',
    role: 'Software Engineer',
    pal: 'Pudding 🟢',
    color: 'bg-[#eefbee] text-espresso border-espresso',
    rotation: 'rotate-1',
    text: 'Transparent click-routing is pure genius. I can click buttons and write code right through their little floating window without ever getting blocked.'
  },
  {
    name: 'Samira T.',
    role: 'Writer & Researcher',
    pal: 'Luna 👻',
    color: 'bg-[#f4eeff] text-espresso border-espresso',
    rotation: '-rotate-1',
    text: 'The 4-4-4 breathing circle has literally saved me during intense thesis deadlines. Luna floats calmly, breathes with me, and never begs for attention.'
  },
  {
    name: 'David W.',
    role: 'Game Designer',
    pal: 'Biscuit 🐶',
    color: 'bg-[#ffedf1] text-espresso border-espresso',
    rotation: 'rotate-2',
    text: 'Only 12MB of RAM, zero ads, zero telemetry, and pure WebAudio Animalese voice synthesis! This is what desktop software used to feel like. 10/10.'
  }
];

export function LoveLetters() {
  return (
    <section className="relative py-28 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelHeart className="w-4 h-4 text-coral" />
          <span>Community Notes</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-espresso dark:text-cream tracking-tight">
          Notes From Desktop Friends
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-cocoa-muted font-sans max-w-xl mx-auto leading-relaxed">
          How people around the world keep their screens warm, playful, and cheerful every day.
        </p>
      </div>

      {/* Retro Sticky Note Wall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LETTERS.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} ${item.rotation} p-6 rounded-2xl border-3 shadow-pixel hover:rotate-0 hover:scale-105 transition-all duration-200 flex flex-col justify-between select-none relative group`}
          >
            {/* Retro Pushpin Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-coral border-2 border-espresso shadow-xs" />

            <div>
              {/* Companion Tag */}
              <div className="flex items-center justify-between mb-3 text-xs font-pixel font-bold text-espresso/70">
                <span>Companion: {item.pal}</span>
                <PixelStar className="w-3.5 h-3.5 text-honey" />
              </div>

              {/* Note Content */}
              <p className="font-sans text-sm text-espresso leading-relaxed italic mb-6">
                “{item.text}”
              </p>
            </div>

            {/* Author */}
            <div className="pt-3 border-t-2 border-espresso/15 flex items-center justify-between text-xs font-pixel">
              <div>
                <span className="font-bold text-espresso block">{item.name}</span>
                <span className="text-espresso/70 text-[11px]">{item.role}</span>
              </div>
              <span className="text-coral text-sm">♥</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
