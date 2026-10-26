import React, { useState, useEffect, useRef } from 'react';
import { PIXEL_PALS } from '../lib/sprites';
import { PET_SFX } from '../lib/sounds';
import { PixelHeart, PixelSparkle } from './PixelIcons';

const SHELLS = [
  { id: 'honey', name: 'Butter Honey', bg: 'bg-[#ffd76e] border-[#3a2b20]' },
  { id: 'pink', name: 'Sakura Berry', bg: 'bg-[#ff6d8a] border-[#3a2b20]' },
  { id: 'mint', name: 'Matcha Mint', bg: 'bg-[#7ed6a0] border-[#3a2b20]' },
];

export function TamagotchiPocket() {
  const [shell, setShell] = useState('honey');
  const [petId, setPetId] = useState('mochi');
  const [hunger, setHunger] = useState(3);
  const [happiness, setHappiness] = useState(4);
  const [actionMessage, setActionMessage] = useState('READY!');
  const canvasRef = useRef(null);

  // LCD Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    ctx.imageSmoothingEnabled = false;
    const pet = PIXEL_PALS.build(petId);

    const render = (t) => {
      ctx.clearRect(0, 0, 128, 110);
      ctx.imageSmoothingEnabled = false;

      // Draw LCD dot-matrix subtle green-tint background
      ctx.fillStyle = '#8ea889';
      ctx.fillRect(0, 0, 128, 110);

      // Render pixel pet
      ctx.save();
      ctx.translate(64, 88);
      ctx.scale(3, 3);
      ctx.translate(-16, -30);

      const isHappy = happiness >= 4;
      pet.draw(ctx, {
        face: Math.sin(t * 0.003) > 0.94 ? 'blink' : (isHappy ? 'happy' : 'open'),
        mouth: isHappy ? 'open' : 'idle',
        tail: Math.floor(t * 0.004) % 2,
        sprout: Math.floor(t * 0.002) % 2,
        dx: Math.sin(t * 0.003) * 1.5,
        dy: 0,
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [petId, happiness]);

  const handleFeed = () => {
    PET_SFX.unlock();
    PET_SFX.munch();
    setHunger((h) => Math.min(5, h + 1));
    setActionMessage('YUM YUM! 🍪');
    setTimeout(() => setActionMessage('PLAY?'), 1200);
  };

  const handlePlay = () => {
    PET_SFX.unlock();
    PET_SFX.boop();
    setHappiness((h) => Math.min(5, h + 1));
    setActionMessage('HAPPY! ♥');
    setTimeout(() => setActionMessage('READY!'), 1200);
  };

  const handleSwitch = () => {
    PET_SFX.unlock();
    PET_SFX.pop();
    const pals = ['mochi', 'biscuit', 'pudding', 'luna', 'clover', 'miso'];
    const nextIdx = (pals.indexOf(petId) + 1) % pals.length;
    setPetId(pals[nextIdx]);
    setActionMessage('SWITCHED!');
  };

  const currentShell = SHELLS.find((s) => s.id === shell) || SHELLS[0];

  return (
    <section className="relative py-24 px-4 max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Interactive Virtual Toy</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight">
          Pocket Tamagotchi Edition
        </h2>
        <p className="mt-3 text-base text-espresso-muted dark:text-cocoa-muted font-sans">
          Click the tactile buttons below to feed and play with your pocket buddy!
        </p>

        {/* Shell color switcher */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs font-pixel font-bold text-espresso dark:text-cream">Shell Color:</span>
          {SHELLS.map((s) => (
            <button
              key={s.id}
              onClick={() => { PET_SFX.unlock(); PET_SFX.click(); setShell(s.id); }}
              className={`w-6 h-6 rounded-full border-2 border-espresso transition-transform ${s.bg} ${
                shell === s.id ? 'scale-125 ring-2 ring-espresso ring-offset-2' : ''
              }`}
              title={s.name}
            />
          ))}
        </div>
      </div>

      {/* The Physical Tamagotchi Device Shell */}
      <div
        className={`w-72 sm:w-80 p-7 rounded-[48px] border-4 ${currentShell.bg} shadow-pixel-xl flex flex-col items-center select-none relative`}
      >
        {/* Keychain Loop at Top */}
        <div className="absolute -top-6 w-10 h-10 rounded-full border-4 border-espresso bg-transparent" />

        {/* Brand Banner */}
        <span className="font-arcade text-[10px] text-espresso tracking-widest uppercase font-bold mb-4">
          ★ PIXEL PALS TOY ★
        </span>

        {/* LCD Screen Inner Bezel */}
        <div className="w-56 p-3 rounded-2xl bg-[#769172] border-3 border-espresso shadow-inner flex flex-col items-center">
          {/* Status Indicators at top of LCD */}
          <div className="w-full flex items-center justify-between text-[10px] font-arcade text-[#203020] px-1 mb-1 font-bold">
            <span>HUNGER: {'♥'.repeat(hunger)}</span>
            <span>JOY: {'★'.repeat(happiness)}</span>
          </div>

          {/* Canvas Display */}
          <canvas
            ref={canvasRef}
            width={128}
            height={110}
            className="w-48 h-36 rounded-lg pixelated border-2 border-[#546b51] shadow-inner"
          />

          {/* LCD Dialogue Bar */}
          <div className="w-full mt-2 py-1 px-2 rounded bg-[#6a8466] border border-[#546b51] text-center font-arcade text-xs text-[#1e2e1e] font-bold">
            {actionMessage}
          </div>
        </div>

        {/* 3 Physical Rubber Buttons */}
        <div className="flex items-center justify-center gap-6 mt-7">
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleFeed}
              className="w-12 h-12 rounded-full bg-espresso text-cream border-2 border-[#1a120c] shadow-[0_4px_0_#1a120c] active:translate-y-1 active:shadow-none flex items-center justify-center font-arcade text-xs font-bold transition-all"
            >
              A
            </button>
            <span className="font-arcade text-[9px] text-espresso font-bold">FEED</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 translate-y-2">
            <button
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-espresso text-cream border-2 border-[#1a120c] shadow-[0_4px_0_#1a120c] active:translate-y-1 active:shadow-none flex items-center justify-center font-arcade text-xs font-bold transition-all"
            >
              B
            </button>
            <span className="font-arcade text-[9px] text-espresso font-bold">PLAY</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleSwitch}
              className="w-12 h-12 rounded-full bg-espresso text-cream border-2 border-[#1a120c] shadow-[0_4px_0_#1a120c] active:translate-y-1 active:shadow-none flex items-center justify-center font-arcade text-xs font-bold transition-all"
            >
              C
            </button>
            <span className="font-arcade text-[9px] text-espresso font-bold">SWAP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
