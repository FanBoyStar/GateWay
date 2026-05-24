import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatusBadge } from '@/components/passes/StatusBadge';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { formatShortDate } from '@/utils/dateHelpers';
import {
  Plus,
  CalendarDays,
  MapPin,
  Users,
} from 'lucide-react';

export function EventsList() {
  const { events } = useEventStore();
  const { getAttendeeCount } = useAttendeeStore();

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl lg:text-3xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                My Events
              </h1>
              <p className="text-muted-foreground">
                {events.length} events created
              </p>
            </div>
            <Button asChild>
              <Link to="/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => {
                const attendeeCount = getAttendeeCount(event.id);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-[var(--neon-border-active)] transition-all"
                  >
                    <div
                      className="h-32 bg-cover bg-center relative"
                      style={{
                        backgroundColor: event.brandColor || 'var(--neon-primary)',
                        backgroundImage: event.bannerImage
                          ? `url(${event.bannerImage})`
                          : undefined,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={event.status} size="sm" />
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:text-[var(--neon-primary)] transition-colors line-clamp-1">
                          {event.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs bg-muted">
                          {event.type}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatShortDate(event.date)}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.venue}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          {attendeeCount} attendees
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-border">
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first event to start generating passes for your attendees
              </p>
              <Button asChild>
                <Link to="/events/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
