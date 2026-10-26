import React, { useEffect, useState, useRef } from 'react';
import { PixelMessage, PixelHeart, PixelMusic, PixelShield } from './PixelIcons';
import { motion } from 'framer-motion';

function Counter({ end, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startT = null;
    const step = (t) => {
      if (!startT) startT = t;
      const progress = Math.min((t - startT) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return (
    <span ref={ref} className="font-heading text-4xl sm:text-5xl font-black text-espresso dark:text-cream tracking-tight">
      {val.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsTicker() {
  const stats = [
    {
      icon: PixelMessage,
      number: 2507,
      suffix: '+',
      label: 'Warm Dialogues',
      desc: 'Morning greetings, cozy life advice, funny animal trivia & friendly check-ins',
      color: 'bg-coral text-white',
    },
    {
      icon: PixelHeart,
      number: 6,
      suffix: ' Pals',
      label: 'Unique Companions',
      desc: 'Mochi, Biscuit, Pudding, Luna, Clover & Miso — each with unique sound synthesis',
      color: 'bg-honey text-espresso',
    },
    {
      icon: PixelMusic,
      number: 0,
      suffix: ' Audio Lag',
      label: 'Pure WebAudio',
      desc: 'Live synthesized sound chip creates soft animalese babbles with zero storage waste',
      color: 'bg-mint text-espresso',
    },
    {
      icon: PixelShield,
      number: 100,
      suffix: '%',
      label: 'Private & Offline',
      desc: 'Zero telemetry, zero user accounts, zero bloat. Runs purely on your device',
      color: 'bg-sky text-espresso',
    }
  ];

  return (
    <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="retro-card-light dark:retro-card-dark p-7 flex flex-col items-center text-center group"
            >
              <div className={`p-3.5 rounded-2xl ${s.color} border-2 border-espresso mb-4 shadow-pixel-soft`}>
                <Icon className="w-6 h-6" />
              </div>
              <Counter end={s.number} suffix={s.suffix} />
              <span className="text-lg font-bold text-espresso dark:text-honey mt-2 font-pixel">
                {s.label}
              </span>
              <span className="text-sm text-espresso-muted dark:text-cocoa-muted mt-2 leading-relaxed">
                {s.desc}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
