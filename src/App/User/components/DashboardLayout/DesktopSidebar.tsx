import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface Props {
  navLinks: NavLink[];
  unreadCount: number;
}

export const DesktopSidebar = memo(function DesktopSidebar({ navLinks, unreadCount }: Props) {
  const location = useLocation();
  
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex-shrink-0 h-full">
      <div className="mb-12 shrink-0">
        <img src="/sambhasha-logo.webp" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
        <div className="h-1 w-12 bg-brand-500 mt-3 rounded-full" />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pb-4 no-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
              location.pathname === link.path
                ? 'bg-white text-black'
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <link.icon className={`w-5 h-5 ${location.pathname === link.path ? 'text-black' : 'group-hover:scale-110 transition-transform'}`} />
            <span className="font-medium tracking-tight flex-1">{link.name}</span>
            
            {link.name === 'Notifications' && unreadCount > 0 && (
              <div className="bg-[#25D366] text-zinc-900 font-bold text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center ml-auto shadow-[0_0_10px_rgba(37,211,102,0.3)]">
                {unreadCount}
              </div>
            )}
            
            {location.pathname === link.path && (link.name !== 'Notifications' || unreadCount === 0) && (
              <div className="w-1.5 h-1.5 bg-black rounded-full ml-auto" />
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
});
