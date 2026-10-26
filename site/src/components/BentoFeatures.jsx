import React, { useState, useEffect } from 'react';
import { Eye, MousePointerClick, HeartHandshake, Wind, Timer, Compass } from 'lucide-react';

export function BentoFeatures() {
  // Breathing animation phase
  const [breathePhase, setBreathePhase] = useState('Inhale');
  const [breatheCount, setBreatheCount] = useState(4);

  useEffect(() => {
    const phases = ['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathePhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="relative py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono text-peach uppercase tracking-widest block mb-2">
          Engineered With Care
        </span>
        <h2 className="text-3xl sm:text-4xl font-pixel font-bold text-white tracking-wide">
          Built for Everyday Focus & Joy
        </h2>
        <p className="mt-3 text-subtext text-sm sm:text-base font-sans">
          No cloud connections, no CPU hogging. Every detail from GPU-composited bubble anchors to DPR scaling was designed to make Pixel Pals feel like a native desktop friend.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Forward Click Pass-Through (2 Cols) */}
        <div className="md:col-span-2 bg-[#121320] border border-card-border hover:border-peach/40 transition-all duration-300 rounded-3xl p-7 relative overflow-hidden group shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-peach/15 text-peach border border-peach/20">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pixel text-xl font-bold text-white">Always-On-Top, Never in Your Way</h3>
              <span className="text-xs font-mono text-subtext">Zero-obstruction click pass-through</span>
            </div>
          </div>
          <p className="text-sm font-sans text-subtext/90 max-w-lg mb-6 leading-relaxed">
            The pet floats above everything, but uses forward click-routing. You can type, select code, or browse web pages directly through the transparent regions—clicks only register when touching the pet or its active choice bubbles.
          </p>
          {/* Visual simulation mockup */}
          <div className="bg-[#0b0c14] border border-card-border/70 rounded-2xl p-4 font-mono text-xs text-subtext/70 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-card-border/50 text-[10px]">
              <span>// Your active workspace</span>
              <span className="text-mint font-bold">✓ Clicks pass right through</span>
            </div>
            <div className="space-y-1">
              <p className="text-sky/80">const <span className="text-gold">companion</span> = <span className="text-peach">new</span> PixelPal('mochi');</p>
              <p className="text-subtext/60">companion.alwaysOnTop = <span className="text-mint">true</span>;</p>
              <p className="text-subtext/60">companion.forwardMouseEvents = <span className="text-mint">true</span>; <span className="text-subtext/40">// Zero drag lag</span></p>
            </div>
          </div>
        </div>

        {/* Card 2: 4-4-4 Guided Breathing */}
        <div className="bg-[#121320] border border-card-border hover:border-sky/40 transition-all duration-300 rounded-3xl p-7 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-sky/15 text-sky border border-sky/20">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xl font-bold text-white">4-4-4 Breathing</h3>
            </div>
            <p className="text-xs sm:text-sm font-sans text-subtext/90 leading-relaxed mb-6">
              When work gets overwhelming, press <code className="text-sky bg-[#18192a] px-1.5 py-0.5 rounded font-mono">Alt+Shift+E</code>. Your pet inflates and deflates to guide a calming 1-minute reset.
            </p>
          </div>
          {/* Interactive pulsating circle */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#0b0c14] rounded-2xl border border-card-border/60">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className={`absolute inset-0 rounded-full bg-sky/20 border border-sky/40 transition-all duration-1000 ${
                breathePhase.startsWith('Inhale') ? 'scale-125' : breathePhase.startsWith('Hold') ? 'scale-125 animate-pulse' : 'scale-90'
              }`} />
              <span className="relative z-10 text-xs font-mono font-bold text-sky">{breathePhase}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Eye Tracking */}
        <div className="bg-[#121320] border border-card-border hover:border-gold/40 transition-all duration-300 rounded-3xl p-7 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gold/15 text-gold border border-gold/20">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xl font-bold text-white">Eye Tracking</h3>
            </div>
            <p className="text-xs sm:text-sm font-sans text-subtext/90 leading-relaxed mb-6">
              Eyes dynamically calculate angular offset from mouse coordinates across any screen display—even when another application has focus.
            </p>
          </div>
          <div className="p-3 bg-[#0b0c14] rounded-2xl border border-card-border/60 font-mono text-xs text-center text-gold flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 animate-spin text-gold" style={{ animationDuration: '6s' }} />
            <span>Multi-Monitor Polling</span>
          </div>
        </div>

        {/* Card 4: Fling Physics */}
        <div className="bg-[#121320] border border-card-border hover:border-rose/40 transition-all duration-300 rounded-3xl p-7 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose/15 text-rose border border-rose/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xl font-bold text-white">Fling Physics</h3>
            </div>
            <p className="text-xs sm:text-sm font-sans text-subtext/90 leading-relaxed mb-6">
              Pick up your pet and fling them across the desktop. Velocity vectors calculate momentum with gravitational drop and screen-edge bounce.
            </p>
          </div>
          <div className="p-3 bg-[#0b0c14] rounded-2xl border border-card-border/60 font-mono text-xs text-center text-rose">
            <span>Momentum • Elastic Collision</span>
          </div>
        </div>

        {/* Card 5: Main-Process Pomodoro */}
        <div className="bg-[#121320] border border-card-border hover:border-mint/40 transition-all duration-300 rounded-3xl p-7 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-mint/15 text-mint border border-mint/20">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xl font-bold text-white">Focus Sessions</h3>
            </div>
            <p className="text-xs sm:text-sm font-sans text-subtext/90 leading-relaxed mb-6">
              15, 25, and 50-minute Pomodoro timers run in Electron's main process, keeping time accurately even if windows reload.
            </p>
          </div>
          <div className="p-3 bg-[#0b0c14] rounded-2xl border border-card-border/60 font-mono text-xs text-center text-mint">
            <span>25:00 Focus • Chime Celebrations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
