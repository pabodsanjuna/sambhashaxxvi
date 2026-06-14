import React, { memo } from 'react';
import { motion } from 'motion/react';

interface Props {
  notifications: any[];
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
}

export const NotificationList = memo(function NotificationList({ notifications, onMarkAsRead }: Props) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        No notifications to display.
      </div>
    );
  }

  return (
    <>
      {notifications.map((notif, idx) => (
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
                  onClick={(e) => onMarkAsRead(notif.id, e)}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
});
