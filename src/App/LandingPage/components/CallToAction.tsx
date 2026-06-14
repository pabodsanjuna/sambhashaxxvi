import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function CallToAction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    // Advanced scale and fade effect that makes the text feel like it's emerging
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1
      }
    });

    tl.fromTo('.cta-glow', 
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1 }
    );

    gsap.fromTo('.cta-content',
      { opacity: 0, scale: 0.8, y: 100 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.cta-content',
          start: 'top 85%',
        }
      }
    );
    
    // Parallax text
    gsap.to('.cta-text', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full flex flex-col items-center py-32 md:py-48 px-4 relative overflow-hidden">
      {/* Background radial gradient simulating light behind text */}
      <div className="cta-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sepia-600/10 blur-[120px] pointer-events-none rounded-[100%]" />

      <div className="cta-content flex flex-col items-center max-w-4xl w-full text-center relative z-10 cta-text">
        <p className="font-cinzel text-sm md:text-base text-sepia-400 tracking-[0.3em] uppercase mb-8">
          The Stage Awaits
        </p>
        <h2 className="font-cinzel text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-sepia-100 to-sepia-400 mb-12 uppercase leading-tight">
          Will Your School <br /> Claim The Stage?
        </h2>
        
        <p className="font-cinzel text-sm md:text-lg text-sepia-300 tracking-widest leading-loose max-w-3xl mb-16 uppercase">
          Sambhasha XXVI is calling the next generation of Sri Lanka's Media Leaders. Register your school, form your team, and compete for glory.
        </p>

        <button onClick={() => navigate('/sing-up')} className="cursor-pointer px-12 py-4 border border-sepia-500/50 bg-black/40 backdrop-blur-md rounded-full font-cinzel text-sepia-100 tracking-widest text-sm hover:bg-sepia-800/80 hover:border-sepia-300 transition-all duration-300 shadow-[0_0_20px_rgba(200,121,64,0.1)] hover:shadow-[0_0_40px_rgba(200,121,64,0.4)]">
          REGISTER NOW
        </button>
      </div>
    </section>
  );
}
