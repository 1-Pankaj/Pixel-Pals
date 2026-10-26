import React from 'react';
import confetti from 'canvas-confetti';
import { Download, Sparkles, Check, Zap, Package, Github, Heart } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function DownloadSection() {
  const triggerConfetti = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#f472b6', '#fb923c', '#facc15', '#38bdf8', '#c084fc']
    });
  };

  return (
    <section id="download" className="relative py-28 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3">
          <Download className="w-4 h-4 text-pink-400" />
          <span>Latest Release v1.2.1</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-heading font-black text-white tracking-tight">
          Ready for Your New Friend?
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-zinc-300 font-sans max-w-lg mx-auto leading-relaxed">
          Pixel Pals is completely free and open-source. Download now and start smiling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Card 1: Portable */}
        <div className="bg-gradient-to-b from-[#131422] to-[#0a0a10] border border-pink-500/40 hover:border-pink-400 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-pink-500 text-black">
                Most Popular
              </span>
              <span className="text-sm font-medium text-zinc-400">Windows 10 / 11</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-7 h-7 text-pink-400" />
              <h3 className="font-heading text-3xl font-bold text-white">Portable Version</h3>
            </div>

            <p className="text-base text-zinc-300 mb-8 leading-relaxed">
              Just one file. No installer, no permissions required. Simply download and double-click to play!
            </p>

            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Zero installation needed</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Works on any USB stick or folder</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Your pet choices and settings save automatically</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-black font-heading font-black text-lg transition shadow-xl shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            <span>Download Portable (.exe)</span>
          </a>
        </div>

        {/* Card 2: Installer */}
        <div className="bg-gradient-to-b from-[#131422] to-[#0a0a10] border border-[#272738] hover:border-amber-400/50 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-zinc-800 text-zinc-300">
                Setup Wizard
              </span>
              <span className="text-sm font-medium text-zinc-400">Windows Installer</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Package className="w-7 h-7 text-amber-400" />
              <h3 className="font-heading text-3xl font-bold text-white">Full Installer</h3>
            </div>

            <p className="text-base text-zinc-300 mb-8 leading-relaxed">
              Standard Windows installation with desktop shortcuts and automatic startup options.
            </p>

            <ul className="space-y-3 text-sm text-zinc-300 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Adds Start Menu and Desktop shortcuts</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Optional 'Start with Windows' feature</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Clean uninstaller included</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-heading font-black text-lg transition shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5 text-amber-400" />
            <span>Download Installer (.exe)</span>
          </a>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
        <Github className="w-4 h-4" />
        <span>Free and open source on GitHub.</span>
        <a
          href="https://github.com/1-Pankaj/Pixel-Pals"
          target="_blank"
          rel="noreferrer"
          className="text-pink-400 hover:underline font-semibold"
        >
          View Source Code
        </a>
      </div>
    </section>
  );
}
