import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AceternityHeroSparkles } from './Sparkles';
import { PetPlayground } from './PetPlayground';
import { PixelDownload, PixelSparkle, PixelHeart, PixelShield, PixelZap, PixelStar } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

export function Hero({ onSelectPet }) {
  const { scrollY } = useScroll();

  // Parallax transforms for floating celestial background elements
  const yBgStars = useTransform(scrollY, [0, 800], [0, -140]);
  const yBgClouds = useTransform(scrollY, [0, 800], [0, -70]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0.4]);

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
    <section className="relative min-h-screen pt-32 pb-24 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Parallax Background Decorative Elements */}
      <motion.div
        style={{ y: yBgStars, opacity: opacityFade }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Floating Stars */}
        <div className="absolute top-24 left-[10%] text-honey/60 dark:text-honey/40 animate-float-slow">
          <PixelStar className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-[12%] text-coral/60 dark:text-coral/40 animate-float-fast">
          <PixelStar className="w-6 h-6" />
        </div>
        <div className="absolute top-72 left-[18%] text-mint/60 dark:text-mint/40 animate-bounce-subtle">
          <PixelSparkle className="w-5 h-5" />
        </div>
        <div className="absolute top-96 right-[15%] text-sky/60 dark:text-sky/40 animate-float-slow">
          <PixelStar className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Floating Retro Clouds */}
      <motion.div
        style={{ y: yBgClouds }}
        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20"
      >
        <div className="absolute top-36 left-4 font-dialogue text-5xl text-espresso-muted/30 select-none">
          ☁ ☁
        </div>
        <div className="absolute top-64 right-6 font-dialogue text-6xl text-espresso-muted/30 select-none">
          ☁
        </div>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Top Cute Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 dark:bg-honey/10 border-2 border-honey text-espresso dark:text-honey font-pixel font-bold text-xs sm:text-sm mb-4 shadow-pixel-soft dark:shadow-pixel-dark select-none"
        >
          <PixelSparkle className="w-4 h-4 text-coral animate-pulse" />
          <span>100% Free & Open Source Desktop Pet • No Ads • No Accounts</span>
        </motion.div>

        {/* Aceternity Hero Sparkles (Zero overlap with text below) */}
        <AceternityHeroSparkles title="Pixel Pals" />

        {/* Human Friendly Subtitle (Clear, readable, comfortable spacing) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-espresso-muted dark:text-cocoa-muted font-heading font-medium max-w-3xl mx-auto mt-4 mb-8 leading-relaxed px-4 select-none"
        >
          An adorable little buddy that lives peacefully on top of your windows.
          Their eyes follow your cursor, they munch on cookies, and they keep you company while you study or work.
        </motion.p>

        {/* Tactile Retro Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16 z-20"
        >
          {/* Main Download CTA (App Honey Palette) */}
          <button
            onClick={handleDownloadClick}
            className="retro-btn bg-honey hover:bg-honey-light text-espresso px-8 py-4 text-base sm:text-lg font-pixel font-bold shadow-pixel-lg hover:shadow-pixel-xl transition-all"
          >
            <PixelDownload className="w-6 h-6" />
            <span>Download for Windows (Free)</span>
          </button>

          {/* Playground Jump CTA */}
          <button
            onClick={handleScrollToPlayground}
            className="retro-btn bg-cream-light dark:bg-cocoa-card text-espresso dark:text-cream border-espresso dark:border-cocoa-border hover:border-honey px-7 py-4 text-base font-pixel font-bold transition-all"
          >
            <span>Play with Buddies ↓</span>
          </button>
        </motion.div>

        {/* Interactive Pet Playground (Positioned prominently) */}
        <motion.div
          id="playground"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="w-full z-20 mb-14"
        >
          <PetPlayground onSelectPet={onSelectPet} />
        </motion.div>

        {/* Human Trust Badges (Zero jargon) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-surface/60 dark:bg-cocoa-card/60 border-2 border-espresso/15 dark:border-cocoa-border">
            <div className="p-2 rounded-lg bg-coral/20 text-coral">
              <PixelHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">6 Companions</p>
              <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Cat, Shiba, Slime & more</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-surface/60 dark:bg-cocoa-card/60 border-2 border-espresso/15 dark:border-cocoa-border">
            <div className="p-2 rounded-lg bg-honey/20 text-honey">
              <PixelSparkle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">2,500+ Lines</p>
              <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Cozy Animalese chatter</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-surface/60 dark:bg-cocoa-card/60 border-2 border-espresso/15 dark:border-cocoa-border">
            <div className="p-2 rounded-lg bg-mint/20 text-mint">
              <PixelShield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">100% Offline</p>
              <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Zero tracking, zero lag</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-surface/60 dark:bg-cocoa-card/60 border-2 border-espresso/15 dark:border-cocoa-border">
            <div className="p-2 rounded-lg bg-sky/20 text-sky">
              <PixelZap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-pixel font-bold text-sm text-espresso dark:text-cream">Click-Through</p>
              <p className="font-sans text-xs text-espresso-muted dark:text-cocoa-muted">Never blocks your mouse</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
