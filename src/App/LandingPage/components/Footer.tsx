import React from 'react';

const LOGO_URL = "/nccu_logo.webp";

export function Footer() {
  return (
    <footer className="w-full flex justify-center py-16 border-t border-sepia-900/50 bg-black/40 backdrop-blur-sm mt-20 relative z-20">
      <div className="flex flex-col items-center w-full max-w-7xl px-4 text-center">
        
        {/* NCCU Logo Group */}
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} alt="NCCU Logo" className="h-16 mb-4 opacity-80" />
          <h4 className="font-cinzel text-lg md:text-xl text-sepia-200 tracking-[0.2em] uppercase">
            Nalanda College<br/>Communication Unit
          </h4>
          <p className="font-cinzel text-xs text-sepia-500 tracking-[0.3em] uppercase mt-1">
            Since 1986
          </p>
        </div>

        {/* Event Branding */}
        <div className="mb-8">
          <h2 className="font-bruney text-3xl md:text-4xl text-sepia-100 tracking-widest mb-2 uppercase">
            Sambhasha XXVI
          </h2>
          <p className="font-cinzel text-xs text-sepia-400 tracking-[0.2em] uppercase">
            The Media Competition & Day
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 mb-8 font-montserrat text-xs text-sepia-400 tracking-wider">
          <a href="mailto:nccustudios@gmail.com" className="hover:text-sepia-200 transition-colors">nccustudios@gmail.com</a>
          <span className="hidden md:inline text-sepia-800">|</span>
          <a href="mailto:sambhasha26@nccustudios.com" className="hover:text-sepia-200 transition-colors">sambhasha26@nccustudios.com</a>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 md:space-x-8 mb-12 font-montserrat text-xs text-sepia-300 tracking-widest uppercase">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Rules and Regulations</a>
          <a href="#" className="hover:text-white transition-colors">Category Details</a>
          <a href="#" className="hover:text-white transition-colors">How To Register</a>
        </div>

        {/* Copy */}
        <div className="flex flex-col items-center font-cinzel text-[10px] md:text-xs text-sepia-600 tracking-[0.2em] uppercase space-y-2">
          <p>Innovative Production of Nalanda College Communication Unit</p>
          <p>&copy;2026 NCCU Studios</p>
          <p>Crafted with pride by NCCU Studios</p>
        </div>
      </div>
    </footer>
  );
}
