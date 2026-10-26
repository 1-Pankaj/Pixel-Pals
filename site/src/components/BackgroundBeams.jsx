import React from 'react';

/**
 * Aceternity UI — Background Beams
 * Animated flowing ambient light beams that fill background depth.
 */
export function BackgroundBeams({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-60 transition-opacity ${className}`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.6">
          <path
            d="M-200 150 C 300 100, 600 400, 1600 200"
            stroke="url(#beam-gradient-1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-100 450 C 400 350, 800 650, 1600 500"
            stroke="url(#beam-gradient-2)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M0 750 C 500 600, 900 800, 1600 700"
            stroke="url(#beam-gradient-1)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M300 -100 C 500 400, 700 600, 1000 1100"
            stroke="url(#beam-gradient-3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <defs>
          <linearGradient id="beam-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd76e" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffd76e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff6d8a" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="beam-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ed6a0" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffd76e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="beam-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6d8a" stopOpacity="0" />
            <stop offset="50%" stopColor="#cbb2fe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffd76e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
