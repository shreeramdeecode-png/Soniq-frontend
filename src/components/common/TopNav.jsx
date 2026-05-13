import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, Bell, User } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/utils/cn';

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

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
        <button className="glass-pill rounded-pill flex items-center gap-[7px] py-[7px] px-3.5 text-sm-plus font-medium text-text-secondary cursor-pointer">
          <Settings size={12} strokeWidth={2} className="text-text-muted" />
          Setting
        </button>
        <button className="glass-pill w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
          <Bell size={13} strokeWidth={2} className="text-text-muted" />
        </button>
        <button className="glass-pill w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
          <User size={13} strokeWidth={2} className="text-text-muted" />
        </button>
      </div>
    </nav>
  );
}
