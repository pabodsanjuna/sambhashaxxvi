import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax background
    gsap.to('.cat-bg', {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Heading animation
    gsap.fromTo('.cat-heading',
        { opacity: 0, y: 50, scale: 0.9 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 75%',
            }
        }
    );

    // Staggered 3D reveal for category cards
    gsap.fromTo('.category-card',
      { opacity: 0, y: 150, rotateX: 15, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.categories-grid',
          start: 'top 85%',
        }
      }
    );
  }, { scope: containerRef });

  const categories = [
    { title: "Rules & Regulations", type: "PDF Document" },
    { title: "Category Details", type: "PDF Document" },
    { title: "How To Register", type: "PDF Document" }
  ];

  return (
    <section ref={containerRef} className="w-full flex flex-col items-center py-32 px-4 relative">
      <div className="cat-bg absolute top-[30%] left-[50%] -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-sepia-900/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="cat-heading flex flex-col items-center max-w-6xl w-full mb-16 relative z-10">
        <h3 className="font-cinzel text-3xl md:text-5xl text-sepia-200 tracking-[0.15em] uppercase text-center mb-4 leading-tight">
          Everything You Need To Compete
        </h3>
        <p className="font-cinzel text-xs md:text-sm text-sepia-400 tracking-[0.15em] uppercase text-center">
          Download the official competition documents and prepare your team for the stage.
        </p>
      </div>

      <div className="categories-grid grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {categories.map((cat, i) => (
          <div key={i} className="category-card flex flex-col items-center group">
            {/* Dark Card */}
            <div className="w-full aspect-[3/4] bg-[#1a1412] border border-sepia-900 rounded-3xl mb-8 flex flex-col items-center justify-center p-8 transition-all duration-500 hover:border-sepia-600 hover:shadow-[0_0_30px_rgba(200,121,64,0.1)] hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-sepia-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 border border-sepia-800 rounded-full flex items-center justify-center mb-6 group-hover:border-sepia-500 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sepia-400 group-hover:text-sepia-200">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </div>
              <h4 className="font-cinzel text-xl text-sepia-200 text-center tracking-widest mb-2 z-10">{cat.title}</h4>
              <p className="font-montserrat text-sm text-sepia-500 uppercase tracking-widest z-10">{cat.type}</p>
            </div>
            
            {/* Button */}
            <button className="px-10 py-3 border border-sepia-500/50 bg-black/40 backdrop-blur-md rounded-full font-cinzel text-sepia-300 tracking-widest text-xs hover:bg-sepia-800/60 hover:text-white hover:border-sepia-400 transition-all duration-300 shadow-[0_0_15px_rgba(200,121,64,0.05)] hover:shadow-[0_0_20px_rgba(200,121,64,0.2)]">
              DOWNLOAD NOW
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
