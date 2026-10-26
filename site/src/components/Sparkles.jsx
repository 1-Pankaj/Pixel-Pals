import React, { useRef, useEffect } from 'react';

/**
 * Aceternity UI — Sparkles Core
 * Canvas-based particle sparkles effect with smooth twinkle and gentle float.
 */
export function SparklesCore({
  id = 'tsparticles',
  background = 'transparent',
  minSize = 0.6,
  maxSize = 2.4,
  particleDensity = 80,
  className = '',
  particleColor = '#fab387',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let w = (canvas.width = canvas.parentElement.offsetWidth);
    let h = (canvas.height = canvas.parentElement.offsetHeight);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const count = Math.floor((w * h) / (10000 / (particleDensity / 10)));
    const particles = [];
    const colors = [particleColor, '#ffd76e', '#ffffff', '#f5c2e7'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: minSize + Math.random() * (maxSize - minSize),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.45,
        alpha: Math.random(),
        fadeSpeed: 0.005 + Math.random() * 0.015,
        fadingIn: Math.random() > 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        if (p.fadingIn) {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 1) {
            p.alpha = 1;
            p.fadingIn = false;
          }
        } else {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.1) {
            p.alpha = 0.1;
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
      });

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
