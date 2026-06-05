import { Outlet } from 'react-router-dom';

export function AuthBG() {
  return (
    <div className="flex flex-col min-h-[100dvh] relative text-white font-sans selection:bg-white selection:text-black bg-gradient-to-br from-[#2b1000] via-[#050505] to-[#0a0500] overflow-hidden justify-between">
      
      {/* Animated Mesh Background Elements */}
      <div className="mesh-blob mesh-orange-1 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-orange-2 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-orange-3 fixed z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="relative w-full py-8 px-6 flex justify-center z-20 mt-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-1" style={{ fontFamily: '"Bruny", "Bruno Ace", sans-serif' }}>
            SAMBHASHA XXVI
          </h1>
          <p className="text-[9px] md:text-[10px] tracking-[0.3em] font-medium text-zinc-400 uppercase">
            THE MEDIA COMPETITION AND DAY
          </p>
        </div>
      </header>

      {/* Centered Floating Card */}
      <main className="flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 relative z-10 my-6">
        <div className="w-full max-w-md bg-transparent/10 backdrop-blur-md border-[1.5px] border-zinc-300 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* subtle inner glow for silver effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] pointer-events-none rounded-[2rem]"></div>
          <div className="relative z-10 w-full flex flex-col items-center">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full pb-8 pt-4 px-6 lg:px-12 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 z-20 gap-4">
        <p>&copy; {new Date().getFullYear()} NCCUStudios</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
      
    </div>
  );
}
