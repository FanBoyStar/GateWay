import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { House, CalendarDays, Ticket, ScanLine, User, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: House },
  { path: '/events', label: 'Events', icon: CalendarDays },
  { path: '/passes', label: 'Passes', icon: Ticket },
  { path: '/scan', label: 'Scan', icon: ScanLine },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-sidebar border-r border-sidebar-border z-40">
      <div className="flex items-center p-6 border-b border-sidebar-border">
        <Logo href="/dashboard" size="md" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-semibold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <span className="text-sm text-muted-foreground">Theme</span>
          <div className="relative w-5 h-5">
            <Sun
              className={cn(
                'absolute inset-0 h-5 w-5 transition-opacity duration-200',
                theme === 'light' ? 'opacity-100' : 'opacity-0'
              )}
            />
            <Moon
              className={cn(
                'absolute inset-0 h-5 w-5 transition-opacity duration-200',
                theme === 'dark' ? 'opacity-100' : 'opacity-0'
              )}
            />
          </div>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-accent)] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Event Organizer
            </p>
            <p className="text-xs text-muted-foreground truncate">
              organizer@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
