import React, { useState, useRef, useEffect } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { PixelHeart, PixelMusic, PixelStar, PixelCookie, PixelSparkle } from './PixelIcons';
import { motion } from 'framer-motion';

const PALS = [
  {
    id: 'mochi',
    name: 'Mochi',
    species: 'Orange Tabby Cat',
    bio: 'A professional napper who will quietly judge your playlist with pure unconditional love.',
    accent: '#ff7a59',
    treat: 'Warm Cookies',
    voiceDesc: 'Cozy Meows & Soft Purrs',
    stats: { cuteness: 98, energy: 45, curiosity: 92, napNeed: 100 },
    quote: '“I watched you stare at your screen for 20 minutes without blinking. Very impressive.”'
  },
  {
    id: 'biscuit',
    name: 'Biscuit',
    species: 'Energetic Shiba Dog',
    bio: 'Maximum loyalty, minimum chill. Will do virtual backflips whenever you drop a treat.',
    accent: '#ffd76e',
    treat: 'Glazed Donuts',
    voiceDesc: 'Joyful High-Pitch Barks',
    stats: { cuteness: 95, energy: 99, curiosity: 88, napNeed: 30 },
    quote: '“10/10 would fetch that window for you if I had arms and windows were balls!”'
  },
  {
    id: 'pudding',
    name: 'Pudding',
    species: 'Mint Jelly Slime',
    bio: 'Small, bouncy, gelatinous, and full of squishy good vibes. Never leaves a mess.',
    accent: '#7ed6a0',
    treat: 'Boba Pearls',
    voiceDesc: 'Bouncy Spring Squelches',
    stats: { cuteness: 92, energy: 75, curiosity: 85, napNeed: 60 },
    quote: '“Slime secret: we taste like mint, bounce like springs, and love like giants!”'
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'Friendly Little Ghost',
    bio: 'Mostly here for gentle hovering and calming company. Floats directly over active windows.',
    accent: '#cbb2fe',
    treat: 'Moon Sugar Drops',
    voiceDesc: 'Soft Ethereal Chimes',
    stats: { cuteness: 94, energy: 50, curiosity: 95, napNeed: 80 },
    quote: '“Boo! Did I startle you? No? Good, because I am actually quite delicate.”'
  },
  {
    id: 'clover',
    name: 'Clover',
    species: 'Soft-Hearted Bunny',
    bio: 'Ears at maximum altitude, heart at maximum softness. Twitching nose detects snack breaks.',
    accent: '#ff6d8a',
    treat: 'Crunchy Biscuits',
    voiceDesc: 'Sweet High-Speed Hops',
    stats: { cuteness: 99, energy: 80, curiosity: 90, napNeed: 55 },
    quote: '“My ears rotate like tiny radar dishes. Currently detecting: snack opportunities!”'
  },
  {
    id: 'miso',
    name: 'Miso',
    species: 'Grinning Axolotl',
    bio: 'Always smiling. Scientifically and biologically incapable of frowning or being sad.',
    accent: '#7ec8ff',
    treat: 'Sweet Star Boba',
    voiceDesc: 'Playful Bubble Giggles',
    stats: { cuteness: 97, energy: 65, curiosity: 94, napNeed: 70 },
    quote: '“My gills look like frilly pink party hats because every single day is a party!”'
  }
];

