import React, { useState, useEffect } from 'react';
import { Eye, MousePointer, Wind, Timer, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function BentoFeatures() {
  const [breathePhase, setBreathePhase] = useState('Inhale');

  useEffect(() => {
    const phases = ['Inhale...', 'Hold...', 'Exhale...'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathePhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative py-28 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Thoughtfully Designed</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white tracking-tight">
          Everything You'll Love About It
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed">
          No complicated setup, no lag, and zero annoying popups. Just a sweet little friend that makes using your computer more joyful.
        </p>
      </div>

      {/* Bento Grid (Human & Visual, ZERO Code or Terminals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Click Pass-Through (Wide 2-Columns) */}
        <div className="md:col-span-2 bg-[#10111a] border border-[#222336] hover:border-pink-500/40 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <MousePointer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Never in Your Way
                </h3>
                <span className="text-sm font-medium text-pink-400">Click right through empty space</span>
              </div>
            </div>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8">
              Your pet floats gently on top of your windows, but your mouse clicks pass straight through! You can type notes, watch videos, or browse the web underneath them without ever getting blocked.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#09090f] border border-[#1b1c2b] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm sm:text-base font-medium text-zinc-200">
                Transparent click-routing is always active
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              Zero Distraction
            </span>
          </div>
        </div>

        {/* Card 2: 4-4-4 Breathing Reset */}
        <div className="bg-[#10111a] border border-[#222336] hover:border-sky-400/40 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                Take a Deep Breath
              </h3>
            </div>
            <p className="text-base text-zinc-300 leading-relaxed mb-6">
              When work gets hectic, one shortcut starts a guided 1-minute breathing circle. Your buddy gently expands and deflates with you.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-[#09090f] rounded-2xl border border-[#1b1c2b]">
            <div className="relative flex items-center justify-center w-28 h-28">
              <div
                className={`absolute inset-0 rounded-full bg-sky-500/20 border border-sky-400/50 transition-all duration-1000 ${
                  breathePhase.startsWith('Inhale')
                    ? 'scale-125'
                    : breathePhase.startsWith('Hold')
                    ? 'scale-125 animate-pulse'
                    : 'scale-90'
                }`}
              />
              <span className="relative z-10 text-base font-bold text-sky-300">
                {breathePhase}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Eye Tracking */}
        <div className="bg-[#10111a] border border-[#222336] hover:border-amber-400/40 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                Eyes That Watch You
              </h3>
            </div>
            <p className="text-base text-zinc-300 leading-relaxed mb-6">
              Wherever you move your cursor—even on a second monitor—your pet’s eyes will curiously follow your pointer.
            </p>
          </div>

          <div className="p-5 bg-[#09090f] rounded-2xl border border-[#1b1c2b] text-center">
            <span className="text-sm font-semibold text-amber-300">
              Tracks Across Any Monitor
            </span>
          </div>
        </div>

        {/* Card 4: Fling & Toss Physics */}
        <div className="bg-[#10111a] border border-[#222336] hover:border-rose-400/40 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                Playful Fling Physics
              </h3>
            </div>
            <p className="text-base text-zinc-300 leading-relaxed mb-6">
              Pick them up and throw them across the screen! They will tumble, bounce off window edges, and land safely with dizzy stars.
            </p>
          </div>

          <div className="p-5 bg-[#09090f] rounded-2xl border border-[#1b1c2b] text-center">
            <span className="text-sm font-semibold text-rose-300">
              Drag, Shake, Toss & Squish
            </span>
          </div>
        </div>

        {/* Card 5: Focus & Study Sessions */}
        <div className="bg-[#10111a] border border-[#222336] hover:border-purple-400/40 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">
                Study & Focus Timers
              </h3>
            </div>
            <p className="text-base text-zinc-300 leading-relaxed mb-6">
              Set 15, 25, or 50-minute Pomodoro study sessions. When time is up, your pet celebrates with stars and sweet chimes.
            </p>
          </div>

          <div className="p-5 bg-[#09090f] rounded-2xl border border-[#1b1c2b] text-center">
            <span className="text-sm font-semibold text-purple-300">
              Celebration Chimes & Star Alarms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
