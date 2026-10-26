import React from 'react';
import confetti from 'canvas-confetti';
import { Download, Sparkles, Check, Package, Zap, Github } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function DownloadSection() {
  const triggerConfetti = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#fab387', '#f9e2af', '#a6e3a1', '#89b4fa', '#f5c2e7']
    });
  };

  return (
    <section id="download" className="relative py-24 px-4 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-peach/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/30 text-peach text-xs font-mono mb-3">
          <Download className="w-3.5 h-3.5" />
          <span>v1.2.1 Live Release</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-pixel font-bold text-white tracking-wide">
          Ready to Adopt a Buddy?
        </h2>
        <p className="mt-3 text-subtext text-sm sm:text-base font-sans">
          Pixel Pals is 100% free and open-source. Download for Windows 10/11 or inspect the source code on GitHub.
        </p>
      </div>

      {/* Two Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Card 1: Portable (.exe) */}
        <div className="bg-[#121320] border border-card-border hover:border-peach/50 transition-all duration-300 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-peach/15 text-peach border border-peach/25 font-bold">
                Easiest • Recommended
              </span>
              <span className="text-xs font-mono text-subtext">Windows 64-bit</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-peach" />
              <h3 className="font-pixel text-2xl font-bold text-white">Portable Edition</h3>
            </div>

            <p className="text-sm font-sans text-subtext/90 mb-6 leading-relaxed">
              One standalone executable. No installation, no admin privileges required. Download and run immediately from any folder.
            </p>

            <ul className="space-y-2.5 text-xs font-mono text-subtext mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>Zero installation footprint</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>Runs straight from downloads or USB drive</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>State & settings persist cleanly in app data</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-peach hover:bg-gold text-[#11111b] font-mono font-bold text-sm transition shadow-lg shadow-peach/20 hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download Portable (.exe)</span>
          </a>
        </div>

        {/* Card 2: Full Installer */}
        <div className="bg-[#121320] border border-card-border hover:border-gold/50 transition-all duration-300 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/25 font-bold">
                Standard Setup
              </span>
              <span className="text-xs font-mono text-subtext">NSIS Installer</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-gold" />
              <h3 className="font-pixel text-2xl font-bold text-white">Full Installer</h3>
            </div>

            <p className="text-sm font-sans text-subtext/90 mb-6 leading-relaxed">
              Standard Windows setup with desktop shortcuts, Start Menu integration, and easy autostart with Windows toggle.
            </p>

            <ul className="space-y-2.5 text-xs font-mono text-subtext mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>Start Menu and Desktop shortcuts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>Optional automatic boot with Windows</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-mint" />
                <span>Clean Windows uninstall support</span>
              </li>
            </ul>
          </div>

          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases/latest"
            target="_blank"
            rel="noreferrer"
            onClick={triggerConfetti}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1e2038] hover:bg-[#282a48] text-white border border-card-border hover:border-gold/40 font-mono font-bold text-sm transition shadow-lg hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>Download Installer (.exe)</span>
          </a>
        </div>
      </div>

      {/* Source Code Note */}
      <div className="mt-8 text-center text-xs font-mono text-subtext/70 relative z-10 flex items-center justify-center gap-2">
        <Github className="w-3.5 h-3.5" />
        <span>Prefer building from source?</span>
        <a
          href="https://github.com/1-Pankaj/Pixel-Pals"
          target="_blank"
          rel="noreferrer"
          className="text-peach underline hover:text-white"
        >
          View GitHub Repository
        </a>
      </div>
    </section>
  );
}
