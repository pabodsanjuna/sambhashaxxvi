import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Legacy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax scrolling for text and background elements
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    tl.to('.parallax-bg', { y: -200, ease: 'none' }, 0);
    
    // Staggered reveal for section headers
    gsap.fromTo('.reveal-heading',
        { opacity: 0, y: 100, scale: 0.95 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1.5, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
            }
        }
    );

    // Zoom-in effect for the content box as user scrolls into it
    gsap.fromTo('.info-box',
      { opacity: 0, y: 150, scale: 0.9, rotateX: 10 },
      {
        opacity: 1, 
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.info-box',
          start: 'top 85%',
        }
      }
    );

    // Parallax and zoom on the video box
    gsap.fromTo('.video-box', 
      { scale: 0.8, opacity: 0, y: 100 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.video-section',
          start: 'top 85%',
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center py-20 px-4 mt-20 md:mt-32">
      {/* Decorative Parallax Background Elements */}
      <div className="parallax-bg absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-sepia-900/5 rounded-full blur-[100px]" />
         <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-sepia-600/5 rounded-full blur-[120px]" />
      </div>

      {/* 20 Years of Legacy */}
      <section className="flex flex-col items-start md:items-center w-full max-w-5xl mb-32 relative z-10">
        <h2 className="reveal-heading font-cinzel text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-sepia-300 via-white to-sepia-300 mb-2 uppercase tracking-wide">
          <span className="font-bruney capitalize">20</span> Years Of <span className="font-bruney capitalize">Legacy</span>
        </h2>
        <p className="reveal-heading font-montserrat text-lg md:text-xl xl:text-2xl text-sepia-100 tracking-wide font-light md:text-center mt-2">
          The premium media event in Sri Lankan School Media
        </p>
      </section>

      {/* Sri Lanka's Most Prestigious */}
      <section className="flex flex-col items-center w-full max-w-6xl mb-32 relative z-10">
        <h3 className="reveal-heading font-cinzel text-2xl md:text-4xl text-sepia-200 tracking-[0.2em] uppercase text-center mb-12">
          Sri Lanka's Most Prestigious<br className="hidden md:block"/> Media Stage
        </h3>
        
        <div className="info-box relative w-full border border-sepia-800 rounded-3xl p-8 md:p-16 bg-black/20 backdrop-blur-md overflow-hidden group hover:border-sepia-600/80 transition-colors duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] [transform-style:preserve-3d]">
          {/* Subtle gradient glow inside the box */}
          <div className="absolute inset-0 bg-gradient-to-b from-sepia-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />
          
          <div className="relative font-cinzel text-sm md:text-base lg:text-sm xl:text-base text-sepia-300 text-center tracking-wider leading-relaxed space-y-6">
            <p>
              SAMBHASHA XXVI IS THE PINNACLE OF SRI LANKA'S YOUTH MEDIA LANDSCAPE — AN ANNUAL INTER-SCHOOL COMPETITION AND GALA ORGANIZED BY THE NALANDA COLLEGE COMMUNICATION UNIT (NCCU STUDIOS).
            </p>
            <p>
              SINCE ITS INCEPTION IN 2006, SAMBHASHA HAS NURTURED GENERATIONS OF JOURNALISTS, BROADCASTERS, FILMMAKERS, AND COMMUNICATORS. TODAY, ON ITS 26TH EDITION, IT STANDS AS A MONUMENT TO 20 YEARS OF UNBROKEN EXCELLENCE, CREATIVITY, AND THE RELENTLESS PURSUIT OF MEDIA MASTERY.
            </p>
            <p>
              COMPETITORS FROM THE NATION'S LEADING SCHOOLS BATTLE ACROSS CATEGORIES SPANNING TELEVISION, RADIO, PRINT JOURNALISM, PHOTOGRAPHY, AND DIGITAL MEDIA — JUDGED BY SRI LANKA'S FINEST MEDIA PROFESSIONALS.
            </p>
          </div>
        </div>
      </section>

      {/* Previous Year Highlights */}
      <section className="reveal-section video-section flex flex-col items-center w-full max-w-6xl">
        <h3 className="font-cinzel text-3xl md:text-4xl text-sepia-200 tracking-[0.2em] uppercase text-center mb-4">
          Previous Year Highlights
        </h3>
        <p className="font-cinzel text-xs md:text-sm text-sepia-400 tracking-[0.15em] uppercase text-center mb-12">
          Relive the defining moments that shaped Sri Lanka's Media Generation.
        </p>

        <div className="video-box w-full aspect-video bg-[#1a1412] rounded-3xl border border-sepia-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden relative cursor-pointer group">
          {/* Play Button Indicator */}
          <div className="absolute w-20 h-20 rounded-full border border-sepia-500/50 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 z-10 box-shadow-[0_0_20px_rgba(200,121,64,0.2)]">
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-sepia-200 border-b-[12px] border-b-transparent ml-2 group-hover:border-l-white transition-colors" />
          </div>
          
          {/* Subtle animated gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-sepia-900/20 to-black opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
        </div>
      </section>

    </div>
  );
}
