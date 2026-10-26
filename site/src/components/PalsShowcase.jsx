import React, { useState, useRef, useEffect } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { Volume2, Heart, Sparkles, Cookie, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PALS = [
  {
    id: 'mochi',
    name: 'Mochi',
    title: 'The Orange Tabby Cat',
    bio: 'A professional napper who will quietly judge your playlist with pure love.',
    color: '#ff7a59',
    favoriteTreat: 'Warm Cookies',
    voice: 'Cozy Purrs & Meow Blips',
    sampleLine: '“I watched you stare at your screen for 20 minutes without blinking. Very impressive.”'
  },
  {
    id: 'biscuit',
    name: 'Biscuit',
    title: 'The Energetic Shiba Inu',
    bio: 'Maximum loyalty, minimum chill. Will do virtual backflips for any snack.',
    color: '#facc15',
    favoriteTreat: 'Glazed Donuts',
    voice: 'Joyful High-Pitch Barks',
    sampleLine: '“10/10 would fetch that window for you if I had arms and windows were balls!”'
  },
  {
    id: 'pudding',
    name: 'Pudding',
    title: 'The Mint Jelly Slime',
    bio: 'Small, squishy, bouncy, and full of gelatinous dreams and good vibes.',
    color: '#4ade80',
    favoriteTreat: 'Boba Pearls',
    voice: 'Bouncy Spring Squelches',
    sampleLine: '“Slime secret: we taste like mint, bounce like springs, and love like giants!”'
  },
  {
    id: 'luna',
    name: 'Luna',
    title: 'The Friendly Little Ghost',
    bio: 'Mostly here for gentle hovering and calming company. (Actually floats above windows!)',
    color: '#c084fc',
    favoriteTreat: 'Sweet Boba',
    voice: 'Soft Ethereal Chimes',
    sampleLine: '“Boo! Did I startle you? No? Good, because I am actually quite delicate.”'
  },
  {
    id: 'clover',
    name: 'Clover',
    title: 'The Soft Hearted Bunny',
    bio: 'Ears at maximum altitude, heart at maximum softness. Loves quick hops.',
    color: '#f472b6',
    favoriteTreat: 'Crunchy Biscuits',
    voice: 'Sweet High-Speed Hops',
    sampleLine: '“My ears rotate like tiny radar dishes. Currently detecting: snack opportunities!”'
  },
  {
    id: 'miso',
    name: 'Miso',
    title: 'The Grinning Axolotl',
    bio: 'Always smiling. Scientifically and biologically incapable of frowning.',
    color: '#fb7185',
    favoriteTreat: 'Donut Crumbs',
    voice: 'Playful Bubble Giggles',
    sampleLine: '“My gills look like frilly pink party hats because every single day is a party!”'
  }
];

export function PalsShowcase({ onAdopt }) {
  const [selectedId, setSelectedId] = useState('mochi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const canvasRef = useRef(null);

  const pal = PALS.find((p) => p.id === selectedId) || PALS[0];

  // Razor-sharp canvas rendering for selected pet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    ctx.imageSmoothingEnabled = false;
    const pet = PIXEL_PALS.build(pal.id);

    const render = (t) => {
      ctx.clearRect(0, 0, 240, 240);
      ctx.imageSmoothingEnabled = false;

      ctx.save();
      ctx.translate(120, 210);
      const squish = 1 + Math.sin(t * 0.005) * 0.04;
      ctx.scale(squish * 5.6, (2 - squish) * 5.6);
      ctx.translate(-16, -30 + (pet.meta.float ? Math.sin(t * 0.004) * 2.5 : 0));

      pet.draw(ctx, {
        face: Math.sin(t * 0.002) > 0.95 ? 'blink' : 'open',
        mouth: Math.sin(t * 0.0018) > 0.6 ? 'smile' : 'idle',
        tail: Math.floor(t * 0.0035) % 2,
        sprout: Math.floor(t * 0.001) % 2,
        dx: Math.sin(t * 0.002) * 1.5,
        dy: 0
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [pal.id]);

  const testVoice = () => {
    PET_SFX.unlock();
    setIsPlayingAudio(true);
    const chars = pal.name.toLowerCase();
    for (let i = 0; i < chars.length; i++) {
      setTimeout(() => PET_SFX.blip(chars[i]), i * 80);
    }
    setTimeout(() => {
      PET_SFX.chime();
      setIsPlayingAudio(false);
    }, chars.length * 80 + 200);
  };

  const handleCuddle = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    if (onAdopt) onAdopt(pal.id);
    const el = document.getElementById('playground');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pals" className="relative py-28 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>The Six Companions</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white tracking-tight">
          Choose Your Best Friend
        </h2>
        <p className="mt-4 text-lg text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed">
          Switch between them anytime. Each friend has their own funny dialogue, cheerful sounds, and cute animations.
        </p>
      </div>

      {/* Main Character Display Card */}
      <div className="bg-gradient-to-b from-[#131420] to-[#0a0a0f] border border-[#272738] rounded-3xl p-6 sm:p-12 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Big Razor-Sharp Animated Sprite Stage */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#050508] border border-[#1f2030] relative overflow-hidden group shadow-inner">
          <div
            className="absolute inset-0 opacity-25 blur-3xl rounded-full transition-all duration-700"
            style={{ background: pal.color }}
          />

          {/* Canvas with forced pixelated rendering */}
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            style={{ imageRendering: 'pixelated' }}
            className="relative z-10 select-none group-hover:scale-105 transition-transform duration-300"
          />

          <div className="relative z-10 mt-4 flex items-center gap-3">
            <button
              onClick={testVoice}
              disabled={isPlayingAudio}
              className="flex items-center gap-2 text-sm font-medium bg-[#1a1b2b] hover:bg-[#282942] text-white px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 transition shadow"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-pink-400' : 'text-zinc-400'}`} />
              <span>Hear Voice Blip</span>
            </button>
          </div>
        </div>

        {/* Right: Character Story & Attributes */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-4xl sm:text-5xl font-heading font-black text-white">
                {pal.name}
              </h3>
              <p className="text-lg font-medium text-pink-400 mt-1">{pal.title}</p>
            </div>
            <button
              onClick={handleCuddle}
              className="flex items-center gap-2 text-sm font-bold bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-xl transition shadow-lg hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Adopt in Playground</span>
            </button>
          </div>

          <p className="mt-4 text-xl font-normal text-zinc-200 leading-relaxed">
            {pal.bio}
          </p>

          {/* Sample Dialogue Box */}
          <div className="mt-6 p-5 rounded-2xl bg-[#08080d] border border-zinc-800 text-zinc-300 text-base shadow-inner">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
              Sample Thing They Say:
            </span>
            <p className="italic text-pink-200 font-medium">{pal.sampleLine}</p>
          </div>

          {/* Cute Attributes */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-[#12131f] border border-[#222336]">
              <span className="text-xs text-zinc-400 block font-medium">Favorite Snack</span>
              <span className="text-white font-bold text-base mt-0.5 block">{pal.favoriteTreat}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#12131f] border border-[#222336]">
              <span className="text-xs text-zinc-400 block font-medium">Cute Voice Tone</span>
              <span className="text-white font-bold text-base mt-0.5 block">{pal.voice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buddy Selection Dock */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {PALS.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => {
                PET_SFX.unlock();
                PET_SFX.click();
                setSelectedId(p.id);
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-base font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-black border-white shadow-xl shadow-pink-500/20 scale-105 font-bold'
                  : 'bg-[#10111a] text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-600 hover:bg-[#181926]'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: p.color }}
              />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
