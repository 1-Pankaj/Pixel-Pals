import React, { useState, useEffect } from 'react';
import { Github, Download, Star, Menu, X, Sparkles } from 'lucide-react';
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
        className={`w-full max-w-5xl flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'bg-[#0e0f1a]/80 backdrop-blur-xl border-[#2a2d48] shadow-2xl shadow-black/50'
            : 'bg-[#121320]/60 backdrop-blur-md border-[#222438]'
        }`}
      >
        {/* Logo & Brand */}
        <a
          href="#"
          onClick={playClick}
          className="flex items-center gap-3 group"
        >
          <img
            src="./icon.png"
            alt="Pixel Pals"
            className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform"
          />
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xl tracking-wider text-white group-hover:text-peach transition-colors">
              Pixel Pals
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-peach/15 text-peach border border-peach/20">
              v1.2.1
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-subtext">
          <a
            href="#playground"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Playground
          </a>
          <a
            href="#pals"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            The Pals
          </a>
          <a
            href="#features"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#shortcuts"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            Shortcuts
          </a>
          <a
            href="#faq"
            onClick={playClick}
            className="hover:text-white transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="flex items-center gap-2 text-xs font-mono bg-[#18192a] hover:bg-[#22243d] text-[#cdd6f4] px-3.5 py-2 rounded-xl border border-card-border hover:border-peach/40 transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <span className="flex items-center gap-1 bg-peach/15 text-peach px-1.5 py-0.2 rounded text-[10px]">
              <Star className="w-2.5 h-2.5 fill-peach" />
              <span>Star</span>
            </span>
          </a>

          <a
            href="#download"
            onClick={() => { playClick(); PET_SFX.fanfare(); }}
            className="flex items-center gap-1.5 text-xs font-mono font-bold bg-gradient-to-r from-peach to-gold text-[#11111b] px-4 py-2 rounded-xl shadow-lg shadow-peach/20 hover:shadow-peach/40 hover:scale-105 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get Free</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-subtext hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-20 left-4 right-4 bg-[#121320] border border-card-border p-5 rounded-2xl shadow-2xl flex flex-col gap-4 text-center">
          <a
            href="#playground"
            onClick={() => setMobileMenuOpen(false)}
            className="text-subtext hover:text-white py-1"
          >
            Playground
          </a>
          <a
            href="#pals"
            onClick={() => setMobileMenuOpen(false)}
            className="text-subtext hover:text-white py-1"
          >
            The Pals
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-subtext hover:text-white py-1"
          >
            Features
          </a>
          <a
            href="#shortcuts"
            onClick={() => setMobileMenuOpen(false)}
            className="text-subtext hover:text-white py-1"
          >
            Shortcuts
          </a>
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-peach text-[#11111b] py-2.5 rounded-xl font-bold font-mono text-sm mt-2"
          >
            Download Free (.exe)
          </a>
        </div>
      )}
    </header>
  );
}
