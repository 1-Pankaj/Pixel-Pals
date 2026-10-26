import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { PixelHeart, PixelCookie, PixelMusic, PixelSparkle, PixelMessage, PixelSmile } from './PixelIcons';
import { motion, AnimatePresence } from 'framer-motion';

const PALS_INFO = [
  { id: 'mochi', name: 'Mochi', color: '#ff7a59', badge: '🐱 Orange Cat', mood: 'Wants head scratches' },
  { id: 'biscuit', name: 'Biscuit', color: '#ffd76e', badge: '🐶 Shiba Dog', mood: 'Ready for zoomies' },
  { id: 'pudding', name: 'Pudding', color: '#7ed6a0', badge: '🟢 Mint Slime', mood: 'Feeling extra squishy' },
  { id: 'luna', name: 'Luna', color: '#cbb2fe', badge: '👻 Sweet Ghost', mood: 'Hovering serenely' },
  { id: 'clover', name: 'Clover', color: '#ff6d8a', badge: '🐰 Soft Bunny', mood: 'Sniffing for snacks' },
  { id: 'miso', name: 'Miso', color: '#7ec8ff', badge: '🩷 Axolotl', mood: 'Splashing happily' }
];

const CUTE_LINES = {
  mochi: [
    "Purrrr... you are doing great today!",
    "I saw that bug you fixed. Very majestic.",
    "Nap time is anytime if you believe in yourself.",
    "Poke me again! It tickles my whiskers.",
    "Don't forget to take a sip of water, human!"
  ],
  biscuit: [
    "Woof! Did someone say snack?!",
    "I will guard your taskbar with my life!",
    "Zoomies loading... 99% complete!",
    "Best human ever! 11/10 stars for you!",
    "Wagging my tail at maximum velocity!"
  ],
  pudding: [
    "Boing! I bounce, therefore I am.",
    "Mint flavored thoughts, gelatinous love!",
    "Squelch squelch... squishy hug incoming!",
    "Can you make me bounce higher?",
    "100% organic virtual slime, zero mess!"
  ],
  luna: [
    "Boo! Hehe, did I startle you gently?",
    "I float right over your browser tabs!",
    "No windows can trap a friendly ghost.",
    "Sending calming phantom breezes your way...",
    "Stars are extra cozy tonight."
  ],
  clover: [
    "Twitching my little nose at your screen!",
    "Hop hop hop! Let's get things done!",
    "My ears detect good vibes nearby.",
    "Is that a crunchy cookie I smell?!",
    "Ears up, heart full, ready to hang out!"
  ],
  miso: [
    "Bloop! Waving my tiny pink frills at you!",
    "Under the sea or on your desktop, I'm happy!",
    "Axolotl superpower: infinite cuteness regeneration!",
    "Can we listen to lo-fi beats together?",
    "Warm boba pearls make everything better."
  ]
};

