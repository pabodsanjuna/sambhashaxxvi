import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface Props {
  navLinks: NavLink[];
  unreadCount: number;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export const MobileSidebar = memo(function MobileSidebar({ navLinks, unreadCount, setIsMobileMenuOpen }: Props) {
  const location = useLocation();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      <motion.aside 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute left-0 top-0 bottom-0 w-72 bg-zinc-950 p-8 flex flex-col border-r border-white/10"
      >
        <div className="flex items-center justify-between mb-12 shrink-0">
          <div className="flex flex-col">
            <img src="/sambhasha-logo.webp" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
            <div className="h-1 w-8 bg-brand-500 mt-3 rounded-full" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto pb-4 no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                location.pathname === link.path
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium flex-1">{link.name}</span>
              {link.name === 'Notifications' && unreadCount > 0 && (
                 <div className="bg-[#25D366] text-black font-bold text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                   {unreadCount}
                 </div>
              )}
            </Link>
          ))}
        </nav>
      </motion.aside>
    </div>
  );
});
