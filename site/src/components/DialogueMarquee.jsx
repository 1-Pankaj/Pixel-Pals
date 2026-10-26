import React from 'react';
import { MessageCircleHeart, Sparkles } from 'lucide-react';

const QUOTES_TOP = [
  "“The wind is just the sky sighing about something. Probably our passwords.”",
  "“10/10 would fetch that window for you. If I had arms. And windows were balls.”",
  "“Professional napper here. I will judge your playlist, with deep affection.”",
  "“Remember to drink water! Plants need water, and you are basically a fancy plant.”",
  "“You have unlocked my secret cuddle mode. It cannot be undone!”",
  "“Friday mode: maximum joy, minimum productivity, infinite cozy vibes.”"
];

const QUOTES_BOTTOM = [
  "“Knock knock. Who is there? Anita. Anita who? Anita snack immediately!”",
  "“Slime secrets: we taste like mint, bounce like springs, and love like giants.”",
  "“My tiny brain holds infinite love and zero passwords. Balanced.”",
  "“Breathe in for 4 seconds... hold for 4... and exhale. You're doing great.”",
  "“My ears rotate like tiny radar dishes. Currently detecting: snack opportunities.”",
  "“I'm not ignoring you, I'm simply taking a power nap with floating Zzz's.”"
];

export function DialogueMarquee() {
  return (
    <section className="relative py-20 overflow-hidden border-y border-[#1f2030] bg-[#07070b]">
      {/* Side gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>2,500+ Handcrafted Lines</span>
        </div>
        <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Things They Say While You Study or Work
        </h3>
      </div>

      {/* Row 1: Leftward */}
      <div className="flex overflow-hidden select-none group">
        <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] py-2">
          {QUOTES_TOP.concat(QUOTES_TOP).map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#12131f] border border-[#222336] text-base font-sans text-zinc-100 whitespace-nowrap shadow-md hover:border-pink-500/50 hover:bg-[#18192a] transition duration-200"
            >
              <MessageCircleHeart className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <span className="font-medium">{text}</span>
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
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#12131f] border border-[#222336] text-base font-sans text-zinc-100 whitespace-nowrap shadow-md hover:border-amber-400/50 hover:bg-[#18192a] transition duration-200"
            >
              <span className="text-amber-400 text-base flex-shrink-0">★</span>
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
