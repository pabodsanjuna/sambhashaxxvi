import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { VintageBackground } from '@/components/VintageBackground';

export function LandingPage() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: June 7th 2026 (Sunday)
    const targetDate = new Date('2026-06-19T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <VintageBackground />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center mt-[-10vh]">
        
        {/* Logo / Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col items-center"
        >
          <p className="text-[10px] md:text-xs tracking-[0.4em] font-medium text-zinc-400 uppercase mb-4">
            Sambhasha XXVI
          </p>
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-modern)] font-bold tracking-widest text-[#e8e8e8] uppercase mb-4">
            Under Maintenance
          </h1>
          <p className="text-zinc-500 max-w-md text-sm md:text-base font-light leading-relaxed">
            We are preparing the systems for the main event. We will be back online shortly.
          </p>
        </motion.div>

        {/* Minimalist Countdown */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full flex justify-center"
        >
          <div className="flex gap-4 sm:gap-12 md:gap-16">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-[family-name:var(--font-modern)] font-bold text-[#e8e8e8] tracking-widest mb-2 tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-[9px] sm:text-[10px] font-medium text-zinc-500 uppercase tracking-[0.3em]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
