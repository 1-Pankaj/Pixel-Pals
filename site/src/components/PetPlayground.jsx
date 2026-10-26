import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { Heart, Cookie, Music, Sparkles, MessageCircleHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PALS_INFO = [
  { id: 'mochi', name: 'Mochi', color: '#ff7a59', badge: '🐱 Orange Cat' },
  { id: 'biscuit', name: 'Biscuit', color: '#facc15', badge: '🐶 Shiba Dog' },
  { id: 'pudding', name: 'Pudding', color: '#4ade80', badge: '🟢 Mint Slime' },
  { id: 'luna', name: 'Luna', color: '#c084fc', badge: '👻 Sweet Ghost' },
  { id: 'clover', name: 'Clover', color: '#f472b6', badge: '🐰 Soft Bunny' },
  { id: 'miso', name: 'Miso', color: '#fb7185', badge: '🩷 Axolotl' }
];

export function PetPlayground({ selectedPet = 'mochi', onSelectPet }) {
  const canvasRef = useRef(null);
  const [currentPet, setCurrentPet] = useState(selectedPet);
  const [speech, setSpeech] = useState("Hi friend! Poke me to cuddle, or drop a snack!");
  const [choices, setChoices] = useState(null);
  const [heartCount, setHeartCount] = useState(0);

  useEffect(() => {
    if (selectedPet && selectedPet !== currentPet) {
      setCurrentPet(selectedPet);
    }
  }, [selectedPet]);

  const stateRef = useRef({
    petId: currentPet,
    cursor: { x: 140, y: 120 },
    squash: { sx: 1, sy: 1, vsx: 0, vsy: 0 },
    petUntil: 0,
    danceUntil: 0,
    particles: [],
    snack: null,
    hopY: 0,
    hopVy: 0
  });

  stateRef.current.petId = currentPet;

  const spawnParticles = useCallback((type, count = 5) => {
    const p = stateRef.current.particles;
    for (let i = 0; i < count; i++) {
      p.push({
        type,
        x: 140 + (Math.random() - 0.5) * 60,
        y: 190 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 80,
        vy: -60 - Math.random() * 80,
        life: 0.9 + Math.random() * 0.4,
        age: 0,
        size: 1 + Math.random() * 0.6
      });
    }
  }, []);

  // Razor-sharp Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastT = performance.now();

    // Force pixelated rendering
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) ctx.webkitImageSmoothingEnabled = false;
    if (ctx.mozImageSmoothingEnabled !== undefined) ctx.mozImageSmoothingEnabled = false;

    const loop = (t) => {
      const dt = Math.min(0.04, (t - lastT) / 1000);
      lastT = t;

      ctx.clearRect(0, 0, 280, 280);

      // Keep pixel smoothing disabled every frame
      ctx.imageSmoothingEnabled = false;

      const st = stateRef.current;
      const pet = PIXEL_PALS.build(st.petId);

      // Spring squash physics
      const k = 170, d = 13;
      const ax = -k * (st.squash.sx - 1) - d * st.squash.vsx;
      const ay = -k * (st.squash.sy - 1) - d * st.squash.vsy;
      st.squash.vsx += ax * dt;
      st.squash.vsy += ay * dt;
      st.squash.sx += st.squash.vsx * dt;
      st.squash.sy += st.squash.vsy * dt;

      // Hop physics
      if (st.hopVy !== 0 || st.hopY > 0) {
        st.hopY += st.hopVy * dt;
        st.hopVy -= 480 * dt;
        if (st.hopY <= 0) {
          st.hopY = 0;
          st.hopVy = 0;
          st.squash.vsy -= 0.15;
        }
      }

      // Snack logic
      if (st.snack) {
        st.snack.vy += 340 * dt;
        st.snack.y += st.snack.vy * dt;
        if (st.snack.y >= 200) {
          st.snack.bites--;
          spawnParticles('crumb', 3);
          PET_SFX.munch();
          st.squash.vsy -= 0.12;
          if (st.snack.bites <= 0) {
            st.snack = null;
            spawnParticles('heart', 6);
            setSpeech("Munch munch munch! Best snack ever!");
          } else {
            st.snack.y = 196;
          }
        }
      }

      // Eye tracking
      const dx = (st.cursor.x - 140) * 0.045;
      const dy = (st.cursor.y - 190) * 0.045;

      const isHappy = t < st.petUntil || t < st.danceUntil;
      const isDancing = t < st.danceUntil;

      // Soft ground shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      const shadowW = 54 * (1 - Math.min(0.6, st.hopY / 100));
      ctx.ellipse(140, 252, shadowW, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render Pet (scaled crisply by 6x)
      ctx.save();
      const danceRotate = isDancing ? Math.sin(t * 0.016) * 0.12 : 0;
      ctx.translate(140, 248 - st.hopY);
      ctx.rotate(danceRotate);
      ctx.scale(st.squash.sx * 5.8, st.squash.sy * 5.8);
      ctx.translate(-16, -30);

      pet.draw(ctx, {
        face: isHappy ? 'happy' : (Math.sin(t * 0.002) > 0.95 ? 'blink' : 'open'),
        mouth: isHappy ? 'open' : 'idle',
        tail: Math.floor(t * 0.0035) % 2,
        sprout: Math.floor(t * 0.001) % 2,
        dx: dx,
        dy: dy + (pet.meta.float ? Math.sin(t * 0.004) * 0.5 : 0)
      });
      ctx.restore();

      // Draw snack if falling
      if (st.snack) {
        ctx.save();
        ctx.translate(st.snack.x, st.snack.y);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 9 * (st.snack.bites / 3), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-2, -2, 2, 2);
        ctx.fillRect(1, 2, 2, 2);
        ctx.restore();
      }

      // Draw particle effects
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.age += dt;
        if (p.age >= p.life) { st.particles.splice(i, 1); continue; }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = Math.max(0, 1 - p.age / p.life);

        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.type === 'heart') {
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText('♥', p.x, p.y);
        } else if (p.type === 'note') {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('♪', p.x, p.y);
        } else if (p.type === 'crumb') {
          ctx.fillStyle = '#d97706';
          ctx.fillRect(p.x, p.y, 4, 4);
        } else if (p.type === 'star') {
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('★', p.x, p.y);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    stateRef.current.cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePet = () => {
    PET_SFX.unlock();
    PET_SFX.boop();
    PET_SFX.purr();
    setHeartCount((c) => c + 1);
    stateRef.current.squash.vsy += 0.25;
    stateRef.current.squash.vsx -= 0.18;
    stateRef.current.petUntil = performance.now() + 1400;
    spawnParticles('heart', 6);

    const friendlyMessages = [
      "Purrrrrr! You give the best head pats! ♥",
      "Hehehe! That tickles! Keep going!",
      "I love sitting with you while you work!",
      "Squish! Secret cuddle mode activated!",
      "You are my favorite human today!"
    ];
    setSpeech(friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)]);
  };

  const handleFeed = () => {
    PET_SFX.unlock();
    PET_SFX.pop();
    stateRef.current.snack = { x: 140, y: 20, vy: 40, bites: 3 };
    setSpeech("Yay! A tasty cookie! Thank you for feeding me!");
  };

  const handleDance = () => {
    PET_SFX.unlock();
    PET_SFX.dance();
    stateRef.current.danceUntil = performance.now() + 2600;
    stateRef.current.hopVy = 200;
    spawnParticles('note', 8);
    setSpeech("Dance party! Wiggle wiggle bounce!");
  };

  const handleAsk = () => {
    PET_SFX.unlock();
    PET_SFX.ask();
    setSpeech("Quick question: Cats or dogs?");
    setChoices([
      { label: "Cats! 🐱", reply: "Purrfect choice! Napping champions!" },
      { label: "Dogs! 🐶", reply: "Woof! 100% loyal and full of zoomies!" },
      { label: "Both! ✨", reply: "YES! The ultimate cute combo!" }
    ]);
  };

  const answerChoice = (reply) => {
    PET_SFX.unlock();
    PET_SFX.sparkle();
    setSpeech(reply);
    setChoices(null);
    stateRef.current.petUntil = performance.now() + 1400;
    spawnParticles('star', 7);
  };

  const switchPal = (id) => {
    PET_SFX.unlock();
    PET_SFX.click();
    PET_SFX.chime();
    setCurrentPet(id);
    if (onSelectPet) onSelectPet(id);
    stateRef.current.hopVy = 160;
    spawnParticles('star', 5);
    const palNames = { mochi: 'Mochi', biscuit: 'Biscuit', pudding: 'Pudding', luna: 'Luna', clover: 'Clover', miso: 'Miso' };
    setSpeech(`Hello! I'm ${palNames[id]}! Let's be best friends.`);
    setChoices(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center bg-gradient-to-b from-[#13141f] to-[#0a0a0f] border border-[#27273a] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-pink-500/10 max-w-md w-full mx-auto"
    >
      {/* Decorative top bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#222233]">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400/80 shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/80 shadow-sm" />
          <span className="ml-2 font-heading font-bold text-sm text-white tracking-wide">
            Interactive Pet Stage
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
          <Heart className="w-3 h-3 fill-pink-400" />
          <span>{heartCount} Pets</span>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="relative z-10 w-full mt-4 mb-2">
        <motion.div
          key={speech}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1b1c2e] border border-pink-500/30 text-white rounded-2xl p-4 text-center shadow-xl shadow-black/40"
        >
          <p className="font-sans font-medium text-base text-zinc-100">{speech}</p>
          {choices && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => answerChoice(c.reply)}
                  className="text-xs sm:text-sm font-semibold bg-pink-500 hover:bg-pink-400 text-black px-4 py-1.5 rounded-full transition shadow hover:scale-105 active:scale-95"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <div className="w-4 h-4 bg-[#1b1c2e] border-r border-b border-pink-500/30 transform rotate-45 mx-auto -mt-2" />
      </div>

      {/* Razor-Sharp Pixel Canvas */}
      <div className="relative flex justify-center items-center my-2 select-none">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onClick={handlePet}
          style={{ imageRendering: 'pixelated' }}
          className="cursor-pointer hover:scale-105 transition-transform duration-200"
          title="Click to pet!"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2.5 w-full mt-3">
        <button
          onClick={handlePet}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181926] hover:bg-[#25263a] border border-[#2e2f47] hover:border-pink-500 transition-all group"
        >
          <Heart className="w-5 h-5 text-pink-400 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-zinc-300 mt-1">Pet</span>
        </button>

        <button
          onClick={handleFeed}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181926] hover:bg-[#25263a] border border-[#2e2f47] hover:border-amber-400 transition-all group"
        >
          <Cookie className="w-5 h-5 text-amber-400 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-zinc-300 mt-1">Snack</span>
        </button>

        <button
          onClick={handleDance}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181926] hover:bg-[#25263a] border border-[#2e2f47] hover:border-sky-400 transition-all group"
        >
          <Music className="w-5 h-5 text-sky-400 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-zinc-300 mt-1">Dance</span>
        </button>

        <button
          onClick={handleAsk}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181926] hover:bg-[#25263a] border border-[#2e2f47] hover:border-purple-400 transition-all group"
        >
          <MessageCircleHeart className="w-5 h-5 text-purple-400 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-semibold text-zinc-300 mt-1">Talk</span>
        </button>
      </div>

      {/* Switch Pal Dock */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-[#222233] w-full">
        {PALS_INFO.map((p) => (
          <button
            key={p.id}
            onClick={() => switchPal(p.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentPet === p.id
                ? 'bg-white text-black font-bold shadow-lg scale-105'
                : 'bg-[#181926] text-zinc-400 hover:text-white hover:bg-[#242538]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
