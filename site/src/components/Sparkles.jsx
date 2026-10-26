import React, { useRef, useEffect } from 'react';

/**
 * Aceternity UI — Sparkles Core
 * Exact implementation matching the official Aceternity Sparkles showcase.
 */
export function SparklesCore({
  id = 'tsparticles',
  background = 'transparent',
  minSize = 0.4,
  maxSize = 1.4,
  particleDensity = 600,
  className = '',
  particleColor = '#FFFFFF',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const parent = canvas.parentElement || canvas;
    let w = (canvas.width = parent.offsetWidth || 600);
    let h = (canvas.height = parent.offsetHeight || 200);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    // Number of sparkles based on density
    const count = Math.min(300, Math.max(60, Math.floor((w * h) / (10000 / (particleDensity / 15)))));
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: minSize + Math.random() * (maxSize - minSize),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.35,
        alpha: Math.random(),
        fadeSpeed: 0.008 + Math.random() * 0.02,
        fadingIn: Math.random() > 0.5,
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
        ctx.fillStyle = particleColor;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = particleColor;
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
  }, [minSize, maxSize, particleDensity, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ background }}
    />
  );
}

/**
 * The Exact Aceternity Sparkles Hero Header with Laser Beam
 */
export function AceternityHeroSparkles({ title = "Pixel Pals", subtitle = "Your Tiny Desktop Bestie" }) {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden pt-6">
      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black text-center text-white tracking-tight relative z-20">
        {title}
      </h1>

      {/* The Signature Laser Beam + Sparkles Arc */}
      <div className="w-[44rem] max-w-full h-36 relative mt-1">
        {/* Glowing laser beams */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-56 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[4px] w-1/3 blur-sm" />
        <div className="absolute inset-x-56 top-0 bg-gradient-to-r from-transparent via-sky-300 to-transparent h-px w-1/3" />

        {/* Dense Sparkle particles */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={800}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial mask forming the cosmic hemisphere dome */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_160px_at_top,transparent_20%,white)] pointer-events-none" />
      </div>
    </div>
  );
}
