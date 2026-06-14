import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  notifications: Notification[];
  unreadCount: number;
  handleMarkAllRead: () => void;
  handleNotificationClick: (id: string, is_read: boolean) => void;
  setIsNotificationsOpen: (val: boolean) => void;
}

export const NotificationPanel = memo(function NotificationPanel({
  notifications,
  unreadCount,
  handleMarkAllRead,
  handleNotificationClick,
  setIsNotificationsOpen
}: Props) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
      <div className="fixed sm:absolute top-[80px] sm:top-[calc(100%+0.75rem)] left-4 right-4 sm:left-auto sm:right-0 sm:w-96 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="font-bold">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-[10px] uppercase tracking-widest text-brand-500 font-bold hover:text-brand-400 transition-colors">Mark all read</button>
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
                   className="block px-6 py-4 text-center text-sm font-semibold text-brand-500 hover:text-brand-400 hover:bg-white/[0.02] transition-colors"
                >
                   View all notifications ({notifications.length})
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
});
