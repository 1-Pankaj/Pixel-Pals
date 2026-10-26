import React, { useState, useEffect } from 'react';
import { Github, Download, Star, Menu, X, Heart } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const playClick = () => {
    PET_SFX.unlock();
    PET_SFX.click();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pb-2 transition-all duration-300">
      <nav
        className={`w-full max-w-5xl flex items-center justify-between px-6 py-3.5 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-zinc-800 shadow-2xl shadow-black/80'
            : 'bg-[#0a0a0f]/70 backdrop-blur-md border-[#1f2030]'
        }`}
      >
        {/* Brand */}
        <a
          href="#"
          onClick={playClick}
          className="flex items-center gap-3 group select-none"
        >
          <img
            src="./icon.png"
            alt="Pixel Pals"
            className="w-9 h-9 rounded-xl group-hover:scale-110 transition-transform shadow-md"
          />
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl text-white tracking-tight">
              Pixel Pals
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/25">
              v1.2.1
            </span>
          </div>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-base font-semibold text-zinc-300">
          <a
            href="#playground"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Playground
          </a>
          <a
            href="#pals"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            The Buddies
          </a>
          <a
            href="#features"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#shortcuts"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            Shortcuts
          </a>
          <a
            href="#faq"
            onClick={playClick}
            className="hover:text-pink-400 transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="flex items-center gap-2 text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 transition"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="#download"
            onClick={() => { playClick(); PET_SFX.fanfare(); }}
            className="flex items-center gap-2 text-sm font-bold bg-pink-500 hover:bg-pink-400 text-black px-5 py-2.5 rounded-xl shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
            <span>Get Free</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-20 left-4 right-4 bg-[#0a0a0f] border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col gap-4 text-center">
          <a
            href="#playground"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-zinc-300 hover:text-white py-1"
          >
            Playground
          </a>
          <a
            href="#pals"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-zinc-300 hover:text-white py-1"
          >
            The Buddies
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-zinc-300 hover:text-white py-1"
          >
            Features
          </a>
          <a
            href="#shortcuts"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-zinc-300 hover:text-white py-1"
          >
            Shortcuts
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-zinc-300 hover:text-white py-1"
          >
            FAQ
          </a>
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-pink-500 text-black py-3 rounded-2xl font-bold text-base mt-2"
          >
            Download Free (.exe)
          </a>
        </div>
      )}
    </header>
  );
}
