import { cn } from '@/lib/utils';
import type { PassStatus } from '@/store/usePassStore';
import type { Event } from '@/store/useEventStore';

type StatusBadgeType = PassStatus | Event['status'];

interface StatusBadgeProps {
  status: StatusBadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const statusConfig: Record<
  string,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  unused: {
    label: 'Valid',
    bgClass: 'bg-emerald-500/20 dark:bg-emerald-500/20',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
  used: {
    label: 'Scanned',
    bgClass: 'bg-gray-500/20 dark:bg-gray-500/20',
    textClass: 'text-gray-700 dark:text-gray-400',
    dotClass: 'bg-gray-500',
  },
  cancelled: {
    label: 'Cancelled',
    bgClass: 'bg-red-500/20 dark:bg-red-500/20',
    textClass: 'text-red-700 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
  upcoming: {
    label: 'Upcoming',
    bgClass: 'bg-[var(--neon-accent-soft)]',
    textClass: 'text-[var(--neon-accent)] dark:text-[var(--neon-accent)]',
    dotClass: 'bg-[var(--neon-accent)]',
  },
  active: {
    label: 'Active',
    bgClass: 'bg-[var(--neon-primary-soft)]',
    textClass: 'text-[var(--neon-primary)] dark:text-[var(--neon-primary)]',
    dotClass: 'bg-[var(--neon-primary)]',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function StatusBadge({
  status,
  size = 'md',
  showDot = true,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unused;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        status === 'unused' && 'animate-pulse-dot',
        config.bgClass,
        config.textClass,
        sizeClasses[size]
      )}
    >
      {showDot && (
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            config.dotClass,
            status === 'unused' && 'animate-pulse-dot'
          )}
        />
      )}
      {config.label}
    </span>
  );
}
