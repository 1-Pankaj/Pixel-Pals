import React from 'react';
import { PixelGithub, PixelHeart } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

export function Footer() {
  const playClick = () => {
    PET_SFX.unlock();
    PET_SFX.click();
  };

  return (
    <footer className="relative border-t-3 border-espresso bg-cream-surface/60 dark:bg-cocoa-canvas py-16 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <img src="./icon.png" alt="Pixel Pals Logo" className="w-8 h-8 rounded-lg pixelated shadow-xs" />
            <span className="font-arcade text-base text-espresso dark:text-cream">Pixel Pals</span>
            <span className="text-xs font-pixel font-bold bg-honey text-espresso px-2.5 py-0.5 rounded-full border border-espresso">
              MIT License
            </span>
          </div>
          <p className="text-espresso-muted dark:text-cocoa-muted text-base font-sans max-w-md">
            An adorable pixelated desktop companion that lives on top of your windows. Zero telemetry, zero accounts, pure retro comfort.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-pixel font-bold text-espresso dark:text-cream">
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            Releases (.exe)
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/discussions"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            Discussions
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            Contributing
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/CREDITS.md"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            Credits
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-coral transition-colors"
          >
            License
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t-2 border-espresso/15 dark:border-cocoa-border flex flex-col sm:flex-row items-center justify-between text-xs font-pixel text-espresso-muted dark:text-cocoa-muted gap-3">
        <span>© 2026 Pixel Pals Contributors. Open-source under the MIT License.</span>
        <span className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <PixelHeart className="w-3.5 h-3.5 text-coral" />
          <span>for cozy desks everywhere.</span>
        </span>
      </div>
    </footer>
  );
}
