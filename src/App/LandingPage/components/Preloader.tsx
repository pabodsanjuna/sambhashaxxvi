import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    let obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.innerHTML = `${Math.floor(obj.val)}%`;
        }
        if (progressRef.current) {
           progressRef.current.style.width = `${obj.val}%`;
        }
      }
    }, 0);

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 4.0);

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_center,#1e1815_0%,#0d0a08_100%)] text-[#f5f5f5] font-bruney overflow-hidden"
    >
      <div className="text-center z-10 cinematic-loader-zoom">
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-normal tracking-[2px] text-[#e8e6e3] mb-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] cinematic-loader-glow" style={{ fontVariantLigatures: 'common-ligatures discretionary-ligatures', fontFeatureSettings: '"liga" 1, "dlig" 1' }}>
          sambhasha<span className="text-[#b3916b] font-sans font-light text-2xl lg:text-[2rem] align-super ml-2">2026</span>
        </h1>
        <p className="font-sans text-[0.7rem] tracking-[10px] text-[#8a7d72] mb-10 opacity-0 cinematic-loader-subtitle uppercase">
          AWAIT THE EXPERIENCE
        </p>
        
        <div className="w-[300px] h-[1px] bg-white/5 mx-auto relative overflow-hidden">
          <div ref={progressRef} className="h-full w-0 bg-[#b3916b] shadow-[0_0_10px_#b3916b]" />
        </div>
        
        <div ref={numberRef} className="mt-5 font-mono text-[0.9rem] text-[#8a7d72] tracking-[2px]">
          0%
        </div>
      </div>
      
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] shadow-[inset_0_0_150px_rgba(10,7,5,0.95)]" />
    </div>
  );
}
