import React from 'react';
import { AceternityHeroSparkles } from './Sparkles';
import { PetPlayground } from './PetPlayground';
import { Download, Heart, Sparkles, Smile, ShieldCheck, Zap } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';
import { motion } from 'framer-motion';

export function Hero({ onSelectPet }) {
  const handleDownload = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 flex flex-col items-center justify-center px-4 overflow-hidden bg-black">
      {/* Top Friendly Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3 shadow-lg"
      >
        <Sparkles className="w-4 h-4 text-pink-400" />
        <span>100% Free Desktop App • No Ads • No Subscriptions</span>
      </motion.div>

      {/* The Signature Aceternity Sparkles Hero */}
      <AceternityHeroSparkles
        title="Pixel Pals"
        subtitle="Your Adorable Desktop Bestie"
      />

      {/* Human Friendly Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-xl sm:text-2xl md:text-3xl text-zinc-300 text-center font-heading font-normal max-w-3xl mx-auto -mt-14 mb-8 leading-relaxed px-4"
      >
        A cute little buddy who lives on top of your windows. Their eyes follow your mouse, they play mini-games, eat snacks, and keep you smiling while you study or work.
      </motion.p>

      {/* Large Glowing CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-16 z-20"
      >
        <button
          onClick={handleDownload}
          className="relative group overflow-hidden rounded-2xl p-[2px] focus:outline-none shadow-2xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f472b6_0%,#fb923c_50%,#f472b6_100%)]" />
          <span className="inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-[14px] bg-black px-8 py-3 text-lg font-bold text-white backdrop-blur-3xl group-hover:bg-zinc-950 transition gap-3">
            <Download className="w-5 h-5 text-pink-400" />
            <span>Download for Windows (Free)</span>
          </span>
        </button>

        <a
          href="#pals"
          className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 text-base font-semibold transition"
        >
          <span>Choose Your Buddy ↓</span>
        </a>
      </motion.div>

      {/* Live Pet Playground Stage */}
      <div id="playground" className="w-full max-w-4xl mx-auto z-20 mb-16">
        <PetPlayground onSelectPet={onSelectPet} />
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400 font-medium">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-amber-400" />
          <span>6 Unique Buddies</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>2,500+ Hand-Authored Cute Lines</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Safe & Open Source</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-400" />
          <span>Never Slows Down Your PC</span>
        </div>
      </div>
    </section>
  );
}
