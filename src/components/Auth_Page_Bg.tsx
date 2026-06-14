import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Bg } from './Bg';

export function Auth_Page_Bg({ children }: { children?: React.ReactNode }) {
  return (
    <Bg className="flex flex-col min-h-[100dvh]">
      <header className="w-full flex items-center justify-center p-6 shrink-0 h-24">
        <img 
          src="/SAMBHASHA_TEXT_LOGO.png" 
          alt="Sambhasha Logo" 
          className="h-full w-auto object-contain opacity-90" 
        />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
        {children || <Outlet />}
      </main>
      
      <footer className="w-full flex flex-col md:flex-row items-center justify-between p-6 shrink-0 text-sm text-zinc-400 gap-4">
        <div>&copy;NCCUStudios 2026</div>
        <div className="flex items-center gap-6">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms and Conditions</Link>
          <Link to="#" className="hover:text-white transition-colors">Help doc</Link>
        </div>
      </footer>
    </Bg>
  );
}
