import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { PassCard } from '@/components/passes/PassCard';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { Ticket } from 'lucide-react';

export function AllPasses() {
  const { getEventById } = useEventStore();
  const { getAttendeeById } = useAttendeeStore();
  const { passes } = usePassStore();

  // Get all active passes (not cancelled)
  const activePasses = passes.filter((p) => p.status !== 'cancelled');

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-6">
          <div>
            <h1
              className="text-2xl lg:text-3xl font-bold"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              All Passes
            </h1>
            <p className="text-muted-foreground">
              {activePasses.length} passes generated
            </p>
          </div>

          {activePasses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePasses.map((pass) => {
                const attendee = getAttendeeById(pass.attendeeId);
                const event = getEventById(pass.eventId);
                if (!attendee || !event) return null;

                return (
                  <Link key={pass.id} to={`/passes/${pass.id}`}>
                    <PassCard
                      event={event}
                      attendee={attendee}
                      pass={pass}
                      size="thumbnail"
                      className="hover:scale-[1.02] transition-transform cursor-pointer"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-border">
              <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No passes yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Create an event and add attendees to generate passes
              </p>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
