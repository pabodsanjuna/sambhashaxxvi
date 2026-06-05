import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, QrCode, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { VintageBackground } from '@/components/VintageBackground';

export function AttendanceApp() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = (user?.publicMetadata?.role as string) || '';
  const isAdmin = role === 'admin';

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  const tabs = [
    { name: 'Dashboard', path: '/attendance', icon: Activity },
    { name: 'Scan & Mark', path: '/attendance/scan', icon: QrCode },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans relative selection:bg-orange-500/30 overflow-hidden">
       <VintageBackground />
       
       {/* Desktop Sidebar */}
       <aside className="w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-50 h-full hidden md:flex">
          <div className="p-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-black text-lg relative overflow-hidden shadow-lg shadow-orange-900/20">
                   <div className="absolute inset-0 bg-white/20 transform -rotate-45 scale-150 origin-left" />
                   S
                </div>
                <div>
                   <h1 className="font-bold leading-tight text-white tracking-tight">Event Tracker</h1>
                   <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-0.5" style={{ fontFamily: '"Bruny", "Bruno Ace", sans-serif' }}>SAMBHASHA XXVI</p>
                </div>
             </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {tabs.map(tab => (
               <NavLink
                  key={tab.name}
                  to={tab.path}
                  end={tab.path === '/attendance'}
                  className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold tracking-wide ${isActive ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-900/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}`}
               >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
               </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 mt-auto">
            {isAdmin && (
               <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors mb-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Panel</span>
               </button>
            )}
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
               <LogOut className="w-4 h-4" />
               <span>Sign Out</span>
            </button>
          </div>
       </aside>

       {/* Mobile Header */}
       <header className="md:hidden absolute top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
             >
                <Menu className="w-5 h-5" />
             </button>
             <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 origin-left" />
                S
             </div>
             <div>
                <h1 className="font-bold leading-tight text-sm">Event Tracker</h1>
                <p className="text-[10px] text-zinc-400 font-mono" style={{ fontFamily: '"Bruny", "Bruno Ace", sans-serif' }}>SAMBHASHA XXVI</p>
             </div>
          </div>
       </header>

       {/* Mobile Sidebar */}
       {isMobileMenuOpen && (
         <div className="md:hidden fixed inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="w-[280px] h-full border-r border-white/5 bg-zinc-950 flex flex-col pt-6 px-6 pb-6 shadow-2xl relative z-10 animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 tracking-tight flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-black text-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 origin-left" />
                      S
                   </div>
                   TRACKER
                </h1>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pb-4">
                 {tabs.map((tab) => (
                    <NavLink 
                      key={tab.name} 
                      to={tab.path}
                      end={tab.path === '/attendance'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${isActive ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-900/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                      {({isActive}) => (
                        <>
                          <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                          <span className="tracking-wide relative z-10">{tab.name}</span>
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />}
                        </>
                      )}
                    </NavLink>
                 ))}
              </nav>
              
              <div className="mt-auto pt-6 border-t border-white/5 shrink-0 space-y-2">
                {isAdmin && (
                   <button 
                     onClick={() => { setIsMobileMenuOpen(false); navigate('/admin'); }} 
                     className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-500/10 rounded-2xl transition-colors"
                   >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Admin Panel</span>
                   </button>
                )}
                <button 
                   onClick={handleSignOut}
                   className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 w-full transition-colors border border-transparent tracking-wide group"
                >
                   <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
                   Sign Out
                </button>
              </div>
            </aside>
         </div>
       )}

       {/* Main Content */}
       <main className="flex-1 overflow-y-auto relative z-10 pt-16 md:pt-0 w-full">
          <div className="h-full">
            <Outlet />
          </div>
       </main>
    </div>
  );
}
