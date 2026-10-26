import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsTicker } from './components/StatsTicker';
import { PalsShowcase } from './components/PalsShowcase';
import { DialogueMarquee } from './components/DialogueMarquee';
import { BentoFeatures } from './components/BentoFeatures';
import { KeyboardDeck } from './components/KeyboardDeck';
import { DownloadSection } from './components/DownloadSection';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';

export function App() {
  const [selectedPet, setSelectedPet] = useState('mochi');

  return (
    <div className="min-h-screen bg-[#090a10] text-[#cdd6f4] relative selection:bg-peach selection:text-[#11111b]">
      <Navbar />
      <main>
        <Hero onSelectPet={setSelectedPet} />
        <StatsTicker />
        <PalsShowcase onAdopt={setSelectedPet} />
        <DialogueMarquee />
        <BentoFeatures />
        <KeyboardDeck />
        <DownloadSection />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}

export default App;
