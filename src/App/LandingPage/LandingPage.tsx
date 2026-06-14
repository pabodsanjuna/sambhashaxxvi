import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Legacy } from './components/Legacy';
import { Categories } from './components/Categories';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { Bg } from '@/components/Bg';

export function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Bg>
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      <main className={`w-full min-h-screen text-sepia-100 flex flex-col font-sans selection:bg-sepia-800/50 selection:text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Hero isLoaded={isLoaded} />
        <div className="relative z-10 w-full bg-black/40 backdrop-blur-sm">
          <Legacy />
          <Categories />
          <CallToAction />
          <Footer />
        </div>
      </main>
    </Bg>
  );
}
