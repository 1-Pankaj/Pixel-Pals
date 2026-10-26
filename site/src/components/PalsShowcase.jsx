import React, { useState, useRef, useEffect } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { Volume2, Sparkles, Heart, Check } from 'lucide-react';

const PALS_DATA = [
  {
    id: 'mochi',
    name: 'Mochi',
    species: 'Orange Tabby Cat',
    tagline: 'Professional napper. Will judge your playlist, lovingly.',
    color: '#fab387',
    badge: 'Lazy & Sweet',
    snack: 'Cookie',
    soundPitch: 'C5 (Warm Purrs)',
    quip: '"I watched you stare at that same line of code for 12 minutes. Inspiring."'
  },
  {
    id: 'biscuit',
    name: 'Biscuit',
    species: 'Shiba Inu',
    tagline: 'Maximum loyalty, minimum chill. 10/10 would fetch.',
    color: '#f9e2af',
    badge: 'Loyal & Energetic',
    snack: 'Donut',
    soundPitch: 'E5 (Joyful Bark-Blips)',
    quip: '"10/10 would fetch that file for you. If I had arms. And files were balls."'
  },
  {
    id: 'pudding',
    name: 'Pudding',
    species: 'Mint Slime',
    tagline: 'Small, squishy, full of big dreams and jelly.',
    color: '#a6e3a1',
    badge: 'Squishy & Cute',
    snack: 'Boba',
    soundPitch: 'G5 (Springy Squelch)',
    quip: '"Slime secret: we taste like mint, bounce like springs, and love like giants."'
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'Little Ghost',
    tagline: 'Mostly here for the cozy vibes and gentle hovering.',
    color: '#cba6f7',
    badge: 'Gentle Floater',
    snack: 'Boba',
    soundPitch: 'A5 (Ethereal Chimes)',
    quip: '"Boo! Did I scare you? No? Good. I am actually quite delicate."'
  },
  {
    id: 'clover',
    name: 'Clover',
    species: 'Bunny',
    tagline: 'Ears at maximum altitude. Heart at maximum softness.',
    color: '#f5c2e7',
    badge: 'Rapid Hopper',
    snack: 'Cookie',
    soundPitch: 'C6 (High-Pitch Hops)',
    quip: '"My ears rotate like tiny radar dishes. Currently detecting: snack opportunities."'
  },
  {
    id: 'miso',
    name: 'Miso',
    species: 'Axolotl',
    tagline: 'Always smiling. Scientifically unable to frown.',
    color: '#eba0ac',
    badge: 'Perpetual Grin',
    snack: 'Donut',
    soundPitch: 'D5 (Bubble Giggles)',
    quip: '"My gills look like frilly pink party hats. Because every day is a party."'
  }
];

