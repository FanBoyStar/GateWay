import { format, parseISO, isToday, isPast, isFuture, isValid } from 'date-fns';

export function formatEventDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'EEEE, MMMM d, yyyy');
}

export function formatEventTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hoursNum = parseInt(hours, 10);
  const ampm = hoursNum >= 12 ? 'PM' : 'AM';
  const displayHours = hoursNum % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

export function formatDateTime(date: string): string {
  const dateObj = parseISO(date);
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM d, yyyy');
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (!isValid(start) || !isValid(end)) return 'Invalid date range';
  if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    return format(start, 'MMM d, yyyy');
  }
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export function getEventStatus(date: string, _startTime?: string): 'upcoming' | 'active' | 'completed' {
  const eventDate = parseISO(date);

  if (isToday(eventDate)) {
    return 'active';
  }

  if (isPast(eventDate)) {
    return 'completed';
  }

  return 'upcoming';
}

export function isEventUpcoming(date: string): boolean {
  const eventDate = parseISO(date);
  return isFuture(eventDate) || isToday(eventDate);
}

export function formatTimeAgo(timestamp: string): string {
  const date = parseISO(timestamp);
  if (!isValid(date)) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return format(date, 'MMM d');
}
