import React, { useState } from 'react';
import { PixelSparkle, PixelClock, PixelHeart, PixelCookie, PixelCoffee, PixelMoon } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const ROUTINE_STEPS = [
  {
    time: '08:30 AM',
    title: 'Morning Greeting',
    icon: PixelCoffee,
    color: 'bg-honey text-espresso',
    line: '“Good morning, human! You made it out of bed. That deserves 10/10 gold stars already!”',
    petMood: 'Yawning & stretching tiny paws',
    tip: 'Offers a cozy greeting as soon as your computer wakes up.'
  },
  {
    time: '11:15 AM',
    title: 'Deep Focus Session',
    icon: PixelClock,
    color: 'bg-sky text-espresso',
    line: '“I will sit quietly on your taskbar and watch you crush this task. Zero distractions from me!”',
    petMood: 'Peaceful idle mode, pupils following cursor',
    tip: 'Click-through mode ensures your mouse never gets blocked while coding or studying.'
  },
  {
    time: '02:00 PM',
    title: 'Afternoon Snack Break',
    icon: PixelCookie,
    color: 'bg-coral text-white',
    line: '“Om nom nom! Crunchy cookie energy restored. Did you remember to drink water today?”',
    petMood: 'Munching snacks & bursting heart particles',
    tip: 'Press Alt+Shift+F anytime to drop a treat from the sky.'
  },
  {
    time: '05:30 PM',
    title: 'Workday Victory Lap',
    icon: PixelSparkle,
    color: 'bg-mint text-espresso',
    line: '“Another great day of creating cool things. Look at my victory backflips!”',
    petMood: 'Doing cheerful victory wiggles and dance hops',
    tip: 'Celebrate your completed to-do list with cute synthesized chimes.'
  },
  {
    time: '10:45 PM',
    title: 'Late Night Slumber',
    icon: PixelMoon,
    color: 'bg-lavender text-espresso',
    line: '“Zzz... the screen is glowing warm... I am gently snoozing next to your tabs...”',
    petMood: 'Closed eyes with floating Zzz bubbles',
    tip: 'Quiet night mode softly dims animations so your eyes can rest.'
  }
];

export function DailyRoutine() {
  const [activeStep, setActiveStep] = useState(0);

  const handleSelect = (idx) => {
    PET_SFX.unlock();
    PET_SFX.pop();
    setActiveStep(idx);
  };

  const current = ROUTINE_STEPS[activeStep];
  const Icon = current.icon;

  return (
    <section id="routine" className="relative py-28 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>A Companion For Every Hour</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-espresso dark:text-[#fff8f0] tracking-tight">
          A Day With Your Pal
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-[#cfbea9] font-sans max-w-xl mx-auto leading-relaxed">
          From your first cup of coffee to late-night focus sessions, your buddy quietly shares the day with you.
        </p>
      </div>

      {/* Interactive Timeline Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
        {ROUTINE_STEPS.map((step, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-pixel font-bold text-sm transition-all border-2 select-none ${
                isSelected
                  ? 'bg-honey text-espresso border-espresso shadow-pixel scale-105'
                  : 'bg-cream-surface dark:bg-cocoa-canvas text-espresso dark:text-cream border-espresso/20 hover:border-espresso'
              }`}
            >
              <span>{step.time}</span>
              <span className="hidden sm:inline">• {step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Story Card */}
      <div className="w-full max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="retro-card p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b-2 border-espresso/15 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${current.color} border-2 border-espresso shadow-pixel-soft`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-arcade text-xs text-coral font-bold block">
                      {current.time}
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-espresso dark:text-[#fff8f0]">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-pixel text-espresso-muted dark:text-[#cfbea9] block">Mood</span>
                  <span className="font-pixel font-bold text-sm text-espresso dark:text-honey">{current.petMood}</span>
                </div>
              </div>

              {/* Dialogue Quote Balloon */}
              <div className="p-6 rounded-2xl retro-surface mb-6">
                <p className="font-dialogue text-2xl sm:text-3xl text-espresso dark:text-[#fff8f0] leading-snug">
                  {current.line}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-pixel text-espresso-muted dark:text-[#cfbea9] pt-2">
              <PixelSparkle className="w-4 h-4 text-honey" />
              <span>{current.tip}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
