import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut, QrCode, Bell, FileText, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { Bg } from '@/components/Bg';

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    <div className="flex text-white font-sans selection:bg-white/10 overflow-hidden relative h-[100dvh]">
      <Bg />
      
      {/* Desktop Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-[88px]' : 'w-[280px]'} transition-all duration-300 border-r border-white/5 bg-[#171717]/80 flex-col pt-10 pb-6 shadow-2xl relative z-10 backdrop-blur-md hidden md:flex shrink-0 group`}>
        
        {/* Toggle Button */}
        <button 
           onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
           className="absolute top-10 -right-3.5 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-black rounded-full p-1 z-20 transition-all shadow-md"
        >
           {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`mb-14 px-4 ${isSidebarCollapsed ? 'flex justify-center' : 'px-6'}`}>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-black font-black text-sm relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-white/20 transform rotate-45 scale-150 origin-left" />
                S
             </div>
             {!isSidebarCollapsed && <span>ADMIN PORTAL</span>}
          </h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto px-4 overflow-x-hidden">
           {navItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                end={item.path === '/admin'}
                className={({isActive}) => `flex items-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                {({isActive}) => (
                  <>
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    {!isSidebarCollapsed && <span className="tracking-wide relative z-10">{item.name}</span>}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white text-black rounded-r-full shadow-md" />}
                  </>
                )}
              </NavLink>
           ))}
        </nav>
        
        <div className="mt-8 pt-8 px-4 border-t border-white/5">
          <button 
             onClick={handleSignOut}
             title={isSidebarCollapsed ? 'Sign Out' : undefined}
             className={`flex items-center gap-3 py-3 rounded-2xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 w-full transition-colors border border-transparent tracking-wide group ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
             <LogOut className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-red-400 transition-colors" />
             {!isSidebarCollapsed && <span>Sign Out</span>}
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
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-black font-black text-sm relative overflow-hidden">
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
               <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-black font-black text-sm relative overflow-hidden">
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
                     className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${isActive ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                   >
                     {({isActive}) => (
                       <>
                         <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                         <span className="tracking-wide relative z-10">{item.name}</span>
                         {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white text-black rounded-r-full shadow-md" />}
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
