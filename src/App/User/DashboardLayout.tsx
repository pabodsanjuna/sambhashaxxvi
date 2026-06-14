import { useState, useEffect, lazy, Suspense } from 'react';
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
import { Bg } from '@/components/Bg';

const DesktopSidebar = lazy(() => import('./components/DashboardLayout/DesktopSidebar').then(m => ({ default: m.DesktopSidebar })));
const MobileSidebar = lazy(() => import('./components/DashboardLayout/MobileSidebar').then(m => ({ default: m.MobileSidebar })));
const NotificationPanel = lazy(() => import('./components/DashboardLayout/NotificationPanel').then(m => ({ default: m.NotificationPanel })));

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
    return <Bg className="flex items-center justify-center text-white">Loading...</Bg>;
  }

  return (
    <Bg className="h-[100dvh] flex p-0 lg:p-4 gap-4 overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <Suspense fallback={<aside className="hidden lg:flex flex-col w-72 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 flex-shrink-0 h-full animate-pulse" />}>
        <DesktopSidebar navLinks={navLinks} unreadCount={unreadCount} />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/[0.02] backdrop-blur-sm lg:rounded-[2.5rem] border-0 lg:border border-white/5 overflow-hidden h-full">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-white/5 flex-shrink-0 relative z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <img src="/sambhasha-logo.webp" alt="SAMBHASHA" className="h-20 w-auto object-contain" />
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
              <AnimatePresence>
                {isNotificationsOpen && (
                  <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/10" />}>
                    <NotificationPanel 
                      notifications={notifications}
                      unreadCount={unreadCount}
                      handleMarkAllRead={handleMarkAllRead}
                      handleNotificationClick={handleNotificationClick}
                      setIsNotificationsOpen={setIsNotificationsOpen}
                    />
                  </Suspense>
                )}
              </AnimatePresence>
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
          <Suspense fallback={<div className="fixed inset-0 z-50 lg:hidden bg-black/60" />}>
            <MobileSidebar 
              navLinks={navLinks} 
              unreadCount={unreadCount} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            />
          </Suspense>
        )}
      </AnimatePresence>

    </Bg>
  );
}