// Interactive Individual 3D Tilt Card Component
function PalCard({ pal, onAdopt }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Parallax 3D Card Mouse Tilt Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Canvas Razor Sharp Pixel Art Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Strict pixelation settings
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) ctx.webkitImageSmoothingEnabled = false;
    if (ctx.mozImageSmoothingEnabled !== undefined) ctx.mozImageSmoothingEnabled = false;

    const pet = PIXEL_PALS.build(pal.id);

    const render = (t) => {
      ctx.clearRect(0, 0, 160, 160);
      ctx.imageSmoothingEnabled = false;

      ctx.save();
      ctx.translate(80, 140);

      // Strict integer scaling: 4x scale for crisp cards
      const floatY = pet.meta.float ? Math.sin(t * 0.004) * 4 : 0;
      ctx.translate(0, floatY);
      ctx.scale(4, 4);
      ctx.translate(-16, -30);

      const isBlinking = Math.sin(t * 0.002 + (pal.id.charCodeAt(0))) > 0.94;
      const isHappy = speaking || isHovered;

      pet.draw(ctx, {
        face: isBlinking ? 'blink' : (isHappy ? 'happy' : 'open'),
        mouth: isHappy ? 'open' : 'idle',
        tail: Math.floor(t * 0.0035) % 2,
        sprout: Math.floor(t * 0.001) % 2,
        dx: isHovered ? Math.sin(t * 0.004) * 1.5 : 0,
        dy: 0
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [pal.id, isHovered, speaking]);

  const handleVoiceTest = (e) => {
    e.stopPropagation();
    PET_SFX.unlock();
    setSpeaking(true);
    const chars = pal.name.toLowerCase();
    for (let i = 0; i < chars.length; i++) {
      setTimeout(() => PET_SFX.blip(chars[i]), i * 85);
    }
    setTimeout(() => {
      PET_SFX.chime();
      setSpeaking(false);
    }, chars.length * 85 + 250);
  };

  const handleAdoptClick = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    if (onAdopt) onAdopt(pal.id);
    const el = document.getElementById('playground');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
      }}
      className="retro-card-light dark:retro-card-dark p-6 flex flex-col justify-between relative group select-none"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-arcade px-3 py-1 rounded-full border-2 border-espresso text-espresso font-bold shadow-xs"
          style={{ backgroundColor: pal.accent }}
        >
          {pal.species}
        </span>
        <button
          onClick={handleVoiceTest}
          className="p-2 rounded-xl bg-cream-surface dark:bg-cocoa-canvas border-2 border-espresso text-espresso dark:text-cream hover:bg-honey transition"
          title={`Hear ${pal.name}'s Animalese voice`}
        >
          <PixelMusic className="w-4 h-4" />
        </button>
      </div>

      {/* Razor-sharp Pet Sprite Canvas */}
      <div className="w-full h-40 flex items-center justify-center relative my-2 bg-gradient-to-b from-cream-surface/30 to-cream/10 dark:from-cocoa-canvas dark:to-cocoa-card rounded-2xl border-2 border-dashed border-espresso/20 dark:border-cocoa-border">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="pixelated w-36 h-36 object-contain pointer-events-none"
        />
        {speaking && (
          <div className="absolute top-2 right-2 bg-honey text-espresso font-pixel text-xs px-2 py-0.5 rounded-full border border-espresso animate-bounce">
            Talking!
          </div>
        )}
      </div>

      {/* Pet Information */}
      <div className="my-2">
        <h3 className="font-arcade text-lg text-espresso dark:text-cream">
          {pal.name}
        </h3>
        <p className="font-sans text-sm text-espresso-muted dark:text-cocoa-muted mt-2 leading-relaxed">
          {pal.bio}
        </p>
      </div>

      {/* Trait Stat Bars */}
      <div className="space-y-2 my-4 pt-3 border-t-2 border-espresso/10 dark:border-cocoa-border text-xs font-pixel">
        <div className="flex items-center justify-between">
          <span className="text-espresso dark:text-cream">Cuteness</span>
          <div className="w-28 h-2.5 rounded-full bg-cream-surface dark:bg-cocoa-canvas border border-espresso/30 overflow-hidden">
            <div className="h-full bg-coral rounded-full" style={{ width: `${pal.stats.cuteness}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-espresso dark:text-cream">Energy</span>
          <div className="w-28 h-2.5 rounded-full bg-cream-surface dark:bg-cocoa-canvas border border-espresso/30 overflow-hidden">
            <div className="h-full bg-honey rounded-full" style={{ width: `${pal.stats.energy}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-espresso dark:text-cream">Curiosity</span>
          <div className="w-28 h-2.5 rounded-full bg-cream-surface dark:bg-cocoa-canvas border border-espresso/30 overflow-hidden">
            <div className="h-full bg-mint rounded-full" style={{ width: `${pal.stats.curiosity}%` }} />
          </div>
        </div>
      </div>

      {/* Favorite Treat Pill */}
      <div className="flex items-center gap-2 text-xs font-pixel text-espresso-muted dark:text-cocoa-muted mb-4">
        <PixelCookie className="w-4 h-4 text-honey" />
        <span>Loves: <strong>{pal.treat}</strong></span>
      </div>

      {/* Action Button: Adopt in Playground */}
      <button
        onClick={handleAdoptClick}
        className="retro-btn w-full py-2.5 text-sm font-pixel font-bold bg-cream-surface dark:bg-cocoa-canvas hover:bg-honey text-espresso dark:text-cream hover:text-espresso border-2 border-espresso transition-all"
      >
        <PixelHeart className="w-4 h-4 text-coral" />
        <span>Adopt {pal.name}</span>
      </button>
    </div>
  );
}

export function PalsShowcase({ onAdopt }) {
  return (
    <section id="pals" className="relative py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>The Six Companions</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-espresso dark:text-cream tracking-tight">
          Choose Your Best Buddy
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-cocoa-muted font-sans max-w-xl mx-auto leading-relaxed">
          Switch between them anytime with a single click. Each companion has their own personality, unique voice frequency, and cheerful animations.
        </p>
      </div>

      {/* 6-Card Grid with 3D Mouse Parallax Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {PALS.map((pal) => (
          <PalCard key={pal.id} pal={pal} onAdopt={onAdopt} />
        ))}
      </div>
    </section>
  );
}
