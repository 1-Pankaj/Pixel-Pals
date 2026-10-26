import React, { useState } from 'react';
import { ThemeProvider } from './lib/theme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsTicker } from './components/StatsTicker';
import { DesktopCompareSlider } from './components/DesktopCompareSlider';
import { PalsShowcase } from './components/PalsShowcase';
import { DialogueMarquee } from './components/DialogueMarquee';
import { BentoFeatures } from './components/BentoFeatures';
import { TamagotchiPocket } from './components/TamagotchiPocket';
import { KeyboardDeck } from './components/KeyboardDeck';
import { DailyRoutine } from './components/DailyRoutine';
import { SoundJukebox } from './components/SoundJukebox';
import { LoveLetters } from './components/LoveLetters';
import { DownloadSection } from './components/DownloadSection';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';

function MainContent() {
  const [selectedPet, setSelectedPet] = useState('mochi');

  return (
    <div className="min-h-screen bg-[#fcf6ee] dark:bg-[#17120e] text-[#2a1d15] dark:text-[#fff8f0] relative transition-colors duration-300">
      {/* Ambient Top Glow to eliminate empty black void */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,215,110,0.15),transparent_70%)] z-0" />

      {/* Subtle Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-retro-dots-light dark:bg-retro-dots-dark z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* 1. Hero with Aceternity Lamp + Desktop Playground Stage + Spring Dock */}
          <Hero onSelectPet={setSelectedPet} />

          {/* 2. High-Contrast Stats Counters */}
          <StatsTicker />

          {/* 3. Skiper UI Interactive Before / After Split Slider */}
          <DesktopCompareSlider />

          {/* 4. 6-Companion 3D Perspective Tilt Showcase */}
          <PalsShowcase onAdopt={setSelectedPet} />

          {/* 5. Infinite Dialogue Marquee */}
          <DialogueMarquee />

          {/* 6. Aceternity Spotlight Bento Grid */}
          <BentoFeatures />

          {/* 7. Interactive Handheld Tamagotchi Keychain */}
          <TamagotchiPocket />

          {/* 8. 3D Mechanical Keycaps Deck */}
          <KeyboardDeck />

          {/* 9. A Day With Your Pal Timeline */}
          <DailyRoutine />

          {/* 10. WebAudio Soundboard & Equalizer Jukebox */}
          <SoundJukebox />

          {/* 11. Community Love Letters Sticky Wall */}
          <LoveLetters />

          {/* 12. Confetti Download Station */}
          <DownloadSection />

          {/* 13. Human FAQ Accordion */}
          <FaqAccordion />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export default App;
