import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Menu, LogOut } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function TopBar({ showMenu, onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--neon-primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>PassGen</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <div className="relative w-5 h-5">
              <Sun className={cn('absolute inset-0 h-5 w-5 transition-opacity duration-200', theme === 'light' ? 'opacity-100' : 'opacity-0')} />
              <Moon className={cn('absolute inset-0 h-5 w-5 transition-opacity duration-200', theme === 'dark' ? 'opacity-100' : 'opacity-0')} />
            </div>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-accent)] flex items-center justify-center hover:opacity-90 transition-opacity">
                <User className="h-4 w-4 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
