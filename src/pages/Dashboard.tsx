import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatusBadge } from '@/components/passes/StatusBadge';
import {
  CalendarDays,
  Ticket,
  ScanLine,
  Clock,
  Plus,
  Upload,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { formatShortDate } from '@/utils/dateHelpers';

export function Dashboard() {
  const { events } = useEventStore();
  const { attendees } = useAttendeeStore();
  const { passes, getPassCounts } = usePassStore();

  const passCounts = getPassCounts();
  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming' || e.status === 'active')
    .slice(0, 4);

  const recentPasses = passes
    .filter((p) => p.status !== 'cancelled')
    .slice(-5)
    .reverse();

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: CalendarDays,
      color: 'text-[var(--neon-accent)]',
      bg: 'bg-[var(--neon-accent-soft)]',
    },
    {
      label: 'Total Passes',
      value: passCounts.total,
      icon: Ticket,
      color: 'text-[var(--neon-primary)]',
      bg: 'bg-[var(--neon-primary-soft)]',
    },
    {
      label: 'Passes Scanned',
      value: passCounts.used,
      icon: ScanLine,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/15',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/15',
    },
  ];

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div>
            <h1
              className="text-3xl lg:text-4xl font-bold mb-2"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Manage your events, generate passes, and track attendance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 lg:p-6 rounded-2xl bg-card border border-border hover:border-[var(--neon-border-active)] transition-all"
                >
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/events/new"
              className="group p-6 rounded-2xl bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-primary)]/80 text-white hover:shadow-lg hover:shadow-[var(--neon-primary-glow)] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Create New Event</h3>
                  <p className="text-white/80 text-sm">
                    Set up your event details, branding, and start generating passes
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/events"
              className="group p-6 rounded-2xl bg-card border border-border hover:border-[var(--neon-accent)] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-[var(--neon-accent-soft)] flex items-center justify-center">
                    <Upload className="h-6 w-6 text-[var(--neon-accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold">Add Attendees</h3>
                  <p className="text-muted-foreground text-sm">
                    Single entry or bulk CSV upload for existing events
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Upcoming Events
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/events">View all</Link>
              </Button>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group block p-4 rounded-2xl bg-card border border-border hover:border-[var(--neon-border-active)] hover:shadow-lg transition-all"
                  >
                    <div
                      className="h-24 rounded-lg mb-3 bg-cover bg-center"
                      style={{
                        backgroundColor: event.brandColor || 'var(--neon-primary)',
                        backgroundImage: event.bannerImage
                          ? `url(${event.bannerImage})`
                          : undefined,
                      }}
                    />
                    <StatusBadge
                      status={event.status}
                      size="sm"
                    />
                    <h3 className="font-semibold mt-2 group-hover:text-[var(--neon-primary)] transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <CalendarCheck className="h-3 w-3" />
                      {formatShortDate(event.date)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{event.venue}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-card border border-border">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming events yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/events/new">Create your first event</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Recent Passes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Recent Passes
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/passes">View all</Link>
              </Button>
            </div>

            {recentPasses.length > 0 ? (
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="divide-y divide-border">
                  {recentPasses.map((pass) => {
                    const attendee = attendees.find((a) => a.id === pass.attendeeId);
                    const event = events.find((e) => e.id === pass.eventId);
                    if (!attendee || !event) return null;

                    return (
                      <Link
                        key={pass.id}
                        to={`/passes/${pass.id}`}
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: event.brandColor || 'var(--neon-primary)' }}
                          >
                            {attendee.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm text-muted-foreground">{event.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {attendee.ticketType}
                          </span>
                          <StatusBadge status={pass.status} size="sm" showDot={false} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-card border border-border">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No passes generated yet</p>
              </div>
            )}
          </section>
        </div>
      </PageWrapper>
    </>
  );
}
