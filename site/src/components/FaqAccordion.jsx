import React, { useState } from 'react';
import { PixelChevronDown, PixelSparkle } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: "Will the pet get in the way of what I'm doing?",
    a: "Not at all! Your pal floats quietly on top of windows, but your mouse clicks pass straight through empty space. You can write essays, browse articles, or click buttons right underneath them without anything getting blocked."
  },
  {
    q: "Is Pixel Pals really 100% free?",
    a: "Yes, completely free and open-source forever. There are no paid subscriptions, no advertisements, no premium skins to buy, and no user accounts to create."
  },
  {
    q: "Will it slow down my computer or battery?",
    a: "No! Pixel Pals was built with hand-crafted retro pixel art and an ultra-lightweight sound chip. It uses only around 12 MB of RAM and drops to near 0% CPU usage whenever it's idling."
  },
  {
    q: "Can I quiet the sound or turn off random chatter?",
    a: "Yes! Right-clicking your pet or opening the menu lets you mute sounds, silence speech bubbles, or put your buddy into peaceful Sleep Mode whenever you need 100% quiet focus."
  },
  {
    q: "Does it work if I use multiple monitors?",
    a: "Yes! You can drag your pal to any display, and their eyes will smoothly track your mouse cursor across all connected screens."
  },
  {
    q: "How do I feed or play mini-games with my buddy?",
    a: "You can click on them directly, use the simple right-click menu, or press global keyboard shortcuts like Alt+Shift+F (drop snack), Alt+Shift+D (dance party), or Alt+Shift+R (rock paper scissors)!"
  }
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    PET_SFX.unlock();
    PET_SFX.click();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-28 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Simple Answers</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-heading font-black text-espresso dark:text-cream tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-lg text-espresso-muted dark:text-cocoa-muted font-sans">
          Everything you might want to know in plain human language.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border-3 border-espresso transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-cream-light dark:bg-cocoa-card shadow-pixel'
                  : 'bg-cream-surface/50 dark:bg-cocoa-canvas/60 hover:bg-cream-surface'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left select-none gap-4"
              >
                <span className="font-heading text-xl sm:text-2xl text-espresso dark:text-cream font-bold tracking-tight">
                  {faq.q}
                </span>
                <div
                  className={`p-2 rounded-xl bg-honey/20 border-2 border-espresso text-espresso dark:text-cream shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-honey' : ''
                  }`}
                >
                  <PixelChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-espresso-muted dark:text-cocoa-muted text-base sm:text-lg font-sans leading-relaxed border-t-2 border-espresso/10 dark:border-cocoa-border pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
