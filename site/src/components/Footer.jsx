import React from 'react';
import { Github, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function Footer() {
  const playClick = () => {
    PET_SFX.unlock();
    PET_SFX.click();
  };

  return (
    <footer className="relative border-t border-card-border/80 bg-[#07080e] py-14 px-4 text-subtext text-xs font-mono">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <img src="./icon.png" alt="Pixel Pals" className="w-6 h-6 rounded" />
            <span className="font-pixel text-lg text-white font-bold">Pixel Pals</span>
            <span className="text-[10px] bg-peach/15 text-peach px-2 py-0.5 rounded border border-peach/20">
              MIT License
            </span>
          </div>
          <p className="text-subtext/70 text-xs font-sans max-w-sm">
            A cozy pixelated desktop companion living on top of your windows. No AI, zero accounts, pure retro warmth.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs">
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            GitHub Repo
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Releases (.exe)
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/discussions"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Discussions
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Contributing
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            MIT License
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-card-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-subtext/60 gap-3">
        <span>© 2026 Pixel Pals Contributors. Open-source software.</span>
        <span>Fonts: Pixelify Sans, Press Start 2P & VT323 (SIL Open Font License 1.1)</span>
      </div>
    </footer>
  );
}
