import React from 'react';

/**
 * Beautiful, reliable, handcrafted SVG icons.
 * Crisp geometry, zero distortion, perfectly centered viewBox="0 0 24 24".
 */

export function PixelHeart({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function PixelStar({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function PixelSparkle({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="18" r="1.5" />
    </svg>
  );
}

export function PixelDownload({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function PixelGithub({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function PixelCookie({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="8" r="1.5" fill="#3a2b20" />
      <circle cx="15" cy="10" r="1.5" fill="#3a2b20" />
      <circle cx="10" cy="15" r="1.5" fill="#3a2b20" />
      <circle cx="15" cy="15" r="1.5" fill="#3a2b20" />
    </svg>
  );
}

export function PixelMusic({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

export function PixelEye({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export function PixelShield({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
    </svg>
  );
}

export function PixelZap({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function PixelSun({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function PixelMoon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function PixelCheck({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function PixelVolume({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export function PixelVolumeMute({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export function PixelCoffee({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M2 19h18v2H2zM20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3z" />
    </svg>
  );
}

export function PixelMessage({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
    </svg>
  );
}

export function PixelChevronDown({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function PixelClose({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PixelMenu({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function PixelSmile({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  );
}

export function PixelClock({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
    </svg>
  );
}

export function PixelWind({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block shrink-0 ${className}`} {...props}>
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}
