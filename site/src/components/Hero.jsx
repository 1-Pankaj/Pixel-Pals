import React from 'react';
import { motion } from 'framer-motion';
import { LampContainer } from './LampEffect';
import { AceternityHeroSparkles } from './Sparkles';
import { BackgroundBeams } from './BackgroundBeams';
import { PetPlayground } from './PetPlayground';
import { SpringDock } from './SpringDock';
import { PixelDownload, PixelSparkle, PixelHeart, PixelShield, PixelZap, PixelStar } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

export function Hero({ onSelectPet }) {
  const handleDownloadClick = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToPlayground = () => {
    PET_SFX.unlock();
    PET_SFX.boop();
    const el = document.getElementById('playground');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-24 pb-20 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Animated Beams */}
      <BackgroundBeams />

      {/* 3D Horizon Grid Background */}
      <div className="absolute inset-x-0 bottom-0 h-96 retro-horizon-grid opacity-30 dark:opacity-40 pointer-events-none" />

      {/* Floating Retro Stars in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-28 left-[8%] text-honey/60 dark:text-honey/50 animate-float-slow">
          <PixelStar className="w-8 h-8" />
        </div>
        <div className="absolute top-44 right-[10%] text-coral/60 dark:text-coral/50 animate-float-fast">
          <PixelStar className="w-7 h-7" />
        </div>
        <div className="absolute top-80 left-[14%] text-mint/60 dark:text-mint/50 animate-bounce-subtle">
          <PixelSparkle className="w-6 h-6" />
        </div>
        <div className="absolute top-96 right-[12%] text-sky/60 dark:text-sky/50 animate-float-slow">
          <PixelStar className="w-7 h-7" />
        </div>
      </div>

      {/* Aceternity Lamp Container */}
      <LampContainer className="pt-8 pb-4">
        {/* Top Cute Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey text-espresso font-pixel font-bold text-xs sm:text-sm mb-4 border-2 border-espresso shadow-pixel select-none"
        >
          <PixelSparkle className="w-4 h-4 text-coral animate-pulse" />
          <span>100% Free & Open Source Desktop Companion • No Accounts</span>
        </motion.div>

        {/* Aceternity Sparkles & Big Luxury Headline */}
        <AceternityHeroSparkles title="Pixel Pals" />

        {/* Human Friendly Subtitle (22px-26px, crystal clear contrast) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl text-espresso-muted dark:text-[#dfd2c0] font-heading font-medium max-w-3xl mx-auto mt-3 mb-8 leading-relaxed text-center px-4 select-none"
        >
          An adorable little friend that lives on top of your windows.
          Their eyes follow your cursor, they munch on cookies, and they keep you company while you study or work.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 z-20"
        >
          <button
            onClick={handleDownloadClick}
            className="retro-btn bg-honey hover:bg-honey-light text-espresso px-8 py-4 text-base sm:text-lg font-pixel font-bold shadow-pixel-lg hover:shadow-pixel-xl transition-all"
          >
            <PixelDownload className="w-6 h-6" />
            <span>Download for Windows (Free)</span>
          </button>

          <button
            onClick={handleScrollToPlayground}
            className="retro-btn bg-[#fffdf8] dark:bg-[#241b14] text-espresso dark:text-[#fff8f0] border-3 border-espresso hover:border-honey px-7 py-4 text-base font-pixel font-bold transition-all"
          >
            <span>Play with Buddies ↓</span>
          </button>
        </motion.div>
      </LampContainer>

      {/* Main Interactive Stage */}
      <div id="playground" className="w-full max-w-4xl mx-auto z-20 mb-6">
        <PetPlayground onSelectPet={onSelectPet} />
      </div>

      {/* Spring Dock (MacOS / Tamagotchi spring dock) */}
      <div className="w-full max-w-4xl mx-auto z-20 mb-12">
        <SpringDock
          selectedPet="mochi"
          onSelectPet={onSelectPet}
          onAction={(act) => {
            if (act === 'snack') { PET_SFX.unlock(); PET_SFX.munch(); }
            else if (act === 'dance') { PET_SFX.unlock(); PET_SFX.dance(); }
            else if (act === 'pet') { PET_SFX.unlock(); PET_SFX.purr(); }
          }}
        />
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left z-10">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl retro-surface">
          <div className="p-2 rounded-xl bg-coral text-white border-2 border-espresso">
            <PixelHeart className="w-4 h-4" />
          </div>
          <div>
            <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">6 Companions</p>
            <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Cat, Shiba, Slime & more</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl retro-surface">
          <div className="p-2 rounded-xl bg-honey text-espresso border-2 border-espresso">
            <PixelSparkle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">2,500+ Lines</p>
            <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Cozy Animalese chatter</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl retro-surface">
          <div className="p-2 rounded-xl bg-mint text-espresso border-2 border-espresso">
            <PixelShield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">100% Offline</p>
            <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Zero tracking, zero lag</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl retro-surface">
          <div className="p-2 rounded-xl bg-sky text-espresso border-2 border-espresso">
            <PixelZap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">Click-Through</p>
            <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Never blocks clicks</p>
          </div>
        </div>
      </div>
    </section>
  );
}
