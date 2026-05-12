import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Search,
  Bell,
  Shield,
  Filter
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { supabase } from '@/lib/supabase';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { schoolDetails, loading } = useSchoolDetails();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user && !loading) {
      const role = (user.publicMetadata?.role as string) || '';
      
      // Redirect staff users away from the standard user dashboard
      if (role === 'admin') {
        navigate('/admin');
        return;
      }
      if (role === 'registrar') {
        navigate('/attendance');
        return;
      }

      // Normal users without school details go to onboarding
      if (!schoolDetails) {
        navigate('/onboarding');
      }
    }
  }, [isLoaded, user, loading, schoolDetails, navigate]);

  useEffect(() => {
    if (!schoolDetails) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('school_details_id', schoolDetails.id)
        .order('created_at', { ascending: false });

      if (data) {
        setNotifications(data);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `school_details_id=eq.${schoolDetails.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [schoolDetails]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Submissions', path: '/dashboard/submissions', icon: FileText },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    if (!schoolDetails) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('school_details_id', schoolDetails.id)
      .eq('is_read', false);
  };

  const handleNotificationClick = async (id: string, is_read: boolean) => {
    if (is_read) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  };

  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#2b1000] via-[#050505] to-[#0a0500] text-white font-sans flex p-0 lg:p-4 gap-4 overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex-shrink-0 h-full">
        <div className="mb-12">
          <img src="/sambhasha-logo.png" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
          <div className="h-1 w-12 bg-orange-500 mt-3 rounded-full" />
        </div>

        <nav className="flex-1 space-y-2">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/[0.02] backdrop-blur-sm lg:rounded-[2.5rem] border-0 lg:border border-white/5 overflow-hidden h-full">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-white/5 flex-shrink-0 relative z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <img src="/sambhasha-logo.png" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors relative ${isNotificationsOpen ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute top-1 -right-1 bg-[#25D366] text-black font-black text-[9px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-[3px] border-zinc-950 shadow-[0_0_10px_rgba(37,211,102,0.5)]">
                    {unreadCount}
                  </div>
                )}
              </button>

              {/* Notification Panel */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="fixed sm:absolute top-[80px] sm:top-[calc(100%+0.75rem)] left-4 right-4 sm:left-auto sm:right-0 sm:w-96 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                      <h3 className="font-bold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-[10px] uppercase tracking-widest text-orange-500 font-bold hover:text-orange-400 transition-colors">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-6 py-8 text-center text-zinc-500 text-sm">No new notifications</div>
                      ) : (
                        <>
                          {notifications.slice(0, 4).map((n) => (
                            <div key={n.id} onClick={() => handleNotificationClick(n.id, n.is_read)} className={`px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group ${!n.is_read ? 'bg-[#25D366]/5' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm transition-colors ${!n.is_read ? 'text-[#25D366]' : 'text-zinc-400'} group-hover:text-green-400 flex items-center gap-2`}>
                                  {n.title}
                                  {!n.is_read && <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full shadow-[0_0_8px_rgba(37,211,102,0.8)]" />}
                                </span>
                                <span className="text-[10px] text-zinc-600">{new Date(n.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className={`text-xs leading-relaxed whitespace-pre-wrap ${!n.is_read ? 'text-zinc-300' : 'text-zinc-500'}`}>{n.message}</p>
                            </div>
                          ))}
                          {notifications.length > 4 && (
                            <Link 
                               to="/dashboard/notifications" 
                               onClick={() => setIsNotificationsOpen(false)}
                               className="block px-6 py-4 text-center text-sm font-semibold text-orange-500 hover:text-orange-400 hover:bg-white/[0.02] transition-colors"
                            >
                               View all notifications ({notifications.length})
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <span className="hidden sm:block text-sm font-medium text-zinc-400">User Portal</span>
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 rounded-2xl",
                  userButtonTrigger: "focus:shadow-none focus:outline-none"
                }
              }} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-20">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
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
            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col">
                <img src="/sambhasha-logo.png" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
                <div className="h-1 w-8 bg-orange-500 mt-3 rounded-full" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
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
        )}
      </AnimatePresence>
    </div>
  );
}
