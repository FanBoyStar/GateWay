import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Hop as Home, CalendarDays, Ticket, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/events', label: 'Events', icon: CalendarDays },
  { path: '/passes', label: 'Passes', icon: Ticket },
  { path: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors',
                isActive
                  ? 'text-[var(--neon-primary)]'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-[var(--neon-primary)]')} />
              <span className={cn('text-xs', isActive ? 'font-semibold' : '')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
