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
      shadow: 'rgba(245,158,11,0.3)',
    },
    {
      label: 'Total Passes',
      value: passCounts.total,
      icon: Ticket,
      bg: '#7B5CF0',
      shadow: 'rgba(123,92,240,0.3)',
    },
    {
      label: 'Passes Scanned',
      value: passCounts.used,
      icon: ScanLine,
      bg: '#E8186D',
      shadow: 'rgba(232,24,109,0.3)',
    },
    {
      label: 'Upcoming',
      value: upcomingEvents.length,
      icon: Clock,
      bg: '#0EA5E9',
      shadow: 'rgba(14,165,233,0.3)',
    },
  ];

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-6 max-w-2xl mx-auto lg:max-w-none">

          {/* ── Greeting Header ── */}
          <div className="flex items-start justify-between pt-1">
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Hi, {firstName} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
            </div>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white flex gap-1.5 text-xs px-4"
            >
              <Link to="/events/new">
                <Plus className="h-3.5 w-3.5" />
                New Event
              </Link>
            </Button>
          </div>

          {/* ── Hero Summary Card ── */}
          <div
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7B5CF0 0%, #E8186D 100%)',
              boxShadow: '0 8px 32px rgba(123,92,240,0.35)',
            }}
          >
            {/* subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-white/5 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
                  Overview
                </p>
                <p className="text-white text-lg font-bold leading-snug">
                  {events.length === 0
                    ? "Let's create your first event!"
                    : `${upcomingEvents.length} upcoming event${upcomingEvents.length !== 1 ? 's' : ''}`}
                </p>
                <p className="text-white/70 text-sm mt-0.5">
                  {events.length === 0
                    ? 'Get started in just a few minutes.'
                    : `${passCounts.total} pass${passCounts.total !== 1 ? 'es' : ''} generated · ${passCounts.used} scanned`}
                </p>
              </div>

              {/* Right: big number or CTA */}
              {events.length === 0 ? (
                <Button
                  asChild
                  size="sm"
                  className="flex-shrink-0 rounded-full bg-white text-[#7B5CF0] hover:bg-white/90 font-semibold text-xs px-4"
                >
                  <Link to="/events/new">Start <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              ) : (
                <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-white/20 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white leading-none">{events.length}</span>
                  <span className="text-white/70 text-[10px] mt-0.5">events</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Stats
            </p>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3"
                    style={{
                      background: stat.bg,
                      boxShadow: `0 4px 16px ${stat.shadow}`,
                    }}
                  >
                    <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl font-extrabold text-white leading-none">{stat.value}</p>
                      <p className="text-white/80 text-xs mt-0.5 truncate">{stat.label}</p>
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-white/10" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Quick Actions
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/events/new"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-[var(--neon-primary)] active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--neon-primary-soft)] flex items-center justify-center flex-shrink-0">
                  <Plus className="h-5 w-5 text-[var(--neon-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">New Event</p>
                  <p className="text-xs text-muted-foreground">Set up in minutes</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-primary)] transition-colors flex-shrink-0" />
              </Link>

              <Link
                to="/events"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-[var(--neon-accent)] active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--neon-accent-soft)] flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-[var(--neon-accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Add Attendees</p>
                  <p className="text-xs text-muted-foreground">Single or bulk CSV upload</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-accent)] transition-colors flex-shrink-0" />
              </Link>

              <Link
                to="/scan"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-emerald-500 active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <ScanLine className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Scan & Verify</p>
                  <p className="text-xs text-muted-foreground">Check passes at the door</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </Link>
            </div>
          </div>

          {/* ── Recent Events ── */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Events
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[var(--neon-primary)] hover:text-[var(--neon-primary)] h-auto py-0 px-0 text-xs"
              >
                <Link to="/events">See all <ArrowRight className="h-3 w-3 ml-0.5" /></Link>
              </Button>
            </div>

            {recentEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentEvents.map((event) => {
                  const eventAttendees = attendees.filter((a) => a.eventId === event.id);
                  const eventPasses = passes.filter((p) => p.eventId === event.id);

                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-[var(--neon-primary)]/40 active:scale-[0.98] transition-all group"
                    >
                      {/* Color swatch */}
                      <div
                        className="h-12 w-12 flex-shrink-0 rounded-xl bg-cover bg-center"
                        style={{
                          backgroundColor: event.brandColor || 'var(--neon-primary)',
                          backgroundImage: event.bannerImage ? `url(${event.bannerImage})` : undefined,
                        }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate group-hover:text-[var(--neon-primary)] transition-colors">
                            {event.name}
                          </p>
                          <StatusBadge status={event.status} size="sm" showDot={false} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 flex-shrink-0" />
                            {formatShortDate(event.date)}
                          </span>
                          {event.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[130px]">{event.venue}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {eventAttendees.length} attendees
                          </span>
                          <span className="flex items-center gap-1">
                            <Ticket className="h-3 w-3" />
                            {eventPasses.length} passes
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--neon-primary)] transition-colors flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[var(--neon-accent-soft)] flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-[var(--neon-accent)]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">No events yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Create your first event to get started</p>
                </div>
                <Button
                  className="mt-1 rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white text-sm"
                  asChild
                >
                  <Link to="/events/new"><Plus className="h-4 w-4 mr-1" /> Create Event</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </PageWrapper>
    </>
  );
}
