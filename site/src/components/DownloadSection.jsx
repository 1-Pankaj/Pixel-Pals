import React from 'react';
import confetti from 'canvas-confetti';
import { PixelDownload, PixelSparkle, PixelCheck, PixelZap, PixelGithub, PixelHeart } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

export function DownloadSection() {
  const triggerConfetti = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.65 },
      colors: ['#ffd76e', '#ff6d8a', '#7ed6a0', '#7ec8ff', '#cbb2fe']
    });
  };

  return (
    <section id="download" className="relative py-28 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelDownload className="w-4 h-4 text-coral" />
          <span>Latest Release v1.2.1 • 100% Free</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-heading font-black text-espresso dark:text-cream tracking-tight">
          Ready to Adopt Your Pal?
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-espresso-muted dark:text-cocoa-muted font-sans max-w-lg mx-auto leading-relaxed">
          Free and open-source forever. No credit cards, no logins, no subscriptions. Download in 5 seconds and meet your companion.
        </p>
      </div>

      {/* Download Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Card 1: Portable Standalone (Most Popular) */}
        <div className="retro-card-light dark:retro-card-dark p-8 sm:p-10 flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-arcade px-3 py-1 rounded-full bg-coral text-white border-2 border-espresso font-bold shadow-xs">
                MOST POPULAR
              </span>
              <span className="text-xs font-pixel font-bold text-espresso-muted dark:text-cocoa-muted">
                Windows 10 / 11 (64-bit)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-coral/20 text-coral border-2 border-espresso">
                <PixelZap className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-espresso dark:text-cream">
                Portable Version
              </h3>
            </div>

            <p className="text-base text-espresso-muted dark:text-cocoa-muted mb-8 leading-relaxed font-sans">
              Just a single portable file. No installation wizard required. Simply download, double-click, and your pal appears immediately!
            </p>

            <ul className="space-y-3.5 text-sm font-pixel text-espresso dark:text-cream mb-8">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Zero installation or administrator rights needed</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Runs from desktop, Downloads, or any USB drive</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Saves preferences and favorite buddy automatically</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="retro-btn bg-coral hover:bg-coral-light text-white py-4 text-base font-pixel font-bold shadow-pixel-lg hover:shadow-pixel-xl transition-all"
          >
            <PixelDownload className="w-5 h-5" />
            <span>Download Portable (.exe)</span>
          </a>
        </div>

        {/* Card 2: Windows Setup Installer */}
        <div className="retro-card-light dark:retro-card-dark p-8 sm:p-10 flex flex-col justify-between relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-arcade px-3 py-1 rounded-full bg-honey text-espresso border-2 border-espresso font-bold shadow-xs">
                STANDARD SETUP
              </span>
              <span className="text-xs font-pixel font-bold text-espresso-muted dark:text-cocoa-muted">
                Windows 10 / 11 (64-bit)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-honey/20 text-espresso dark:text-honey border-2 border-espresso">
                <PixelSparkle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-espresso dark:text-cream">
                Setup Installer
              </h3>
            </div>

            <p className="text-base text-espresso-muted dark:text-cocoa-muted mb-8 leading-relaxed font-sans">
              Traditional setup wizard that places a cute icon on your desktop and Start Menu, with optional launch on boot.
            </p>

            <ul className="space-y-3.5 text-sm font-pixel text-espresso dark:text-cream mb-8">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Adds Start Menu & Desktop shortcuts</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Optional 'Launch with Windows' feature</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded bg-mint text-espresso border border-espresso">
                  <PixelCheck className="w-3.5 h-3.5" />
                </div>
                <span>Clean 1-click uninstaller in Windows Settings</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="retro-btn bg-honey hover:bg-honey-light text-espresso py-4 text-base font-pixel font-bold shadow-pixel-lg hover:shadow-pixel-xl transition-all"
          >
            <PixelDownload className="w-5 h-5" />
            <span>Download Installer (.exe)</span>
          </a>
        </div>
      </div>

      {/* GitHub Open Source Note */}
      <div className="mt-12 text-center text-sm font-pixel text-espresso-muted dark:text-cocoa-muted flex items-center justify-center gap-2">
        <PixelGithub className="w-4 h-4 text-espresso dark:text-cream" />
        <span>100% Free & Open Source on GitHub.</span>
        <a
          href="https://github.com/1-Pankaj/Pixel-Pals"
          target="_blank"
          rel="noreferrer"
          className="text-coral hover:underline font-bold"
        >
          View Source Repository
        </a>
      </div>
    </section>
  );
}
