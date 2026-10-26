import React from 'react';

/**
 * Magic UI — Retro Grid
 * Perspective angled grid background with subtle glow and opacity fade.
 */
export function RetroGrid({ className = '', angle = 65 }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-30 [perspective:200px] ${className}`}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          style={{ '--grid-angle': `${angle}deg` }}
          className="animate-grid [background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw] [background-image:linear-gradient(to_right,rgba(250,179,135,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(250,179,135,0.15)_1px,transparent_0)]"
        />
      </div>

      {/* Radial fade mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-[#090a10]/80" />
    </div>
  );
}
