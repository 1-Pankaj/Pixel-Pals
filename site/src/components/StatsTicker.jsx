import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Users, Volume2, ShieldCheck } from 'lucide-react';

function Counter({ end, suffix = '', duration = 1500 }) {
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
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return (
    <span ref={ref} className="font-pixel text-3xl sm:text-4xl font-bold text-white tracking-wide">
      {val.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsTicker() {
  const stats = [
    {
      icon: MessageSquare,
      number: 2507,
      suffix: '+',
      label: 'Hand-authored lines',
      desc: 'Time-aware quips, jokes, stories & trivia',
      color: 'text-peach'
    },
    {
      icon: Users,
      number: 6,
      suffix: ' Pals',
      label: 'Unique buddies',
      desc: 'Cats, Shiba, Slime, Ghost, Bunny, Axolotl',
      color: 'text-gold'
    },
    {
      icon: Volume2,
      number: 0,
      suffix: ' MB',
      label: 'Audio assets',
      desc: '100% WebAudio real-time synthesized sound',
      color: 'text-sky'
    },
    {
      icon: ShieldCheck,
      number: 100,
      suffix: '%',
      label: 'Local & private',
      desc: 'No servers, accounts, or analytics',
      color: 'text-mint'
    }
  ];

  return (
    <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#0e0f1b]/90 border border-card-border p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl shadow-black/40">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center p-3">
              <div className={`p-2.5 rounded-xl bg-[#161729] ${s.color} mb-3 shadow-inner border border-card-border/50`}>
                <Icon className="w-5 h-5" />
              </div>
              <Counter end={s.number} suffix={s.suffix} />
              <span className="text-sm font-mono text-white mt-1 font-semibold">{s.label}</span>
              <span className="text-xs text-subtext mt-1">{s.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
