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
  Users,
  ArrowRight,
  MapPin,
  Eye,
} from 'lucide-react';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { useAuth } from '@/contexts/AuthContext';
import { formatShortDate } from '@/utils/dateHelpers';
import { format } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const { events } = useEventStore();
  const { attendees } = useAttendeeStore();
  const { passes, getPassCounts } = usePassStore();

  const passCounts = getPassCounts();
  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming' || e.status === 'active')
    .slice(0, 4);

  const recentEvents = [...events].reverse().slice(0, 5);

  const firstName = user?.full_name?.split(' ')[0] ?? 'there';
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: CalendarDays,
      bg: '#F59E0B',
      text: '#fff',
      shadow: 'rgba(245,158,11,0.35)',
    },
    {
      label: 'Total Passes',
      value: passCounts.total,
      icon: Ticket,
      bg: '#7B5CF0',
      text: '#fff',
      shadow: 'rgba(123,92,240,0.35)',
    },
    {
      label: 'Passes Scanned',
      value: passCounts.used,
      icon: ScanLine,
      bg: '#E8186D',
      text: '#fff',
      shadow: 'rgba(232,24,109,0.35)',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      bg: '#C4B5FD',
      text: '#4C1D95',
      shadow: 'rgba(167,139,250,0.35)',
    },
  ];

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-8">

          {/* ── Page Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: 'Syne, sans-serif' }}>
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
            </div>
            <Button asChild size="sm"
              className="rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white hidden sm:flex gap-2">
              <Link to="/events/new">
                <Plus className="h-4 w-4" />
                New Event
              </Link>
            </Button>
          </div>

          {/* ── Hero Greeting Banner ── */}
          <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10"
            style={{
              background: 'linear-gradient(135deg, rgba(123,92,240,0.18) 0%, rgba(232,24,109,0.12) 100%)',
              border: '1px solid rgba(123,92,240,0.2)',
            }}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #7B5CF0 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #E8186D 0%, transparent 70%)', transform: 'translateY(50%)' }} />

            {/* Floating dots */}
            <div className="absolute top-8 right-1/4 w-3 h-3 rounded-full bg-[var(--neon-primary)] opacity-60" />
            <div className="absolute top-16 right-16 w-2 h-2 rounded-full bg-[var(--neon-accent)] opacity-40" />
            <div className="absolute bottom-8 right-8 w-4 h-4 rounded-full border-2 border-[var(--neon-accent)] opacity-30" />

            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2"
                style={{ fontFamily: 'Syne, sans-serif' }}>
                Hi, {firstName} 👋
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg max-w-md">
                {events.length === 0
                  ? 'Ready to create your first event? Let\'s get started.'
                  : `You have ${upcomingEvents.length} upcoming event${upcomingEvents.length !== 1 ? 's' : ''} and ${passCounts.total} passes generated.`}
              </p>
              {events.length === 0 && (
                <Button asChild className="mt-5 rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white font-semibold px-6">
                  <Link to="/events/new">Create your first event <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              )}
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Overview</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label}
                    className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
                    style={{
                      background: stat.bg,
                      boxShadow: `0 8px 24px ${stat.shadow}`,
                    }}>
                    <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon className="h-5 w-5" style={{ color: stat.text }} />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold leading-none" style={{ color: stat.text }}>
                        {stat.value}
                      </p>
                      <p className="text-sm mt-1 font-medium" style={{ color: stat.text, opacity: 0.8 }}>
                        {stat.label}
                      </p>
                    </div>
                    {/* decorative circle */}
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Recent Events List ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                Recent Events
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-[var(--neon-primary)] hover:text-[var(--neon-primary)]">
                <Link to="/events">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </div>

            {recentEvents.length > 0 ? (
              <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
                {recentEvents.map((event) => {
                  const eventAttendees = attendees.filter((a) => a.eventId === event.id);
                  const eventPasses = passes.filter((p) => p.eventId === event.id);

                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors group"
                    >
                      {/* Color thumbnail */}
                      <div
                        className="h-14 w-20 flex-shrink-0 rounded-xl bg-cover bg-center"
                        style={{
                          backgroundColor: event.brandColor || 'var(--neon-primary)',
                          backgroundImage: event.bannerImage ? `url(${event.bannerImage})` : undefined,
                        }}
                      />

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold truncate group-hover:text-[var(--neon-primary)] transition-colors">
                            {event.name}
                          </p>
                          <StatusBadge status={event.status} size="sm" showDot={false} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formatShortDate(event.date)}
                          </span>
                          {event.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[160px]">{event.venue}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats on right */}
                      <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {eventAttendees.length}
                          <span className="hidden lg:inline">attendees</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Ticket className="h-4 w-4" />
                          {eventPasses.length}
                          <span className="hidden lg:inline">passes</span>
                        </span>
                      </div>

                      <div className="hidden sm:flex items-center">
                        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-primary)] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-[var(--neon-accent-soft)] flex items-center justify-center">
                  <CalendarDays className="h-7 w-7 text-[var(--neon-accent)]" />
                </div>
                <div>
                  <p className="font-semibold">No events yet</p>
                  <p className="text-sm text-muted-foreground">Create your first event to get started</p>
                </div>
                <Button className="mt-2 rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white" asChild>
                  <Link to="/events/new"><Plus className="h-4 w-4 mr-1" /> Create Event</Link>
                </Button>
              </div>
            )}
          </section>

          {/* ── Quick Actions ── */}
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/events/new"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[var(--neon-primary)] hover:shadow-md transition-all">
                <div className="h-11 w-11 rounded-xl bg-[var(--neon-primary-soft)] flex items-center justify-center flex-shrink-0">
                  <Plus className="h-5 w-5 text-[var(--neon-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">New Event</p>
                  <p className="text-xs text-muted-foreground">Set up in minutes</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-primary)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link to="/events"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[var(--neon-accent)] hover:shadow-md transition-all">
                <div className="h-11 w-11 rounded-xl bg-[var(--neon-accent-soft)] flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-[var(--neon-accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Add Attendees</p>
                  <p className="text-xs text-muted-foreground">Single or bulk CSV</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-accent)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link to="/scan"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-emerald-500 hover:shadow-md transition-all">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <ScanLine className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Scan & Verify</p>
                  <p className="text-xs text-muted-foreground">Check passes at the door</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </section>

        </div>
      </PageWrapper>
    </>
  );
}
