import React from 'react';
import { PixelMessage, PixelSparkle, PixelStar } from './PixelIcons';

const QUOTES_TOP = [
  "“The wind is just the sky sighing about something. Probably forgotten passwords.”",
  "“10/10 would fetch that window for you if I had arms and windows were tennis balls.”",
  "“Professional napper here. I will quietly judge your playlist with pure affection.”",
  "“Remember to drink water! Plants need water, and you are basically a very cute fancy plant.”",
  "“You have unlocked my secret cuddle mode. It cannot be undone!”",
  "“Friday mode: maximum joy, minimum productivity, infinite cozy vibes.”"
];

const QUOTES_BOTTOM = [
  "“Knock knock. Who is there? Anita. Anita who? Anita snack immediately!”",
  "“Slime secrets: we taste like mint, bounce like springs, and love like giants.”",
  "“My tiny brain holds infinite love and zero worries. Perfectly balanced.”",
  "“Breathe in for 4 seconds... hold for 4... and exhale. You are doing fantastic.”",
  "“My ears rotate like tiny radar dishes. Currently detecting: snack opportunities!”",
  "“I am not ignoring you, I am taking an urgent power nap with floating Zzz's.”"
];

export function DialogueMarquee() {
  return (
    <section className="relative py-20 overflow-hidden border-y-3 border-espresso bg-cream-surface/40 dark:bg-cocoa-card/40 transition-colors">
      {/* Side gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-cream dark:from-cocoa-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-cream dark:from-cocoa-bg to-transparent z-10 pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-10 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-xs font-pixel font-bold mb-3">
          <PixelSparkle className="w-3.5 h-3.5 text-coral" />
          <span>2,500+ Handcrafted Lines</span>
        </div>
        <h3 className="font-heading text-3xl sm:text-4xl font-bold text-espresso dark:text-cream">
          Things They Say While You Study or Work
        </h3>
        <p className="mt-2 text-base text-espresso-muted dark:text-cocoa-muted font-sans">
          Never repetitive, never robotic. Written with genuine heart and humor.
        </p>
      </div>

      {/* Row 1: Leftward */}
      <div className="flex overflow-hidden select-none group">
        <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] py-2">
          {QUOTES_TOP.concat(QUOTES_TOP).map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-cream-light dark:bg-cocoa-canvas border-2 border-espresso text-base text-espresso dark:text-cream whitespace-nowrap shadow-pixel-soft hover:shadow-pixel transition duration-200"
            >
              <PixelMessage className="w-4 h-4 text-coral shrink-0" />
              <span className="font-dialogue text-2xl tracking-wide leading-none">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Rightward */}
      <div className="flex overflow-hidden select-none group mt-4">
        <div className="flex gap-4 animate-marquee-reverse group-hover:[animation-play-state:paused] py-2">
          {QUOTES_BOTTOM.concat(QUOTES_BOTTOM).map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-cream-light dark:bg-cocoa-canvas border-2 border-espresso text-base text-espresso dark:text-cream whitespace-nowrap shadow-pixel-soft hover:shadow-pixel transition duration-200"
            >
              <PixelStar className="w-4 h-4 text-honey shrink-0" />
              <span className="font-dialogue text-2xl tracking-wide leading-none">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
