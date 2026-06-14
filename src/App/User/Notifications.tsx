import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Bell, CheckSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';

const NotificationList = lazy(() => import('./components/Notifications/NotificationList').then(m => ({ default: m.NotificationList })));

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { schoolDetails } = useSchoolDetails();

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!schoolDetails) return;
    try {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('school_details_id', schoolDetails.id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
      .channel('public:notifications_page')
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

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">System Alerts</h1>
            <p className="text-zinc-500 font-medium">All activity notifications</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm self-start sm:self-auto"
          >
            <CheckSquare className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading notifications...</div>}>
          <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} />
        </Suspense>
      </div>
    </div>
  );
}
