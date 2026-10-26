import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PixelHeart, PixelShield, PixelWind, PixelMusic, PixelEye, PixelCheck, PixelSparkle } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';

export function ParallaxFeatures() {
  // 4-4-4 Breathing State
  const [breathePhase, setBreathePhase] = useState('Inhale...');
  const [breatheCount, setBreatheCount] = useState(4);

  useEffect(() => {
    const phases = [
      { name: 'Inhale...', duration: 4 },
      { name: 'Hold...', duration: 4 },
      { name: 'Exhale...', duration: 4 },
    ];
    let currentIdx = 0;
    let timer = 4;

    const interval = setInterval(() => {
      timer -= 1;
      if (timer <= 0) {
        currentIdx = (currentIdx + 1) % phases.length;
        timer = phases[currentIdx].duration;
        setBreathePhase(phases[currentIdx].name);
      }
      setBreatheCount(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animalese Voice Demo State
  const [testText, setTestText] = useState('Hello buddy!');
  const handleTestVoice = () => {
    PET_SFX.unlock();
    const chars = testText.toLowerCase();
    for (let i = 0; i < chars.length; i++) {
      setTimeout(() => {
        PET_SFX.blip(chars[i]);
      }, i * 75);
    }
  };

  // Eye Tracker State
  const eyeCardRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  const handleEyeMove = (e) => {
    if (!eyeCardRef.current) return;
    const rect = eyeCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxOffset = 8;
    const angle = Math.atan2(y, x);
    const dist = Math.min(maxOffset, Math.hypot(x, y) / 12);
    setPupilOffset({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
    });
  };

  const [clickCount, setClickCount] = useState(0);

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-honey text-espresso text-sm font-pixel font-bold mb-4 border-2 border-espresso shadow-pixel">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Crafted for Joyful Desktops</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight">
          A Little Friend That Fits Your Life
        </h2>
        <p className="mt-4 text-xl text-espresso-muted dark:text-[#dfd2c0] font-sans leading-relaxed">
          Designed from the ground up to never annoy you, never block your work, and always bring a gentle smile to your face.
        </p>
      </div>

      {/* Feature Story 1: Click Pass-Through (Large Interactive Panel) */}
      <div className="retro-card p-8 sm:p-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-coral text-white font-pixel font-bold text-xs mb-4 border-2 border-espresso shadow-xs">
            <PixelShield className="w-4 h-4" />
            <span>Never In Your Way</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Click Straight Through Empty Space
          </h3>
          <p className="text-lg text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-6">
            Your pal floats peacefully above your browser, games, or notes. But whenever you click on empty space around them, your mouse clicks pass straight through!
          </p>
          <p className="text-base text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-6">
            You can write essays, click YouTube links, or code projects right under your buddy without ever having to minimize or close their window.
          </p>
          <div className="flex items-center gap-3 text-sm font-pixel text-mint font-bold">
            <div className="w-3 h-3 rounded-full bg-mint animate-pulse" />
            <span>Zero window blocking • Always stays gently on top</span>
          </div>
        </div>

        {/* Live Interactive Pass-Through Demo Canvas */}
        <div className="lg:w-1/2 w-full p-8 rounded-3xl retro-surface flex flex-col items-center justify-center text-center relative overflow-hidden border-3 border-espresso">
          <div className="w-20 h-20 rounded-2xl bg-honey/20 border-2 border-honey flex items-center justify-center text-4xl mb-4 shadow-inner animate-float-slow">
            🐱
          </div>
          <span className="font-pixel text-xs text-espresso-muted dark:text-[#cfbea9] mb-4">
            (The buddy is floating above this interactive target button!)
          </span>
          <button
            onClick={() => {
              PET_SFX.unlock();
              PET_SFX.pop();
              setClickCount((c) => c + 1);
            }}
            className="retro-btn bg-mint text-espresso px-6 py-3.5 text-sm font-pixel font-bold shadow-pixel-lg hover:shadow-pixel-xl"
          >
            <PixelCheck className="w-4 h-4" />
            <span>Click Me Through The Buddy! ({clickCount} clicks)</span>
          </button>
        </div>
      </div>

      {/* Feature Story 2: 4-4-4 Calm Box Breathing Ring */}
      <div className="retro-card p-8 sm:p-12 mb-12 flex flex-col lg:flex-row-reverse items-center justify-between gap-10">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky text-espresso font-pixel font-bold text-xs mb-4 border-2 border-espresso shadow-xs">
            <PixelWind className="w-4 h-4" />
            <span>Calm Reset</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            A Peaceful 4-Second Breathing Circle
          </h3>
          <p className="text-lg text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-6">
            When study sessions get stressful or work deadlines feel intense, right-click your pet to start a soothing 4-4-4 box breathing rhythm.
          </p>
          <p className="text-base text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed">
            The gentle circle expands and contracts smoothly, accompanied by soft synthesized chimes to help you center yourself in under one minute.
          </p>
        </div>

        {/* Live Animated Breathing Widget */}
        <div className="lg:w-1/2 w-full p-8 rounded-3xl retro-surface flex flex-col items-center justify-center text-center border-3 border-espresso">
          <div className="relative w-44 h-44 flex items-center justify-center my-4">
            <motion.div
              animate={{
                scale: breathePhase.startsWith('Inhale') ? [1, 1.35] : breathePhase.startsWith('Hold') ? 1.35 : [1.35, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-sky/30 border-4 border-sky shadow-lg"
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-pixel font-bold text-2xl">
                {breathePhase}
              </span>
              <span className="font-arcade text-sm text-sky font-bold mt-1">
                {breatheCount}s
              </span>
            </div>
          </div>
          <span className="font-pixel text-xs text-espresso-muted dark:text-[#cfbea9]">
            Inhale for 4s • Hold for 4s • Exhale for 4s
          </span>
        </div>
      </div>

      {/* Feature Story 3: Playful Animalese Voice Chatter */}
      <div className="retro-card p-8 sm:p-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-honey text-espresso font-pixel font-bold text-xs mb-4 border-2 border-espresso shadow-xs">
            <PixelMusic className="w-4 h-4" />
            <span>Cozy Voices</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Cute Animalese Chatter & Jokes
          </h3>
          <p className="text-lg text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-6">
            Instead of boring static popups, your buddy speaks in cheerful Nintendo Animal Crossing-style retro babbles that match their species!
          </p>
          <p className="text-base text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed">
            With over 2,500 hand-written quotes, knock-knock jokes, friendly water reminders, and positive affirmations, they always have something sweet to share.
          </p>
        </div>

        {/* Live Animalese Speech Synthesizer Demo */}
        <div className="lg:w-1/2 w-full p-8 rounded-3xl retro-surface flex flex-col items-center justify-center border-3 border-espresso space-y-4">
          <div className="w-full">
            <label className="font-pixel text-xs font-bold text-espresso-muted dark:text-[#cfbea9] mb-2 block">
              Type anything to hear your pal say it in Animalese:
            </label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#fffdf8] dark:bg-[#1f1712] border-2 border-espresso font-dialogue text-2xl tracking-wide focus:outline-none"
            />
          </div>

          <button
            onClick={handleTestVoice}
            className="retro-btn w-full bg-honey hover:bg-honey-light text-espresso py-3.5 text-sm font-pixel font-bold shadow-pixel"
          >
            <PixelMusic className="w-4 h-4" />
            <span>Play Animalese Voice ♪</span>
          </button>
        </div>
      </div>

      {/* Feature Story 4: Eyes That Follow Mouse Cursor */}
      <div className="retro-card p-8 sm:p-12 flex flex-col lg:flex-row-reverse items-center justify-between gap-10">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-mint text-espresso font-pixel font-bold text-xs mb-4 border-2 border-espresso shadow-xs">
            <PixelEye className="w-4 h-4" />
            <span>Gaze Tracking</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Eyes That Follow You Across Screens
          </h3>
          <p className="text-lg text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-6">
            Wherever you move your mouse cursor, your companion’s pupils follow along smoothly! Whether you have one laptop screen or three massive monitors, they never lose sight of you.
          </p>
          <p className="text-base text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed">
            Move your mouse cursor around the interactive eye laboratory on the right to test it out!
          </p>
        </div>

        {/* Live Eye Tracking Demo */}
        <div
          ref={eyeCardRef}
          onMouseMove={handleEyeMove}
          className="lg:w-1/2 w-full p-8 rounded-3xl retro-surface flex flex-col items-center justify-center border-3 border-espresso cursor-crosshair"
        >
          <div className="w-full h-36 flex items-center justify-center gap-8 my-2">
            {/* Left Eye */}
            <div className="w-16 h-18 bg-white rounded-full border-3 border-espresso relative overflow-hidden flex items-center justify-center shadow-inner">
              <div
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
                className="w-7 h-8 bg-espresso rounded-full relative"
              >
                <div className="w-2 h-2 bg-white rounded-full absolute top-1.5 left-1.5" />
              </div>
            </div>

            {/* Right Eye */}
            <div className="w-16 h-18 bg-white rounded-full border-3 border-espresso relative overflow-hidden flex items-center justify-center shadow-inner">
              <div
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
                className="w-7 h-8 bg-espresso rounded-full relative"
              >
                <div className="w-2 h-2 bg-white rounded-full absolute top-1.5 left-1.5" />
              </div>
            </div>
          </div>
          <span className="font-pixel text-xs text-espresso-muted dark:text-[#cfbea9] mt-3">
            Move cursor here • Pupils track your position in real-time
          </span>
        </div>
      </div>
    </section>
  );
}
