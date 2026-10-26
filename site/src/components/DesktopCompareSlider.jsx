import React, { useState, useRef, useCallback } from 'react';
import { PixelSparkle, PixelHeart } from './PixelIcons';

export function DesktopCompareSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (isDragging.current) handleMove(e.clientX);
  };
  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
  };

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-honey text-espresso text-sm font-pixel font-bold mb-4 border-2 border-espresso shadow-pixel">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Interactive Screen Comparison</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight">
          Drag to Feel the Warmth
        </h2>
        <p className="mt-4 text-xl text-espresso-muted dark:text-[#dfd2c0] font-sans leading-relaxed">
          Slide left and right to see how a little desktop companion turns an ordinary computer screen into a joyful, cozy sanctuary.
        </p>
      </div>

      {/* Interactive Compare Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[400px] sm:h-[460px] rounded-3xl border-3 border-espresso overflow-hidden shadow-pixel-xl select-none cursor-ew-resize bg-[#18181f]"
      >
        {/* Right Side: With Pixel Pals */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1d17] via-[#35251d] to-[#1e1511] p-6 sm:p-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs sm:text-sm font-bold bg-honey text-espresso px-4 py-2 rounded-full border border-espresso shadow-xs">
              ✨ With Pixel Pals (Warm & Cozy)
            </span>
            <div className="flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-coral inline-block border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-full bg-honey inline-block border border-black/30" />
              <span className="w-3.5 h-3.5 rounded-full bg-mint inline-block border border-black/30" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="w-24 h-24 rounded-3xl bg-honey/20 border-3 border-honey flex items-center justify-center text-5xl mb-4 shadow-inner animate-float-slow">
              🐱
            </div>
            <div className="bg-[#fffdf8] text-espresso px-6 py-3 rounded-2xl font-dialogue text-2xl sm:text-3xl border-3 border-espresso shadow-pixel max-w-sm">
              “Take a deep breath. You are doing fantastic today!”
            </div>
            <div className="flex items-center gap-3 mt-4 text-sm font-pixel text-honey">
              <span className="flex items-center gap-1"><PixelHeart className="w-4 h-4 text-coral" /> Purring softly</span>
              <span>•</span>
              <span>4-second breathing resets ready</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-pixel text-cream/80 border-t border-espresso/40 pt-3">
            <span>Transparent clicks active • Never blocks mouse</span>
            <span className="text-mint font-bold">100% Peace of Mind</span>
          </div>
        </div>

        {/* Left Side: Without Companion (Clipped by sliderPos) */}
        <div
          style={{ width: `${sliderPos}%` }}
          className="absolute inset-y-0 left-0 bg-[#0e1017] border-r-4 border-honey p-6 sm:p-10 flex flex-col justify-between overflow-hidden z-10"
        >
          <div className="flex items-center justify-between min-w-[320px]">
            <span className="font-pixel text-xs sm:text-sm font-bold bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full border border-zinc-700">
              ❌ Boring & Lonely Screen
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto min-w-[320px] opacity-75">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mb-4 text-zinc-600 font-mono">
              [ 404 ]
            </div>
            <div className="bg-zinc-900 text-zinc-400 px-5 py-2.5 rounded-xl font-mono text-sm border border-zinc-800">
              Unread tabs: 84 • Staring at silent screen
            </div>
            <span className="text-xs font-mono text-zinc-500 mt-3">
              Nothing to break the monotony of a long workday.
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-zinc-500 border-t border-zinc-800 pt-3 min-w-[320px]">
            <span>Routine: Monotonous</span>
            <span className="text-rose-400 font-bold">Needs a friend</span>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute inset-y-0 -ml-5 w-10 flex flex-col items-center justify-center z-20 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-honey text-espresso border-3 border-espresso flex items-center justify-center font-arcade text-xs font-bold shadow-pixel">
            ↔
          </div>
        </div>
      </div>
    </section>
  );
}
