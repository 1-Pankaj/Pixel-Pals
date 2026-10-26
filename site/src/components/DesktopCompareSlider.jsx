import React, { useState, useRef, useCallback } from 'react';
import { PixelSparkle } from './PixelIcons';

export function DesktopCompareSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
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
    <section className="relative py-28 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey/20 border-2 border-honey text-espresso dark:text-honey text-sm font-pixel font-bold mb-3">
          <PixelSparkle className="w-4 h-4 text-coral" />
          <span>Skiper UI • Interactive Compare Slider</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight">
          Drag to Feel the Difference
        </h2>
        <p className="mt-4 text-lg text-espresso-muted dark:text-cocoa-muted font-sans max-w-xl mx-auto leading-relaxed">
          Slide left and right to see how a small friendly companion transforms a stressful computer screen into a cozy sanctuary.
        </p>
      </div>

      {/* Interactive Compare Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[440px] rounded-3xl border-3 border-espresso overflow-hidden shadow-pixel-xl select-none cursor-ew-resize bg-[#18181f]"
      >
        {/* Right Side / After: "With Pixel Pals" */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1d17] via-[#35251d] to-[#1e1511] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs sm:text-sm font-bold bg-honey text-espresso px-3 py-1.5 rounded-full border border-espresso shadow-xs">
              ✨ With Pixel Pals (Warm & Relaxed)
            </span>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-coral inline-block" />
              <span className="w-3 h-3 rounded-full bg-honey inline-block" />
              <span className="w-3 h-3 rounded-full bg-mint inline-block" />
            </div>
          </div>

          {/* Cozy Desktop Mockup */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="w-20 h-20 rounded-2xl bg-honey/20 border-2 border-honey flex items-center justify-center text-4xl mb-3 shadow-inner">
              🐱
            </div>
            <div className="bg-cream-light text-espresso px-4 py-2 rounded-xl font-dialogue text-2xl border-2 border-espresso shadow-pixel-soft max-w-xs">
              “Take a deep breath. You are doing fantastic today!”
            </div>
            <div className="flex items-center gap-3 mt-4 text-xs font-pixel text-honey">
              <span>♥ Purring softly</span>
              <span>•</span>
              <span>4-4-4 Calm breath ready</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-pixel text-cream/70 border-t border-espresso/30 pt-3">
            <span>Window status: Transparent click-through active</span>
            <span className="text-mint font-bold">Stress: -80%</span>
          </div>
        </div>

        {/* Left Side / Before: "Without Pixel Pals" (Clipped by sliderPos) */}
        <div
          style={{ width: `${sliderPos}%` }}
          className="absolute inset-y-0 left-0 bg-[#0f1117] border-r-3 border-honey p-6 sm:p-8 flex flex-col justify-between overflow-hidden z-10"
        >
          <div className="flex items-center justify-between min-w-[340px]">
            <span className="font-pixel text-xs sm:text-sm font-bold bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700">
              ❌ Without Companion (Cold & Lonely)
            </span>
          </div>

          {/* Stressful screen mockup */}
          <div className="flex flex-col items-center justify-center text-center my-auto min-w-[340px] opacity-75">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl mb-3 text-zinc-500 font-mono">
              [ 404 ]
            </div>
            <div className="bg-zinc-900 text-zinc-400 px-4 py-2 rounded-lg font-mono text-xs border border-zinc-800">
              Unread emails: 142 • Slack notifications: 18
            </div>
            <span className="text-xs font-mono text-zinc-600 mt-3">
              Silent, lonely screen staring back at you.
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-600 border-t border-zinc-800 pt-3 min-w-[340px]">
            <span>Cognitive strain: HIGH</span>
            <span className="text-rose-500">Exhaustion: 99%</span>
          </div>
        </div>

        {/* Interactive Draggable Handle */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute inset-y-0 -ml-4 w-8 flex flex-col items-center justify-center z-20 pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full bg-honey text-espresso border-2 border-espresso flex items-center justify-center font-arcade text-xs font-bold shadow-pixel">
            ↔
          </div>
        </div>
      </div>
    </section>
  );
}