export function PalsShowcase({ onAdopt }) {
  const [selectedId, setSelectedId] = useState('mochi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const canvasRef = useRef(null);

  const pal = PALS_DATA.find((p) => p.id === selectedId) || PALS_DATA[0];

  // Draw animated sprite for selected pal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const pet = PIXEL_PALS.build(pal.id);

    const render = (t) => {
      ctx.clearRect(0, 0, 180, 180);
      ctx.save();
      ctx.translate(90, 160);
      const bob = Math.sin(t * 0.003) * 4;
      const squish = 1 + Math.sin(t * 0.005) * 0.04;
      ctx.scale(squish * 4.2, (2 - squish) * 4.2);
      ctx.translate(-16, -30 + (pet.meta.float ? Math.sin(t * 0.004) * 2 : 0));

      pet.draw(ctx, {
        face: Math.sin(t * 0.002) > 0.95 ? 'blink' : 'open',
        mouth: Math.sin(t * 0.0015) > 0.6 ? 'smile' : 'idle',
        tail: Math.floor(t * 0.003) % 2,
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
    // Play sentence in their pitch
    const text = pal.name.toLowerCase();
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => PET_SFX.blip(text[i]), i * 70);
    }
    setTimeout(() => {
      PET_SFX.chime();
      setIsPlayingAudio(false);
    }, text.length * 70 + 200);
  };

  const handleAdopt = () => {
    PET_SFX.unlock();
    PET_SFX.fanfare();
    if (onAdopt) onAdopt(pal.id);
    const playground = document.getElementById('playground');
    if (playground) playground.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pals" className="relative py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/30 text-peach text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Handcrafted Characters</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-pixel font-bold text-white tracking-wide">
          Meet the Six Pals
        </h2>
        <p className="mt-3 text-subtext text-sm sm:text-base font-sans">
          Every buddy has their own 40 personality dialogue lines, tailored WebAudio frequency blip pitch, custom half-mirrored pixel art, and unique idle animations.
        </p>
      </div>

      {/* Main 3D Card Showcase */}
      <div className="bg-[#121320] border border-card-border rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Sprite Stage */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0b0c14] border border-card-border/80 shadow-inner relative overflow-hidden group">
          <div
            className="absolute inset-0 opacity-20 blur-2xl transition-all duration-500 rounded-full"
            style={{ background: pal.color }}
          />
          <canvas
            ref={canvasRef}
            width={180}
            height={180}
            className="relative z-10 select-none group-hover:scale-105 transition-transform"
          />
          <div className="relative z-10 mt-2 flex items-center gap-2">
            <span
              className="text-xs font-mono font-bold px-3 py-1 rounded-full"
              style={{ background: `${pal.color}25`, color: pal.color, border: `1px solid ${pal.color}40` }}
            >
              {pal.badge}
            </span>
            <button
              onClick={testVoice}
              disabled={isPlayingAudio}
              className="flex items-center gap-1.5 text-xs font-mono bg-[#1c1d30] hover:bg-[#282a44] text-white px-3 py-1 rounded-full border border-card-border transition shadow"
              title="Hear voice pitch in WebAudio"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-peach' : 'text-subtext'}`} />
              <span>Voice Sample</span>
            </button>
          </div>
        </div>

        {/* Right: Bio & Stats */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-pixel font-bold text-white">{pal.name}</h3>
              <span className="text-sm font-mono text-subtext">{pal.species}</span>
            </div>
            <button
              onClick={handleAdopt}
              className="flex items-center gap-2 text-xs font-mono font-bold bg-peach hover:bg-gold text-[#11111b] px-4 py-2 rounded-xl transition shadow-lg shadow-peach/20"
            >
              <Heart className="w-3.5 h-3.5 fill-[#11111b]" />
              <span>Adopt in Sandbox</span>
            </button>
          </div>

          <p className="mt-4 text-base font-sans text-subtext/90 italic">
            "{pal.tagline}"
          </p>

          {/* Dialogue Quote Box */}
          <div className="mt-4 p-4 rounded-xl bg-[#0b0c14] border border-card-border font-mono text-xs text-peach/90 shadow-inner">
            <span className="text-subtext/60 block mb-1 uppercase tracking-wider text-[10px]">Sample Dialogue:</span>
            {pal.quip}
          </div>

          {/* Stats Badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#18192a] border border-card-border/60">
              <span className="text-subtext block text-[10px]">Favorite Snack</span>
              <span className="text-white font-bold">{pal.snack}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#18192a] border border-card-border/60">
              <span className="text-subtext block text-[10px]">Voice Pitch</span>
              <span className="text-white font-bold">{pal.soundPitch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pal Selection Dock */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {PALS_DATA.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => {
                PET_SFX.unlock();
                PET_SFX.click();
                setSelectedId(p.id);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-[#1e2038] border-peach shadow-lg shadow-peach/20 scale-105 text-white'
                  : 'bg-[#121320] border-card-border text-subtext hover:text-white hover:border-[#383a58]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: p.color }}
              />
              <span className="font-pixel text-base">{p.name}</span>
              <span className="text-xs font-mono opacity-70">({p.species.split(' ')[0]})</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
