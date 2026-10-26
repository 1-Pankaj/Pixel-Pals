import React from 'react';
import { MessageCircle } from 'lucide-react';

const ROW_1 = [
  "The wind is just the sky sighing about something. Probably our passwords.",
  "10/10 would fetch that file for you. If I had arms. And files were balls.",
  "Professional napper here. I will judge your playlist, lovingly.",
  "Caves are the earth's secret rooms. Everyone has them. Some have stalactites.",
  "You have unlocked my secret purr mode. It cannot be undone.",
  "Remember to drink water! Plants need water, and you are basically a fancy plant.",
  "Friday mode: maximum joy, minimum productivity, infinite vibes."
];

const ROW_2 = [
  "Knock knock. Who is there? Anita. Anita who? Anita snack immediately!",
  "Slime secrets: we taste like mint, bounce like springs, love like giants.",
  "Did you know? Honey never spoils. 3,000-year-old tomb honey is still edible.",
  "My tiny brain holds infinite love and zero passwords. Perfectly balanced.",
  "Breathe in for 4 seconds... hold for 4... and release. You got this.",
  "My ears rotate like tiny radar dishes. Currently detecting: snack opportunities.",
  "I am not ignoring you. I am simply entering sleep mode with floating Zzz's."
];

export function DialogueMarquee() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-card-border/60 bg-[#0b0c14]/50">
      {/* Side gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#090a10] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#090a10] to-transparent z-10 pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-8 px-4">
        <span className="text-xs font-mono text-peach uppercase tracking-widest block mb-1">
          2,500+ Hand-Authored Lines
        </span>
        <h3 className="font-pixel text-2xl sm:text-3xl font-bold text-white">
          Things Your Pal Might Say While You Work
        </h3>
      </div>

      {/* Row 1: Leftward Marquee */}
      <div className="flex overflow-hidden select-none group">
        <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] py-2">
          {ROW_1.concat(ROW_1).map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#121320] border border-card-border/80 text-xs sm:text-sm font-sans text-subtext whitespace-nowrap shadow-sm hover:border-peach/50 hover:text-white transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-peach flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Rightward Marquee */}
      <div className="flex overflow-hidden select-none group mt-3">
        <div className="flex gap-4 animate-marquee-reverse group-hover:[animation-play-state:paused] py-2">
          {ROW_2.concat(ROW_2).map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#121320] border border-card-border/80 text-xs sm:text-sm font-sans text-subtext whitespace-nowrap shadow-sm hover:border-gold/50 hover:text-white transition"
            >
              <span className="text-gold text-xs flex-shrink-0">★</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
