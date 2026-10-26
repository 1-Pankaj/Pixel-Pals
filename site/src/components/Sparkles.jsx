import React, { useRef, useEffect } from 'react';
import { useTheme } from '../lib/theme';

/**
 * Aceternity UI — Sparkles Core with Theme Awareness
 * Canvas-based particle sparkles that automatically adapt to light/dark modes.
 */
export function SparklesCore({
  id = 'tsparticles',
  minSize = 0.5,
  maxSize = 1.6,
  particleDensity = 400,
  className = '',
  particleColor,
}) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  const color = particleColor || (isDark ? '#ffd76e' : '#e5be50');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const parent = canvas.parentElement || canvas;
    let w = (canvas.width = parent.offsetWidth || 600);
    let h = (canvas.height = parent.offsetHeight || 180);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const count = Math.min(220, Math.max(50, Math.floor((w * h) / (10000 / (particleDensity / 15)))));
    const particles = [];

    // Warm palette sparkles
    const colors = isDark 
      ? ['#ffd76e', '#ff8ca3', '#ffffff', '#7ed6a0'] 
      : ['#b0793f', '#ff6d8a', '#e5be50', '#5dbb82'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: minSize + Math.random() * (maxSize - minSize),
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.4,
        alpha: Math.random(),
        fadeSpeed: 0.008 + Math.random() * 0.02,
        fadingIn: Math.random() > 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.fadingIn) {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 1) {
            p.alpha = 1;
            p.fadingIn = false;
          }
        } else {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.05) {
            p.alpha = 0.05;
            p.fadingIn = true;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 2.5;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, [minSize, maxSize, particleDensity, color, isDark]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}

/**
 * Aceternity Sparkles Arc with Laser Beam
 * Styled cleanly with warm app colors and guaranteed zero overlapping over subtitles!
 */
export function AceternityHeroSparkles({ title = "Pixel Pals" }) {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden pt-2">
      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black text-center tracking-tight relative z-20 text-espresso dark:text-cream select-none drop-shadow-sm">
        {title}
      </h1>

      {/* The Signature Laser Beam + Sparkles Arc */}
      <div className="w-[42rem] max-w-full h-24 relative mt-2 pointer-events-none [mask-image:radial-gradient(350px_120px_at_top,transparent_0%,white_10%,white_90%,transparent_100%)]">
        {/* Glowing laser beams matching honey & coral */}
        <div className="absolute inset-x-12 top-0 bg-gradient-to-r from-transparent via-honey to-transparent h-[2px] w-4/5 mx-auto blur-sm" />
        <div className="absolute inset-x-12 top-0 bg-gradient-to-r from-transparent via-honey to-transparent h-px w-4/5 mx-auto" />
        <div className="absolute inset-x-32 top-0 bg-gradient-to-r from-transparent via-coral to-transparent h-[3px] w-1/2 mx-auto blur-sm" />
        <div className="absolute inset-x-32 top-0 bg-gradient-to-r from-transparent via-coral to-transparent h-px w-1/2 mx-auto" />

        {/* Dense Sparkle particles */}
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.8}
          particleDensity={600}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
