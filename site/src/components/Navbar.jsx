import React, { useState, useEffect } from 'react';
import { useTheme } from '../lib/theme';
import { PET_SFX } from '../lib/sounds';
import {
  PixelGithub,
  PixelDownload,
  PixelSun,
  PixelMoon,
  PixelVolume,
  PixelVolumeMute,
  PixelMenu,
  PixelClose,
  PixelHeart
} from './PixelIcons';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme, soundMuted, toggleSound } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const playClick = () => {
    PET_SFX.unlock();
    PET_SFX.click();
  };

  const navLinks = [
    { name: 'Playground', href: '#playground' },
    { name: 'Meet Buddies', href: '#pals' },
    { name: 'Features', href: '#features' },
    { name: 'Keys', href: '#shortcuts' },
    { name: 'Daily Routine', href: '#routine' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 pb-2 transition-all duration-300">
      <nav
        className={`w-full max-w-6xl flex items-center justify-between px-5 sm:px-7 py-3 rounded-2xl border-3 border-espresso transition-all duration-300 select-none ${
          scrolled
            ? 'bg-cream-light/95 dark:bg-cocoa-canvas/95 backdrop-blur-md shadow-pixel-lg'
            : 'bg-cream-light/80 dark:bg-cocoa-card/85 backdrop-blur-sm shadow-pixel'
        }`}
      >
        {/* Brand & Traffic Dots */}
        <a
          href="#"
          onClick={playClick}
          className="flex items-center gap-3 group"
        >
          {/* Authentic App Traffic Dots */}
          <div className="hidden sm:flex gap-1.5 items-center">
            <span className="w-3 h-3 rounded-full bg-coral inline-block border border-espresso/40" />
            <span className="w-3 h-3 rounded-full bg-honey inline-block border border-espresso/40" />
            <span className="w-3 h-3 rounded-full bg-mint inline-block border border-espresso/40" />
          </div>

          <img
            src="./icon.png"
            alt="Pixel Pals Logo"
            className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform shadow-xs pixelated"
          />

          <div className="flex items-center gap-2">
            <span className="font-arcade text-sm text-espresso dark:text-cream tracking-tight">
              PIXEL PALS
            </span>
            <span className="text-[10px] font-pixel font-bold px-2 py-0.5 rounded-full bg-mint text-espresso border border-espresso">
              v1.2.1
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-pixel font-bold text-espresso-muted dark:text-cocoa-muted">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playClick}
              className="hover:text-espresso dark:hover:text-honey transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Controls & CTA buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-xl bg-cream-surface dark:bg-cocoa-canvas border-2 border-espresso text-espresso dark:text-cream hover:bg-honey transition-colors"
            title={soundMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {soundMuted ? (
              <PixelVolumeMute className="w-4 h-4 text-coral" />
            ) : (
              <PixelVolume className="w-4 h-4 text-mint" />
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-cream-surface dark:bg-cocoa-canvas border-2 border-espresso text-espresso dark:text-cream hover:bg-honey transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <PixelSun className="w-4 h-4 text-honey" />
            ) : (
              <PixelMoon className="w-4 h-4 text-espresso" />
            )}
          </button>

          {/* GitHub Star Link */}
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-pixel font-bold bg-cream-surface dark:bg-cocoa-canvas text-espresso dark:text-cream px-3.5 py-2 rounded-xl border-2 border-espresso hover:border-honey transition"
          >
            <PixelGithub className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          {/* Main Download CTA */}
          <a
            href="#download"
            onClick={() => { playClick(); PET_SFX.fanfare(); }}
            className="retro-btn bg-honey hover:bg-honey-light text-espresso px-4 py-2 text-xs sm:text-sm font-pixel font-bold"
          >
            <PixelDownload className="w-4 h-4" />
            <span>Get Free</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border-2 border-espresso text-espresso dark:text-cream"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <PixelClose className="w-4 h-4" /> : <PixelMenu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-4 right-4 bg-cream-light dark:bg-cocoa-card border-3 border-espresso p-6 rounded-3xl shadow-pixel-xl flex flex-col gap-4 text-center z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => { playClick(); setMobileMenuOpen(false); }}
              className="text-base font-pixel font-bold text-espresso dark:text-cream hover:text-coral py-1"
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://github.com/1-Pankaj/Pixel-Pals"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-pixel font-bold text-espresso dark:text-cream py-1 border-t-2 border-espresso/15 dark:border-cocoa-border pt-3"
          >
            Star on GitHub ★
          </a>
          <a
            href="#download"
            onClick={() => { playClick(); setMobileMenuOpen(false); }}
            className="retro-btn bg-honey text-espresso py-3 rounded-2xl font-pixel font-bold text-base mt-2"
          >
            Download Free (.exe)
          </a>
        </div>
      )}
    </header>
  );
}
