import React from 'react';
import { motion } from 'framer-motion';

/**
 * Aceternity UI — Signature Lamp Effect
 * Conical light sources meeting in the center to cast radiant golden ambient light.
 */
export function LampContainer({ children, className = "" }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden w-full z-0 ${className}`}
    >
      <div className="relative flex w-full flex-1 scale-y-110 items-center justify-center isolate z-0">
        {/* Left Conic Lamp */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-honey via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-transparent h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right Conic Lamp */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-honey text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-transparent h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Center Radiant Core Glow */}
        <div className="absolute top-1/2 h-48 w-full translate-y-10 scale-x-150 blur-3xl opacity-30 bg-honey" />
        <div className="absolute top-1/2 z-50 h-40 w-80 -translate-y-1/2 rounded-full bg-honey/40 blur-3xl" />
        <div className="absolute inset-auto z-50 h-32 w-[24rem] -translate-y-[5rem] rounded-full bg-coral/30 blur-2xl" />

        {/* Central Laser Beam Line */}
        <motion.div
          initial={{ width: "14rem" }}
          whileInView={{ width: "28rem" }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-0.5 w-[28rem] -translate-y-[6rem] bg-gradient-to-r from-transparent via-honey to-transparent"
        />

        {/* Secondary Coral Beam Line */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "18rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-40 h-1 w-[18rem] -translate-y-[6rem] bg-gradient-to-r from-transparent via-coral to-transparent blur-xs"
        />
      </div>

      <div className="relative z-50 flex flex-col items-center px-4 w-full">
        {children}
      </div>
    </div>
  );
}
