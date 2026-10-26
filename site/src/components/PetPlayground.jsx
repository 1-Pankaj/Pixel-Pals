import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { Heart, Cookie, Music, HelpCircle, Sparkles } from 'lucide-react';

const PALS = [
  { id: 'mochi', name: 'Mochi', color: '#fab387' },
  { id: 'biscuit', name: 'Biscuit', color: '#f9e2af' },
  { id: 'pudding', name: 'Pudding', color: '#a6e3a1' },
  { id: 'luna', name: 'Luna', color: '#cba6f7' },
  { id: 'clover', name: 'Clover', color: '#f5c2e7' },
  { id: 'miso', name: 'Miso', color: '#eba0ac' }
];

export function PetPlayground({ selectedPet = 'mochi', onSelectPet }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentPet, setCurrentPet] = useState(selectedPet);
  const [speech, setSpeech] = useState("Hi! I'm living right on your desktop.");
  const [choices, setChoices] = useState(null);
  const [isDancing, setIsDancing] = useState(false);

  // Sync with parent prop if provided
  useEffect(() => {
    if (selectedPet && selectedPet !== currentPet) {
      setCurrentPet(selectedPet);
    }
  }, [selectedPet]);

  const stateRef = useRef({
    petId: currentPet,
    cursor: { x: 160, y: 100 },
    squash: { sx: 1, sy: 1, vsx: 0, vsy: 0 },
    petUntil: 0,
    danceUntil: 0,
    particles: [],
    snack: null,
    hopY: 0,
    hopVy: 0
  });

  stateRef.current.petId = currentPet;

  // Add particles
  const spawnParticles = useCallback((type, count = 4) => {
    const p = stateRef.current.particles;
    for (let i = 0; i < count; i++) {
      p.push({
        type,
        x: 160 + (Math.random() - 0.5) * 40,
        y: 220 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 60,
        vy: -50 - Math.random() * 60,
        life: 0.9 + Math.random() * 0.5,
        age: 0,
        size: 1 + Math.random() * 0.6
      });
    }
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastT = performance.now();

    const loop = (t) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      ctx.clearRect(0, 0, 320, 340);

      const st = stateRef.current;
      const pet = PIXEL_PALS.build(st.petId);

      // Spring physics squash/stretch
      const k = 160, d = 14;
      const ax = -k * (st.squash.sx - 1) - d * st.squash.vsx;
      const ay = -k * (st.squash.sy - 1) - d * st.squash.vsy;
      st.squash.vsx += ax * dt;
      st.squash.vsy += ay * dt;
      st.squash.sx += st.squash.vsx * dt;
      st.squash.sy += st.squash.vsy * dt;

      // Hop physics
      if (st.hopVy !== 0 || st.hopY > 0) {
        st.hopY += st.hopVy * dt;
        st.hopVy -= 420 * dt;
        if (st.hopY <= 0) {
          st.hopY = 0;
          st.hopVy = 0;
          st.squash.vsy -= 0.12;
        }
      }

      // Update snack
      if (st.snack) {
        st.snack.vy += 320 * dt;
        st.snack.y += st.snack.vy * dt;
        if (st.snack.y >= 230) {
          st.snack.bites--;
          spawnParticles('crumb', 3);
          PET_SFX.munch();
          st.squash.vsy -= 0.1;
          if (st.snack.bites <= 0) {
            st.snack = null;
            spawnParticles('heart', 5);
            setSpeech("Mmm, so delicious! Thank you!");
          } else {
            st.snack.y = 226;
          }
        }
      }

      // Eye tracking calculation
      const petCenterX = 160;
      const petCenterY = 240;
      const dx = (st.cursor.x - petCenterX) * 0.04;
      const dy = (st.cursor.y - petCenterY) * 0.04;

      const isHappy = t < st.petUntil || t < st.danceUntil;
      const isDancing = t < st.danceUntil;

      // Draw shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath();
      const shadowW = 46 * (1 - Math.min(0.5, st.hopY / 120));
      ctx.ellipse(160, 304, shadowW, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Pet Sprite
      ctx.save();
      const danceBob = isDancing ? Math.sin(t * 0.018) * 8 : 0;
      const danceRotate = isDancing ? Math.sin(t * 0.015) * 0.12 : 0;

      ctx.translate(160, 300 - st.hopY);
      ctx.rotate(danceRotate);
      ctx.scale(st.squash.sx * 5.2, st.squash.sy * 5.2);
      ctx.translate(-16, -30);

      pet.draw(ctx, {
        face: isHappy ? 'happy' : (Math.sin(t * 0.002) > 0.96 ? 'blink' : 'open'),
        mouth: isHappy ? 'open' : 'idle',
        tail: Math.floor(t * 0.003) % 2,
        sprout: Math.floor(t * 0.001) % 2,
        dx: dx,
        dy: dy + (pet.meta.float ? Math.sin(t * 0.004) * 0.5 : 0)
      });
      ctx.restore();

      // Draw Snack if falling
      if (st.snack) {
        ctx.save();
        ctx.translate(st.snack.x, st.snack.y);
        ctx.fillStyle = '#e0a866';
        ctx.beginPath();
        ctx.arc(0, 0, 8 * (st.snack.bites / 3), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7a4a26';
        ctx.fillRect(-2, -2, 2, 2);
        ctx.fillRect(1, 2, 2, 2);
        ctx.restore();
      }

      // Draw Particles (hearts, notes, crumbs)
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.age += dt;
        if (p.age >= p.life) { st.particles.splice(i, 1); continue; }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = 1 - p.age / p.life;

        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        if (p.type === 'heart') {
          ctx.fillStyle = '#ff6d8a';
          ctx.font = '16px monospace';
          ctx.fillText('♥', p.x, p.y);
        } else if (p.type === 'note') {
          ctx.fillStyle = '#ffd76e';
          ctx.font = '16px monospace';
          ctx.fillText('♪', p.x, p.y);
        } else if (p.type === 'crumb') {
          ctx.fillStyle = '#b07a4a';
          ctx.fillRect(p.x, p.y, 3, 3);
        } else if (p.type === 'star') {
          ctx.fillStyle = '#fab387';
          ctx.font = '14px monospace';
          ctx.fillText('★', p.x, p.y);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Track cursor coordinates inside hero
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    stateRef.current.cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Interactions
  const handlePet = () => {
    PET_SFX.unlock();
    PET_SFX.boop();
    PET_SFX.purr();
    stateRef.current.squash.vsy += 0.22;
    stateRef.current.squash.vsx -= 0.15;
    stateRef.current.petUntil = performance.now() + 1200;
    spawnParticles('heart', 6);
    const quips = [
      "Purrrr... that's the spot!",
      "Hehe! Tickles!",
      "I love hanging out with you!",
      "Squish! You unlocked secret love mode."
    ];
    setSpeech(quips[Math.floor(Math.random() * quips.length)]);
  };

  const handleFeed = () => {
    PET_SFX.unlock();
    PET_SFX.pop();
    stateRef.current.snack = { x: 160, y: 30, vy: 40, bites: 3 };
    setSpeech("Ooh, a fresh cookie! Nom nom nom!");
  };

  const handleDance = () => {
    PET_SFX.unlock();
    PET_SFX.dance();
    stateRef.current.danceUntil = performance.now() + 2400;
    stateRef.current.hopVy = 180;
    spawnParticles('note', 8);
    setSpeech("Dance party time! Wiggle wiggle!");
  };

  const handleAsk = () => {
    PET_SFX.unlock();
    PET_SFX.ask();
    setSpeech("Do you prefer cats or dogs?");
    setChoices([
      { label: "Cats!", reply: "Meow! Professional nappers unite! 🐱" },
      { label: "Dogs!", reply: "Woof! 10/10 loyalty and pure zoomies! 🐶" },
      { label: "Both!", reply: "The correct answer! Maximum fluffy joy! ✨" }
    ]);
  };

  const answerChoice = (reply) => {
    PET_SFX.unlock();
    PET_SFX.sparkle();
    setSpeech(reply);
    setChoices(null);
    stateRef.current.petUntil = performance.now() + 1400;
    spawnParticles('star', 6);
  };

  const changePal = (id) => {
    PET_SFX.unlock();
    PET_SFX.click();
    PET_SFX.chime();
    setCurrentPet(id);
    if (onSelectPet) onSelectPet(id);
    stateRef.current.hopVy = 140;
    spawnParticles('sparkle', 4);
    const names = { mochi: 'Mochi', biscuit: 'Biscuit', pudding: 'Pudding', luna: 'Luna', clover: 'Clover', miso: 'Miso' };
    setSpeech(`Hi, I'm ${names[id]}! Ready to keep you company.`);
    setChoices(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center bg-[#121320]/80 backdrop-blur-xl border border-card-border/80 rounded-2xl p-6 shadow-2xl shadow-black/60 max-w-sm w-full mx-auto"
    >
      {/* Window title bar mockup */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-card-border/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs font-mono text-subtext/80 tracking-wide uppercase">
          Live Sandbox • {currentPet.toUpperCase()}
        </span>
        <div className="text-[10px] bg-peach/20 text-peach px-2 py-0.5 rounded-full font-mono">
          Interactive
        </div>
      </div>

      {/* Speech bubble */}
      <div className="relative z-10 w-full mb-1">
        <div className="bg-[#1e2038] border border-peach/30 text-peach text-sm rounded-xl px-4 py-3 text-center shadow-lg transition-all duration-200">
          <p className="font-sans font-medium">{speech}</p>
          {choices && (
            <div className="flex justify-center gap-2 mt-2.5">
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => answerChoice(c.reply)}
                  className="text-xs bg-[#282a48] hover:bg-peach hover:text-[#11111b] text-white px-3 py-1 rounded-md transition font-mono border border-peach/20"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Bubble tail */}
        <div className="w-3 h-3 bg-[#1e2038] border-r border-b border-peach/30 transform rotate-45 mx-auto -mt-1.5" />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        onClick={handlePet}
        className="cursor-pointer hover:scale-[1.02] transition-transform select-none"
        title="Click to pet me!"
      />

      {/* Interactive Controls */}
      <div className="grid grid-cols-4 gap-2 w-full mt-2">
        <button
          onClick={handlePet}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#18192a] hover:bg-[#22243d] border border-card-border hover:border-peach/50 transition group"
        >
          <Heart className="w-4 h-4 text-rose group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono text-subtext mt-1">Pet</span>
        </button>

        <button
          onClick={handleFeed}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#18192a] hover:bg-[#22243d] border border-card-border hover:border-gold/50 transition group"
        >
          <Cookie className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono text-subtext mt-1">Snack</span>
        </button>

        <button
          onClick={handleDance}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#18192a] hover:bg-[#22243d] border border-card-border hover:border-sky/50 transition group"
        >
          <Music className="w-4 h-4 text-sky group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono text-subtext mt-1">Dance</span>
        </button>

        <button
          onClick={handleAsk}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#18192a] hover:bg-[#22243d] border border-card-border hover:border-mint/50 transition group"
        >
          <HelpCircle className="w-4 h-4 text-mint group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono text-subtext mt-1">Ask</span>
        </button>
      </div>

      {/* Quick Pal Switcher */}
      <div className="flex justify-center gap-1.5 mt-3 pt-3 border-t border-card-border/60 w-full">
        {PALS.map((p) => (
          <button
            key={p.id}
            onClick={() => changePal(p.id)}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
              currentPet === p.id
                ? 'bg-peach text-[#11111b] font-bold shadow'
                : 'text-subtext hover:text-white bg-[#18192a]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
