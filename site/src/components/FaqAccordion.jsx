import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PET_SFX } from '../lib/sounds';

const FAQS = [
  {
    q: "Will the pet get in the way of my work or gaming?",
    a: "Not at all. The pet window uses forward mouse-event pass-through (`setIgnoreMouseEvents(true, { forward: true })`). Clicks fall through everywhere except directly on the sprite and active choice buttons. You can click on code, links, and documents directly behind the pet without interruption."
  },
  {
    q: "Is it safe and privacy-friendly?",
    a: "100%. Pixel Pals is completely open-source under the MIT license with zero cloud analytics, zero tracking, and zero account logins. All state is stored in a clean local JSON file on your machine."
  },
  {
    q: "Does eye tracking work with multiple monitors?",
    a: "Yes! Eye tracking polls the system cursor coordinates globally across all connected displays, so your buddy tracks your cursor even when you are working on a secondary screen."
  },
  {
    q: "How can I add custom messages or design a new pet?",
    a: "Adding messages is as simple as editing `src/messages-*.js`—each category is a plain array, and anti-repeat shuffle bags handle the rest. To add a new pet, define a 16-pixel left half in `src/sprites.js` and register it. See our CONTRIBUTING.md for full instructions."
  },
  {
    q: "Can I run it on macOS or Linux?",
    a: "Yes! While the pre-built binaries on our Releases page are for Windows, Pixel Pals is built with Electron and runs smoothly on macOS and Linux from source using `npm install && npm start`."
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
    <section id="faq" className="relative py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/30 text-peach text-xs font-mono mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-pixel font-bold text-white tracking-wide">
          Common Questions
        </h2>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#121320] border-peach/40 shadow-lg'
                  : 'bg-[#0f101c] border-card-border hover:border-card-border/90'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left select-none"
              >
                <span className="font-pixel text-base sm:text-lg text-white font-bold tracking-wide">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-peach flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-subtext text-sm font-sans leading-relaxed border-t border-card-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
