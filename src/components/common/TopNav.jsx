import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, Bell, User, LogOut, UserCircle, Moon, HelpCircle } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const NOTIFICATIONS = [
  { id: 1, title: 'Idle alert', desc: 'Arjun Mehta idle for 15 min', time: '2 min ago', unread: true },
  { id: 2, title: 'New team member', desc: 'Dev Varma joined Engineering', time: '1h ago', unread: true },
  { id: 3, title: 'Report ready', desc: 'Weekly productivity report generated', time: '3h ago', unread: false },
  { id: 4, title: 'Low productivity', desc: 'Sales team below threshold', time: '5h ago', unread: false },
];

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(userRef, () => setUserOpen(false));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="flex items-center justify-between px-8 pt-4.5 relative z-nav">
      <div
        className="glass-pill rounded-pill py-[7px] px-5 text-xl font-semibold text-text-primary cursor-pointer"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        Soniq
      </div>

      <div className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'py-2 px-4 rounded-pill text-base font-medium cursor-pointer transition-all duration-200',
              isActive(item.path)
                ? 'nav-active-pill text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            'glass-pill rounded-pill flex items-center gap-[7px] py-[7px] px-3.5 text-sm-plus font-medium text-text-secondary cursor-pointer transition-colors',
            isActive('/settings') && 'ring-1 ring-primary/30'
          )}
        >
          <Settings size={12} strokeWidth={2} className="text-text-muted" />
          Setting
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="glass-pill w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative"
          >
            <Bell size={13} strokeWidth={2} className="text-text-muted" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-status-danger text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-[320px] bg-white/95 backdrop-blur-xl rounded-[18px] border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden z-30 animate-[scaleIn_0.15s_ease]">
              <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">Notifications</span>
                <span
                  className="text-2xs text-primary font-semibold cursor-pointer"
                  onClick={() => {
                    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                    toast.info('All notifications marked as read');
                  }}
                >Mark all read</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, unread: false } : n));
                      setNotifOpen(false);
                    }}
                    className={cn(
                      'px-4 py-3 border-b border-black/[0.04] hover:bg-black/[0.02] cursor-pointer transition-colors',
                      notif.unread && 'bg-primary/[0.03]'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {notif.unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      <div className={cn(!notif.unread && 'ml-[18px]')}>
                        <p className="text-xs font-semibold text-text-primary">{notif.title}</p>
                        <p className="text-2xs text-text-muted mt-0.5">{notif.desc}</p>
                        <p className="text-2xs text-text-lighter mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-black/5 text-center">
                <span
                  className="text-xs font-medium text-primary cursor-pointer"
                  onClick={() => { toast.info('Notifications page coming soon'); setNotifOpen(false); }}
                >View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="glass-pill w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          >
            <User size={13} strokeWidth={2} className="text-text-muted" />
          </button>

          {userOpen && (
            <div className="absolute top-full right-0 mt-2 w-[220px] bg-white/95 backdrop-blur-xl rounded-[16px] border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden z-30 animate-[scaleIn_0.15s_ease]">
              <div className="px-4 py-3 border-b border-black/5">
                <p className="text-sm font-bold text-text-primary">Kiran Admin</p>
                <p className="text-2xs text-text-muted">kiran@soniq.io</p>
              </div>
              <div className="py-1.5">
                <button onClick={() => { navigate('/settings'); setUserOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-black/[0.03] cursor-pointer transition-colors">
                  <UserCircle size={14} className="text-text-muted" /> Profile
                </button>
                <button onClick={() => { toast.info('Dark mode coming soon'); setUserOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-black/[0.03] cursor-pointer transition-colors">
                  <Moon size={14} className="text-text-muted" /> Dark Mode
                </button>
                <button onClick={() => { toast.info('Help center opening...'); setUserOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-secondary hover:bg-black/[0.03] cursor-pointer transition-colors">
                  <HelpCircle size={14} className="text-text-muted" /> Help & Support
                </button>
              </div>
              <div className="border-t border-black/5 py-1.5">
                <button onClick={() => { toast.success('Signed out successfully'); navigate('/'); setUserOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-status-danger hover:bg-red-50/50 cursor-pointer transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
