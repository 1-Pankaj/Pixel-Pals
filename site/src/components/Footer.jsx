import React from 'react';
import { Github, Heart, MessageSquare } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function Footer() {
  const playClick = () => {
    PET_SFX.unlock();
    PET_SFX.click();
  };

  return (
    <footer className="relative border-t border-zinc-800 bg-[#050508] py-16 px-4 text-zinc-400 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <img src="./icon.png" alt="Pixel Pals" className="w-8 h-8 rounded-lg" />
            <span className="font-heading font-black text-2xl text-white">Pixel Pals</span>
            <span className="text-xs bg-pink-500/15 text-pink-400 px-3 py-1 rounded-full border border-pink-500/25 font-bold">
              100% Free • MIT
            </span>
          </div>
          <p className="text-zinc-400 text-base font-normal max-w-md">
            An adorable pixelated companion that lives on top of your windows. No AI, zero accounts, just pure friendship.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 text-base font-semibold">
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/releases"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Releases (.exe)
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/discussions"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Discussions
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Contributing
          </a>
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            License
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <span>© 2026 Pixel Pals Contributors. Open-source under the MIT License.</span>
        <span>Fonts: Pixelify Sans & Press Start 2P (SIL Open Font License 1.1)</span>
      </div>
    </footer>
  );
}
