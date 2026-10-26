import React, { useState, useEffect, useRef } from 'react';
import { PixelEye, PixelWind, PixelClock, PixelSparkle, PixelShield, PixelMusic, PixelCheck } from './PixelIcons';
import { PET_SFX } from '../lib/sounds';
import { motion } from 'framer-motion';

function SpotlightCard({ children, className = "" }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`retro-card relative overflow-hidden ${className}`}
    >
      {/* Aceternity Spotlight Radial Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 215, 110, 0.12), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export function BentoFeatures() {
  const [breathePhase, setBreathePhase] = useState('Inhale');
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

  const [testText, setTestText] = useState('Pixel Pals');

  const handleTestVoice = () => {
    PET_SFX.unlock();
    const chars = testText.toLowerCase();
    for (let i = 0; i < chars.length; i++) {
      setTimeout(() => {
        PET_SFX.blip(chars[i]);
      }, i * 75);
    }
  };

  const eyeCardRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  const handleEyeMove = (e) => {
    if (!eyeCardRef.current) return;
    const rect = eyeCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxOffset = 6;
    const angle = Math.atan2(y, x);
    const dist = Math.min(maxOffset, Math.hypot(x, y) / 10);
    setPupilOffset({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
    });
  };

  return (
    <section id="features" className="relative py-28 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Aceternity Card Spotlight Bento</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-espresso dark:text-[#fff8f0] tracking-tight">
          Everything You'll Love
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-[#cfbea9] font-sans max-w-xl mx-auto leading-relaxed">
          Hover over each spotlight card to explore interactive physics, breathing circles, and voice synthesis.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Click Pass-Through (Wide 2-Columns) */}
        <SpotlightCard className="md:col-span-2 p-8 sm:p-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-coral text-white border-2 border-espresso shadow-xs">
                <PixelShield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold">
                  Never in Your Way
                </h3>
                <span className="text-sm font-pixel font-bold text-coral">
                  Transparent Click Pass-Through
                </span>
              </div>
            </div>
            <p className="text-base sm:text-lg text-espresso-muted dark:text-[#cfbea9] leading-relaxed mb-6 font-sans">
              Your pal floats above your browser or code editor, but empty space around them lets your mouse clicks pass straight through! You can type notes or click buttons underneath them without interruption.
            </p>
          </div>

          <div className="p-5 rounded-2xl retro-surface flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-mint animate-pulse border border-espresso/30" />
              <span className="text-sm font-pixel font-bold">
                Click-through active: Click the button behind the buddy!
              </span>
            </div>
            <button
              onClick={() => { PET_SFX.unlock(); PET_SFX.pop(); }}
              className="retro-btn bg-mint text-espresso px-4 py-2 text-xs font-pixel font-bold"
            >
              <PixelCheck className="w-4 h-4" />
              <span>Test Click Target</span>
            </button>
          </div>
        </SpotlightCard>

        {/* Card 2: 4-4-4 Calm Breathing Companion */}
        <SpotlightCard className="p-8 text-center items-center">
          <div className="flex flex-col items-center">
            <div className="inline-flex p-3 rounded-2xl bg-sky text-espresso border-2 border-espresso mb-4 shadow-xs">
              <PixelWind className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-1">
              Calm Breathing Circle
            </h3>
            <p className="text-sm text-espresso-muted dark:text-[#cfbea9] mb-4 font-sans">
              A peaceful 4-second box-breathing rhythm to reset your stress when work gets hectic.
            </p>
          </div>

          {/* Animated Pulsing Ring */}
          <div className="my-3 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: breathePhase.startsWith('Inhale') ? [1, 1.35] : breathePhase.startsWith('Hold') ? 1.35 : [1.35, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-sky/30 border-3 border-sky"
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-pixel font-bold text-lg">
                  {breathePhase}
                </span>
                <span className="font-arcade text-xs text-sky font-bold">
                  {breatheCount}s
                </span>
              </div>
            </div>
          </div>

          <span className="text-xs font-pixel text-espresso-muted dark:text-[#cfbea9]">
            Right-click pet anytime → "Breathe with Pal"
          </span>
        </SpotlightCard>

        {/* Card 3: Animalese Speech Synthesizer */}
        <SpotlightCard className="p-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-honey text-espresso border-2 border-espresso shadow-xs">
                <PixelMusic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">
                  Animalese Chatter
                </h3>
                <span className="text-xs font-pixel font-bold text-honey">
                  Live WebAudio Synthesizer
                </span>
              </div>
            </div>
            <p className="text-sm text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-4">
              Instead of bulky audio files, each letter is synthesized in real-time as a playful Animal Crossing-style retro babble!
            </p>
          </div>

          <div className="p-4 rounded-2xl retro-surface space-y-3">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type anything..."
              className="w-full px-3 py-2 rounded-xl bg-cream-light dark:bg-cocoa-canvas border-2 border-espresso font-dialogue text-xl tracking-wide focus:outline-none"
            />
            <button
              onClick={handleTestVoice}
              className="retro-btn w-full bg-honey hover:bg-honey-light text-espresso py-2 text-xs font-pixel font-bold"
            >
              <span>Play Animalese Voice ♪</span>
            </button>
          </div>
        </SpotlightCard>

        {/* Card 4: Interactive Eye Follower */}
        <div
          ref={eyeCardRef}
          onMouseMove={handleEyeMove}
          className="retro-card p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-mint text-espresso border-2 border-espresso shadow-xs">
                <PixelEye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">
                  Eyes That Follow
                </h3>
                <span className="text-xs font-pixel font-bold text-mint">
                  Interactive Gaze Tracking
                </span>
              </div>
            </div>
            <p className="text-sm text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-4">
              Move your mouse around this card. Your buddy’s pupils track your movement smoothly across the screen!
            </p>
          </div>

          {/* Interactive Mini Eye Face */}
          <div className="w-full h-28 flex items-center justify-center gap-6 retro-surface">
            {/* Left Eye */}
            <div className="w-12 h-14 bg-white rounded-full border-3 border-espresso relative overflow-hidden flex items-center justify-center shadow-inner">
              <div
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out'
                }}
                className="w-5 h-6 bg-espresso rounded-full relative"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1" />
              </div>
            </div>

            {/* Right Eye */}
            <div className="w-12 h-14 bg-white rounded-full border-3 border-espresso relative overflow-hidden flex items-center justify-center shadow-inner">
              <div
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out'
                }}
                className="w-5 h-6 bg-espresso rounded-full relative"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Lightweight 12MB Footprint */}
        <SpotlightCard className="p-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-lavender text-espresso border-2 border-espresso shadow-xs">
                <PixelClock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">
                  0% CPU When Idle
                </h3>
                <span className="text-xs font-pixel font-bold text-lavender">
                  12MB Ultra-Lightweight
                </span>
              </div>
            </div>
            <p className="text-sm text-espresso-muted dark:text-[#cfbea9] font-sans leading-relaxed mb-4">
              Written from the ground up for zero performance overhead. Won't spin your laptop fans or slow down competitive games.
            </p>
          </div>

          <div className="p-4 rounded-2xl retro-surface space-y-2 text-xs font-pixel">
            <div className="flex justify-between">
              <span>Memory Usage</span>
              <span className="text-mint font-bold">~12 MB RAM</span>
            </div>
            <div className="flex justify-between">
              <span>Internet Needed</span>
              <span className="text-mint font-bold">0 KB (100% Offline)</span>
            </div>
            <div className="flex justify-between">
              <span>Battery Impact</span>
              <span className="text-mint font-bold">Negligible</span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
