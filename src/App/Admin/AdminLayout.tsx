import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut, QrCode, Bell, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { VintageBackground } from '@/components/VintageBackground';

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Schools', path: '/admin/schools', icon: Building2 },
    { name: 'Contestants', path: '/admin/contestants', icon: Users },
    { name: 'Submissions', path: '/admin/submissions', icon: FileText },
    { name: 'Attendance', path: '/attendance', icon: QrCode },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex bg-black text-white font-sans selection:bg-orange-500/30 overflow-hidden relative h-[100dvh]">
      <VintageBackground />
      
      {/* Desktop Sidebar */}
      <aside className="w-[280px] border-r border-white/5 bg-black/50 overflow-y-auto flex-col pt-10 px-6 pb-6 shadow-2xl relative z-10 backdrop-blur-md hidden md:flex">
        <div className="mb-14">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-black text-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 origin-left" />
                S
             </div>
             ADMIN PORTAL
          </h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
           {navItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                end={item.path === '/admin'}
                className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${isActive ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-900/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                {({isActive}) => (
                  <>
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span className="tracking-wide relative z-10">{item.name}</span>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />}
                  </>
                )}
              </NavLink>
           ))}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <button 
             onClick={handleSignOut}
             className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 w-full transition-colors border border-transparent tracking-wide group"
          >
             <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
             Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden absolute top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-40">
         <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            >
               <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-black font-black text-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 origin-left" />
               S
            </div>
            <div>
               <h1 className="font-bold leading-tight text-white tracking-tight text-sm">ADMIN PORTAL</h1>
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
                  PORTAL
               </h1>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-full transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pb-4">
                {navItems.map((item) => (
                   <NavLink 
                     key={item.name} 
                     to={item.path}
                     end={item.path === '/admin'}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${isActive ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-900/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                   >
                     {({isActive}) => (
                       <>
                         <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                         <span className="tracking-wide relative z-10">{item.name}</span>
                         {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />}
                       </>
                     )}
                   </NavLink>
                ))}
             </nav>
             
             <div className="mt-auto pt-6 border-t border-white/5 shrink-0">
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

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative z-10 pt-16 md:pt-0 w-full">
        <div className="h-full">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