export function PetPlayground({ selectedPet = 'mochi', onSelectPet }) {
  const canvasRef = useRef(null);
  const [currentPet, setCurrentPet] = useState(selectedPet);
  const [speech, setSpeech] = useState("Hi friend! Click me to cuddle, or give me a snack!");
  const [heartCount, setHeartCount] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [zoomScale, setZoomScale] = useState(6); // Integer scale: 6x is ultra-crisp!

  useEffect(() => {
    if (selectedPet && selectedPet !== currentPet) {
      setCurrentPet(selectedPet);
      const lines = CUTE_LINES[selectedPet] || CUTE_LINES.mochi;
      setSpeech(lines[Math.floor(Math.random() * lines.length)]);
    }
  }, [selectedPet]);

  const stateRef = useRef({
    petId: currentPet,
    cursor: { x: 160, y: 150 },
    squash: { sx: 1, sy: 1, vsx: 0, vsy: 0 },
    petUntil: 0,
    danceUntil: 0,
    sleeping: false,
    particles: [],
    snack: null,
    hopY: 0,
    hopVy: 0
  });

  stateRef.current.petId = currentPet;
  stateRef.current.sleeping = isSleeping;

  const spawnParticles = useCallback((type, count = 5) => {
    const p = stateRef.current.particles;
    for (let i = 0; i < count; i++) {
      p.push({
        type,
        x: 160 + (Math.random() - 0.5) * 50,
        y: 190 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 70,
        vy: -50 - Math.random() * 80,
        life: 0.9 + Math.random() * 0.4,
        age: 0,
        size: 1 + Math.random() * 0.5
      });
    }
  }, []);

  // Razor-sharp Canvas Render Loop with Integer Scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastT = performance.now();

    // Disable all browser smoothing for pixel-perfect clarity
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) ctx.webkitImageSmoothingEnabled = false;
    if (ctx.mozImageSmoothingEnabled !== undefined) ctx.mozImageSmoothingEnabled = false;

    const loop = (t) => {
      const dt = Math.min(0.04, (t - lastT) / 1000);
      lastT = t;

      ctx.clearRect(0, 0, 320, 300);
      ctx.imageSmoothingEnabled = false;

      const st = stateRef.current;
      const pet = PIXEL_PALS.build(st.petId);

      // Spring squash & stretch physics
      const k = 180, d = 14;
      const ax = -k * (st.squash.sx - 1) - d * st.squash.vsx;
      const ay = -k * (st.squash.sy - 1) - d * st.squash.vsy;
      st.squash.vsx += ax * dt;
      st.squash.vsy += ay * dt;
      st.squash.sx += st.squash.vsx * dt;
      st.squash.sy += st.squash.vsy * dt;

      // Hop physics
      if (st.hopVy !== 0 || st.hopY > 0) {
        st.hopY += st.hopVy * dt;
        st.hopVy -= 500 * dt;
        if (st.hopY <= 0) {
          st.hopY = 0;
          st.hopVy = 0;
          st.squash.vsy -= 0.18;
        }
      }

      // Snack physics & eating
      if (st.snack) {
        st.snack.vy += 380 * dt;
        st.snack.y += st.snack.vy * dt;
        if (st.snack.y >= 210) {
          st.snack.bites--;
          spawnParticles('crumb', 4);
          PET_SFX.munch();
          st.squash.vsy -= 0.15;
          if (st.snack.bites <= 0) {
            st.snack = null;
            spawnParticles('heart', 6);
            const lines = [
              "Om nom nom! That was delicious! ✨",
              "Crispy cookie power restored! 🍪",
              "You are the best snack provider ever!"
            ];
            setSpeech(lines[Math.floor(Math.random() * lines.length)]);
          } else {
            st.snack.y = 205;
          }
        }
      }

      // Eye tracking toward mouse
      const dx = (st.cursor.x - 160) * 0.04;
      const dy = (st.cursor.y - 190) * 0.04;

      const isHappy = t < st.petUntil || t < st.danceUntil;
      const isDancing = t < st.danceUntil;

      // Ground shadow (drawn as a cute retro ellipse)
      ctx.save();
      ctx.fillStyle = 'rgba(58, 43, 32, 0.22)';
      ctx.beginPath();
      const shadowW = Math.max(20, 56 * (1 - Math.min(0.6, st.hopY / 120)));
      ctx.ellipse(160, 260, shadowW, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render Pet with STRICT INTEGER SCALE
      ctx.save();
      const danceRotate = isDancing ? Math.sin(t * 0.018) * 0.12 : 0;
      const baseY = Math.round(256 - st.hopY);
      ctx.translate(160, baseY);
      ctx.rotate(danceRotate);

      // Integer scaling with squash
      ctx.scale(st.squash.sx * zoomScale, st.squash.sy * zoomScale);
      ctx.translate(-16, -30);

      let face = 'open';
      if (st.sleeping) {
        face = 'blink';
      } else if (isHappy) {
        face = 'happy';
      } else if (Math.sin(t * 0.002) > 0.94) {
        face = 'blink';
      }

      pet.draw(ctx, {
        face,
        mouth: isHappy ? 'open' : (st.sleeping ? 'idle' : 'idle'),
        tail: Math.floor(t * 0.0035) % 2,
        sprout: Math.floor(t * 0.001) % 2,
        dx: st.sleeping ? 0 : dx,
        dy: st.sleeping ? 1 : dy + (pet.meta.float ? Math.sin(t * 0.004) * 0.5 : 0)
      });
      ctx.restore();

      // Snack rendering
      if (st.snack) {
        ctx.save();
        ctx.translate(Math.round(st.snack.x), Math.round(st.snack.y));
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, 0, 10 * (st.snack.bites / 3), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2, -3, 3, 3);
        ctx.fillRect(2, 2, 3, 3);
        ctx.restore();
      }

      // Sleeping Zzz generator
      if (st.sleeping && Math.random() < 0.03) {
        p.push({
          type: 'zzz',
          x: 160 + (Math.random() - 0.5) * 20,
          y: 190,
          vx: 15 + Math.random() * 15,
          vy: -35 - Math.random() * 20,
          life: 1.4,
          age: 0,
          size: 14 + Math.random() * 6
        });
      }

      // Draw particle effects
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const part = st.particles[i];
        part.age += dt;
        if (part.age >= part.life) {
          st.particles.splice(i, 1);
          continue;
        }

        part.x += part.vx * dt;
        part.y += part.vy * dt;
        const alpha = Math.max(0, 1 - part.age / part.life);

        ctx.save();
        ctx.globalAlpha = alpha;
        if (part.type === 'heart') {
          ctx.fillStyle = '#ff6d8a';
          ctx.font = 'bold 20px "Press Start 2P", monospace';
          ctx.fillText('♥', part.x, part.y);
        } else if (part.type === 'note') {
          ctx.fillStyle = '#ffd76e';
          ctx.font = 'bold 20px "Press Start 2P", monospace';
          ctx.fillText('♪', part.x, part.y);
        } else if (part.type === 'crumb') {
          ctx.fillStyle = '#b0793f';
          ctx.fillRect(Math.round(part.x), Math.round(part.y), 4, 4);
        } else if (part.type === 'star') {
          ctx.fillStyle = '#ffd76e';
          ctx.font = 'bold 18px "Press Start 2P", monospace';
          ctx.fillText('★', part.x, part.y);
        } else if (part.type === 'zzz') {
          ctx.fillStyle = '#cbb2fe';
          ctx.font = `bold ${Math.round(part.size)}px "VT323", monospace`;
          ctx.fillText('Zzz', part.x, part.y);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentPet, zoomScale, isSleeping, spawnParticles]);

  // Mouse Movement on Playground Stage
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    stateRef.current.cursor = { x, y };
  };

  // Actions
  const handlePet = () => {
    PET_SFX.unlock();
    PET_SFX.purr();
    setIsSleeping(false);
    stateRef.current.petUntil = performance.now() + 1400;
    stateRef.current.squash.vsy = -0.32;
    stateRef.current.squash.vsx = 0.28;
    setHeartCount(h => h + 1);
    spawnParticles('heart', 6);

    const lines = [
      "Purrr... you are the warmest human ever!",
      "Head scratches! 100% happiness unlocked!",
      "I love sitting with you while you work!",
      "Maximum purr frequency achieved!"
    ];
    setSpeech(lines[Math.floor(Math.random() * lines.length)]);
  };

  const handleFeed = () => {
    PET_SFX.unlock();
    PET_SFX.boop();
    setIsSleeping(false);
    stateRef.current.snack = { x: 160, y: 30, vy: 60, bites: 3 };
    stateRef.current.hopVy = 160;
    setSpeech("Gasp! A snack?! Watch this catch!");
  };

  const handleDance = () => {
    PET_SFX.unlock();
    PET_SFX.dance();
    setIsSleeping(false);
    stateRef.current.danceUntil = performance.now() + 2400;
    stateRef.current.hopVy = 260;
    stateRef.current.squash.vsx = -0.25;
    spawnParticles('note', 8);
    setSpeech("Party mode activated! Look at my tiny victory wiggles!");
  };

  const handleTalk = () => {
    PET_SFX.unlock();
    setIsSleeping(false);
    const lines = CUTE_LINES[currentPet] || CUTE_LINES.mochi;
    const text = lines[Math.floor(Math.random() * lines.length)];
    setSpeech(text);

    // Speak with Animalese blips
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length && i < 24) {
        PET_SFX.blip(text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    stateRef.current.hopVy = 120;
    stateRef.current.squash.vsy = -0.2;
    spawnParticles('star', 4);
  };

  const handleNap = () => {
    PET_SFX.unlock();
    const next = !isSleeping;
    setIsSleeping(next);
    if (next) {
      PET_SFX.chime();
      setSpeech("Zzz... waking up when you need a buddy...");
    } else {
      PET_SFX.pop();
      setSpeech("I am awake and ready to hang out!");
    }
  };

  const changePet = (id) => {
    PET_SFX.unlock();
    PET_SFX.boing();
    setCurrentPet(id);
    if (onSelectPet) onSelectPet(id);
  };

  const activeInfo = PALS_INFO.find(p => p.id === currentPet) || PALS_INFO[0];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Interactive Stage Card */}
      <div className="w-full retro-card-light dark:retro-card-dark p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">
        {/* Retro Header Bar inside Card */}
        <div className="w-full flex items-center justify-between border-b-2 border-espresso/15 dark:border-cocoa-border pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-coral inline-block border border-espresso/30" />
              <span className="w-3.5 h-3.5 rounded-full bg-honey inline-block border border-espresso/30" />
              <span className="w-3.5 h-3.5 rounded-full bg-mint inline-block border border-espresso/30" />
            </div>
            <span className="font-pixel font-bold text-lg text-espresso dark:text-cream">
              Live Desktop Simulation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-honey/20 border border-honey/40 text-espresso dark:text-cream text-xs font-arcade">
              <span className="text-coral">♥</span> {heartCount} Cuddles
            </div>

            {/* Zoom selector (Integer Scaling Guarantee) */}
            <div className="hidden sm:flex items-center gap-1 bg-cream-surface dark:bg-cocoa-canvas p-1 rounded-lg border border-espresso/20 dark:border-cocoa-border">
              {[5, 6, 7].map(s => (
                <button
                  key={s}
                  onClick={() => setZoomScale(s)}
                  className={`text-xs px-2 py-0.5 rounded font-pixel font-bold transition ${
                    zoomScale === s 
                      ? 'bg-honey text-espresso shadow-xs' 
                      : 'text-espresso-muted dark:text-cocoa-muted hover:text-espresso dark:hover:text-cream'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pet Switcher Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          {PALS_INFO.map(pal => {
            const isActive = pal.id === currentPet;
            return (
              <button
                key={pal.id}
                onClick={() => changePet(pal.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-pixel font-bold text-sm transition-all duration-150 border-2 select-none ${
                  isActive
                    ? 'bg-honey text-espresso border-espresso shadow-pixel scale-105'
                    : 'bg-cream-surface dark:bg-cocoa-card text-espresso-muted dark:text-cocoa-muted border-espresso/20 dark:border-cocoa-border hover:border-espresso dark:hover:border-honey hover:text-espresso dark:hover:text-cream'
                }`}
              >
                <span>{pal.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Central Speech Bubble (Modeled exactly after the App's speech balloon) */}
        <div className="relative mb-3 z-10 max-w-lg w-full flex justify-center">
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-cream-light dark:bg-cocoa-card border-3 border-espresso dark:border-honey rounded-2xl px-6 py-3.5 shadow-pixel-soft dark:shadow-pixel-dark text-center relative max-w-md"
          >
            <p className="font-dialogue text-2xl sm:text-3xl text-espresso dark:text-cream leading-tight tracking-wide">
              {speech}
            </p>
            {/* Pointer arrow */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-cream-light dark:bg-cocoa-card border-r-3 border-b-3 border-espresso dark:border-honey rotate-45" />
          </motion.div>
        </div>

        {/* Canvas Display Area */}
        <div
          onMouseMove={handleMouseMove}
          onClick={handlePet}
          className="relative w-full max-w-sm h-72 sm:h-80 flex items-center justify-center cursor-pointer select-none rounded-2xl bg-gradient-to-b from-cream-surface/50 to-cream/20 dark:from-cocoa-canvas dark:to-cocoa-card/50 border-2 border-dashed border-espresso/20 dark:border-cocoa-border hover:border-honey transition-colors group"
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={300}
            className="pixelated w-full h-full object-contain pointer-events-none"
          />

          {/* Hover hint */}
          <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="font-pixel text-xs bg-espresso/80 text-cream px-3 py-1 rounded-full backdrop-blur-sm">
              Click to pet • Move cursor to guide eyes
            </span>
          </div>
        </div>

        {/* Interactive Action Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-xl mt-6">
          <button
            onClick={handlePet}
            className="retro-btn bg-coral hover:bg-coral-light text-white py-3 px-3 text-sm font-pixel"
            title="Pet your buddy"
          >
            <PixelHeart className="w-4 h-4" />
            <span>Pet Buddy</span>
          </button>

          <button
            onClick={handleFeed}
            className="retro-btn bg-honey hover:bg-honey-light text-espresso py-3 px-3 text-sm font-pixel"
            title="Feed a tasty snack"
          >
            <PixelCookie className="w-4 h-4" />
            <span>Snack</span>
          </button>

          <button
            onClick={handleDance}
            className="retro-btn bg-mint hover:bg-mint-light text-espresso py-3 px-3 text-sm font-pixel"
            title="Play dance music"
          >
            <PixelMusic className="w-4 h-4" />
            <span>Dance</span>
          </button>

          <button
            onClick={handleTalk}
            className="retro-btn bg-sky hover:bg-sky-light text-espresso py-3 px-3 text-sm font-pixel"
            title="Chat with Animalese voice"
          >
            <PixelMessage className="w-4 h-4" />
            <span>Talk</span>
          </button>

          <button
            onClick={handleNap}
            className={`retro-btn col-span-2 sm:col-span-1 py-3 px-3 text-sm font-pixel transition-all ${
              isSleeping 
                ? 'bg-lavender text-espresso' 
                : 'bg-cream-surface dark:bg-cocoa-card text-espresso dark:text-cream border-espresso dark:border-cocoa-border'
            }`}
            title="Toggle nap mode"
          >
            <PixelSmile className="w-4 h-4" />
            <span>{isSleeping ? 'Wake Up' : 'Take Nap'}</span>
          </button>
        </div>

        {/* Pet Meta Tagline */}
        <div className="mt-6 flex items-center gap-2 text-sm font-pixel text-espresso-muted dark:text-cocoa-muted">
          <span>Current companion:</span>
          <span className="font-bold text-espresso dark:text-honey">{activeInfo.badge}</span>
          <span>•</span>
          <span>Mood: {activeInfo.mood}</span>
        </div>
      </div>
    </div>
  );
}
