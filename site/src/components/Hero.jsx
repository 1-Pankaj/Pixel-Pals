import React from 'react';
import { SparklesCore } from './Sparkles';
import { RetroGrid } from './RetroGrid';
import { PetPlayground } from './PetPlayground';
import { Download, Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function Hero({ onSelectPet }) {
  const handleDownloadClick = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Aceternity Sparkles & Retro Grid */}
      <SparklesCore
        id="hero-sparkles"
        background="transparent"
        minSize={0.8}
        maxSize={2.6}
        particleDensity={60}
        particleColor="#fab387"
        className="z-0"
      />
      <RetroGrid className="z-0" />

      {/* Radiant ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-peach/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach/10 border border-peach/30 text-peach text-xs font-mono mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero AI • Zero Accounts • 100% Handcrafted</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-pixel font-bold text-white tracking-wide leading-tight">
            A Tiny Companion That Lives{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach via-gold to-rose">
              On Top of Your Windows.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-subtext font-sans max-w-xl leading-relaxed">
            Adopt one of six pixel buddies. Their eyes track your mouse, they ask you questions with clickable choices, play games, eat snacks, guide breathing breaks, and speak in real-time WebAudio Animalese.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <button
              onClick={handleDownloadClick}
              className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1.5px] focus:outline-none focus:ring-2 focus:ring-peach group shadow-xl shadow-peach/20"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fab387_0%,#f9e2af_50%,#fab387_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-[#11111b] px-6 py-1 text-sm font-bold font-mono text-peach backdrop-blur-3xl group-hover:bg-[#181825] group-hover:text-white transition-all gap-2">
                <Download className="w-4 h-4" />
                <span>Download for Windows (.exe)</span>
              </span>
            </button>

            <a
              href="#pals"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[#161726] hover:bg-[#1f2136] text-white border border-card-border font-mono text-sm transition"
            >
              <span>Explore All 6 Pals ↓</span>
            </a>
          </div>

          {/* Quality Proof Points */}
          <div className="mt-10 flex flex-wrap gap-6 text-xs text-subtext font-mono justify-center lg:justify-start">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-mint" />
              <span>Free & Open Source (MIT)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky" />
              <span>Near 0% Idle CPU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose" />
              <span>2,507 Hand-Authored Lines</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Pet Playground */}
        <div id="playground" className="lg:col-span-5 flex justify-center">
          <PetPlayground onSelectPet={onSelectPet} />
        </div>
      </div>
    </section>
  );
}
