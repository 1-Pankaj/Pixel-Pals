import React, { useEffect, useState, useRef } from 'react';
import { MessageSquareHeart, PawPrint, Music4, ShieldCheck } from 'lucide-react';

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
    <span ref={ref} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
      {val.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsTicker() {
  const stats = [
    {
      icon: MessageSquareHeart,
      number: 2507,
      suffix: '+',
      label: 'Unique Things to Say',
      desc: 'Friendly morning greetings, cozy stories, knock-knock jokes & trivia',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10'
    },
    {
      icon: PawPrint,
      number: 6,
      suffix: ' Buddies',
      label: 'Handmade Pals',
      desc: 'Each with their own funny personality and cute little voice',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      icon: Music4,
      number: 0,
      suffix: ' MB',
      label: 'Audio Files',
      desc: 'Lightweight sound engine that synthesizes soft purrs & chimes live',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10'
    },
    {
      icon: ShieldCheck,
      number: 100,
      suffix: '%',
      label: 'Free Forever',
      desc: 'No logins, no telemetry, no tracking. Runs completely offline',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#0c0d14] border border-[#1f2030] shadow-xl hover:border-zinc-700 transition"
            >
              <div className={`p-3.5 rounded-2xl ${s.bg} ${s.color} mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <Counter end={s.number} suffix={s.suffix} />
              <span className="text-lg font-bold text-white mt-2 font-heading">{s.label}</span>
              <span className="text-sm text-zinc-400 mt-1 leading-snug">{s.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
