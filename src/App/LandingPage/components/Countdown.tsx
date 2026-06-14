import React, { useEffect, useState } from 'react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Using previous logic for counting down
    const targetDate = new Date('2026-06-19T00:00:00').getTime();

    const timerId = setInterval(() => {
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
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="font-cinzel text-sm tracking-[0.25em] text-sepia-200 uppercase">
        Registration Close In
      </h3>
      <div className="flex items-center space-x-2 font-cinzel lg:text-5xl text-3xl text-sepia-100 tracking-wider">
        <span>{pad(timeLeft.days)}</span>
        <span className="text-sepia-400">:</span>
        <span>{pad(timeLeft.hours)}</span>
        <span className="text-sepia-400">:</span>
        <span>{pad(timeLeft.minutes)}</span>
        <span className="text-sepia-400">:</span>
        <span>{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
