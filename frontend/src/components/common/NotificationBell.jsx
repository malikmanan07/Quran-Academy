import { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotification();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer" aria-label="Notifications">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-50">
          <div className="flex items-center justify-between p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Notifications ({unreadCount})</h3>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="text-xs text-[#4A5568] hover:text-[#e53e3e] transition-colors cursor-pointer font-medium">Clear All</button>
            )}
          </div>
          <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#4A5568] text-sm flex flex-col items-center gap-2">
                <span className="text-3xl">📭</span>
                No new notifications
              </div>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {notifications.map((n) => (
                  <li key={n.id} onClick={() => markAsRead(n.id)} 
                    className={`p-3 cursor-pointer hover:bg-[#F0F4F8] transition-colors flex gap-3 ${!n.isRead ? 'bg-[#F8FAFC]' : 'opacity-70'}`}>
                    <div className="text-lg flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-[#1B3A5C]' : 'text-[#4A5568]'}`}>{n.message}</p>
                      <p className="text-[10px] text-[#A0AEC0] mt-1">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#00B4D8] mt-1.5 flex-shrink-0"></div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
