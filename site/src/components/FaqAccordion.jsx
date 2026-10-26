import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: "Will the pet get in the way of what I'm doing?",
    a: "Nope! The pet floats peacefully above everything, but your mouse clicks pass right through empty space. You can click on websites, write essays, or play games right behind the pet without anything getting blocked."
  },
  {
    q: "Is it completely free?",
    a: "Yes, 100% free and open-source. There are no paid tiers, no advertisements, no subscriptions, and no hidden accounts to sign up for."
  },
  {
    q: "Will it slow down my computer?",
    a: "Not at all. Pixel Pals is built with lightweight, hand-crafted pixel art and a custom sound engine that uses near 0% CPU when resting. It runs smoothly on any laptop or desktop."
  },
  {
    q: "Can I turn off the sound or make it quieter?",
    a: "Yes! Right-clicking your pet or clicking its icon in the bottom-right taskbar tray lets you toggle sound effects, random chatter, or sleep mode anytime you want quiet focus."
  },
  {
    q: "Does it work if I have two or more screens?",
    a: "Yes! Your pet's eyes will follow your mouse cursor smoothly across all of your monitors."
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
    <section id="faq" className="relative py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3">
          <HelpCircle className="w-4 h-4 text-pink-400" />
          <span>Help & Answers</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#121320] border-pink-500/40 shadow-xl'
                  : 'bg-[#0b0c14] border-[#1f2030] hover:border-zinc-700'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left select-none"
              >
                <span className="font-heading text-xl sm:text-2xl text-white font-bold tracking-tight">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-pink-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-zinc-300 text-base sm:text-lg font-sans leading-relaxed border-t border-[#1f2030] pt-4">
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
