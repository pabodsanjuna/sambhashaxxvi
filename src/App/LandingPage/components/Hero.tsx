import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Countdown } from './Countdown';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const BG_URL = "https://res.cloudinary.com/djflc091n/image/upload/v1781470200/SAMBHASHA_XXVI_pstfst.jpg";

export function Hero({ isLoaded = true }: { isLoaded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !bgRef.current || !contentRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      gsap.to(bgRef.current, {
        x: x * -30,
        y: y * -30,
        rotateX: y * 5,
        rotateY: x * -5,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 2
      });

      gsap.to(contentRef.current, {
        x: x * 20,
        y: y * 20,
        rotateX: y * -3,
        rotateY: x * 3,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 2
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (isLoaded) {
      // Initial load animation
      gsap.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(bgRef.current,
        { scale: 1.15, filter: "brightness(0)" },
        { scale: 1.1, filter: "brightness(1)", duration: 2.5, ease: "power2.inOut" }
      );
    }

    // Scroll parallax animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1 // smooth scrubbing
      }
    });

    // Zoom out background
    tl.to(bgRef.current, {
      scale: 1.05,
      filter: "brightness(0.3) blur(6px)",
      ease: "none"
    }, 0);

    // Parallax top content up and fade out
    tl.to('.hero-top-content', {
      y: -200,
      opacity: -0.5,
      scale: 0.9,
      ease: "none"
    }, 0);

    // Timeline for the bottom content (button + countdown)
    const bottomTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-bottom-content",
        start: "top 95%", // Start fading in when it enters the viewport
        end: "bottom 10%", // Fade out when it leaves the upper part of the viewport
        scrub: 1
      }
    });

    bottomTl.fromTo('.hero-bottom-content', 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "none" }
    )
    .to('.hero-bottom-content', { opacity: 1, duration: 0.6 })
    .to('.hero-bottom-content', { opacity: 0, y: -40, scale: 0.95, duration: 0.2, ease: "none" });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, { scope: containerRef, dependencies: [isLoaded] });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[100svh] overflow-hidden flex flex-col items-center justify-center p-4 py-5 lg:py-10"
    >
      {/* Background with 3D transform */}
      <div 
        ref={bgRef}
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 [transform-style:preserve-3d] origin-center"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />

      {/* Theme Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-[#231c17]/60 to-black/80 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5c4b3f]/40 via-transparent to-transparent z-0 pointer-events-none" />
      
      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,10,7,0.8)_80%,rgba(15,10,7,1)_100%)] z-0 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark z-0 pointer-events-none" />

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center [transform-style:preserve-3d] w-full max-w-4xl pointer-events-none min-h-[85vh] md:min-h-screen py-10 md:py-16"
      >
        <div className="hero-top-content flex flex-col items-center">
          <img 
            src="https://res.cloudinary.com/djflc091n/image/upload/v1781470197/download_jpihh9.png" 
            alt="NCCU Logo" 
            className="w-20 md:w-28 mb-4 md:mb-6 drop-shadow-2xl pointer-events-auto"
          />
          
          <h1 className="font-bruney text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-sepia-100 to-sepia-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-2 tracking-widest pointer-events-auto lowercase" style={{ fontVariantLigatures: 'common-ligatures discretionary-ligatures', fontFeatureSettings: '"liga" 1, "dlig" 1' }}>
            sambhasha xxvi
          </h1>
          
          <p className="font-cinzel text-base md:text-xl lg:text-2xl text-sepia-200 tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-auto mt-2 md:mt-4 drop-shadow-md pointer-events-auto lowercase" style={{ fontVariantLigatures: 'common-ligatures discretionary-ligatures', fontFeatureSettings: '"liga" 1, "dlig" 1' }}>
            the media competition & day
          </p>
        </div>

        {/* Empty space that flexes responsively to push content down */}
        <div className="flex-1 w-full min-h-[9.5rem] md:min-h-[12rem] lg:min-h-[12rem]" />

        <div className="hero-bottom-content flex flex-col items-center w-full opacity-0 ">
          <button onClick={() => navigate('/sign-up')} className="cursor-pointer px-8 mt-10 md:mt-20 md:px-10 py-3 border border-sepia-500/50 bg-black/40 backdrop-blur-md rounded-full font-cinzel text-sepia-100 tracking-widest text-xs md:text-sm hover:bg-sepia-800/60 hover:border-sepia-400 transition-all duration-300 mb-6 md:mb-10 shadow-[0_0_20px_rgba(200,121,64,0.1)] hover:shadow-[0_0_30px_rgba(200,121,64,0.3)] pointer-events-auto">
            REGISTER NOW
          </button>

          <div className="pointer-events-auto shrink-0 mb-4 md:mb-8">
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
}
