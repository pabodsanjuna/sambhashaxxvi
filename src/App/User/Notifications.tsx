import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';

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
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No notifications to display.
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`border border-white/5 rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group hover:bg-white/10 transition-colors ${!notif.is_read ? 'bg-[#25D366]/5 border-[#25D366]/20' : 'bg-white/5'}`}
            >
              {!notif.is_read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.8)]" />
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start">
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 tracking-tight flex items-center gap-3 ${!notif.is_read ? 'text-[#25D366]' : 'text-white'}`}>
                    {notif.title}
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0 shadow-[0_0_10px_rgba(37,211,102,0.8)]"></span>}
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-2xl whitespace-pre-wrap ${!notif.is_read ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {notif.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3 self-start">
                  <div className="text-xs font-mono text-zinc-500 bg-black/40 px-3 py-1.5 rounded-full whitespace-nowrap border border-white/5">
                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className="text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
