import React, { useState } from 'react';
import { ThemeProvider } from './lib/theme';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsTicker } from './components/StatsTicker';
import { PalsShowcase } from './components/PalsShowcase';
import { DialogueMarquee } from './components/DialogueMarquee';
import { BentoFeatures } from './components/BentoFeatures';
import { KeyboardDeck } from './components/KeyboardDeck';
import { DailyRoutine } from './components/DailyRoutine';
import { LoveLetters } from './components/LoveLetters';
import { DownloadSection } from './components/DownloadSection';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';

function MainContent() {
  const [selectedPet, setSelectedPet] = useState('mochi');

  return (
    <div className="min-h-screen bg-cream dark:bg-cocoa-bg text-espresso dark:text-cream relative transition-colors duration-300">
      {/* Subtle Retro Dot Pattern Background */}
      <div className="fixed inset-0 pointer-events-none bg-retro-dots-light dark:bg-retro-dots-dark z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero onSelectPet={setSelectedPet} />
          <StatsTicker />
          <PalsShowcase onAdopt={setSelectedPet} />
          <DialogueMarquee />
          <BentoFeatures />
          <KeyboardDeck />
          <DailyRoutine />
          <LoveLetters />
          <DownloadSection />
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
