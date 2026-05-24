import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatusBadge } from '@/components/passes/StatusBadge';
import { PassCard } from '@/components/passes/PassCard';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { formatEventDate, formatEventTime } from '@/utils/dateHelpers';
import { Calendar, Clock, MapPin, CreditCard as Edit, Trash2, Plus, Upload, Ticket, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getEventById, deleteEvent } = useEventStore();
  const { getAttendeesByEvent, removeAttendee } = useAttendeeStore();
  const { getPassesByEvent, getPassByAttendee } = usePassStore();

  const event = getEventById(id || '');
  const attendees = getAttendeesByEvent(id || '');
  const passes = getPassesByEvent(id || '');

  if (!event) {
    return (
      <>
        <TopBar />
        <Sidebar />
        <BottomNav />
        <PageWrapper>
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Event not found</h2>
            <Button asChild>
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </PageWrapper>
      </>
    );
  }

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/events');
  };

  const handleDeleteAttendee = (attendeeId: string) => {
    removeAttendee(attendeeId);
    toast.success('Attendee removed');
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="space-y-6">
          {/* Event Header */}
          <div className="relative -mx-4 lg:-mx-8 -mt-4 lg:-mt-8">
            <div
              className="h-48 lg:h-64 bg-cover bg-center"
              style={{
                backgroundColor: event.brandColor || 'var(--neon-primary)',
                backgroundImage: event.bannerImage ? `url(${event.bannerImage})` : undefined,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            <div className="relative -mt-32 lg:-mt-40 px-4 lg:px-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={event.status} />
                    <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
                      {event.type}
                    </span>
                  </div>
                  <h1
                    className="text-3xl lg:text-4xl font-bold"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {event.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatEventDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.venue}
                    {event.address && <span className="text-sm">({event.address})</span>}
                  </p>
                </div>

                <Button variant="outline" size="icon" asChild>
                  <Link to={`/events/${event.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="attendees" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="attendees" className="gap-2">
                <Users className="h-4 w-4" />
                Attendees
              </TabsTrigger>
              <TabsTrigger value="passes" className="gap-2">
                <Ticket className="h-4 w-4" />
                Passes ({passes.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Attendees Tab */}
            <TabsContent value="attendees" className="mt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Button asChild>
                  <Link to={`/events/${event.id}/add-attendee`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attendee
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/events/${event.id}/bulk`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Upload CSV
                  </Link>
                </Button>
              </div>

              {attendees.length > 0 ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Ticket Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {attendees.map((attendee) => {
                          const pass = getPassByAttendee(attendee.id);
                          return (
                            <tr key={attendee.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3">
                                <p className="font-medium">{attendee.name}</p>
                                {attendee.seatNumber && (
                                  <p className="text-xs text-muted-foreground">
                                    Seat: {attendee.seatNumber}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {attendee.email}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                  {attendee.ticketType}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {pass && <StatusBadge status={pass.status} size="sm" />}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                  {pass && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link to={`/passes/${pass.id}`}>View Pass</Link>
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive">
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Remove attendee?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete {attendee.name} from this event and invalidate their pass.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteAttendee(attendee.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 rounded-lg border border-border">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No attendees yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first attendee to generate a pass
                  </p>
                  <Button asChild>
                    <Link to={`/events/${event.id}/add-attendee`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Attendee
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Passes Tab */}
            <TabsContent value="passes" className="mt-6">
              {passes.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {passes.map((pass) => {
                    const attendee = attendees.find((a) => a.id === pass.attendeeId);
                    if (!attendee) return null;

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
                <div className="text-center py-16 rounded-lg border border-border">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No passes generated</h3>
                  <p className="text-muted-foreground">
                    Add attendees to generate their passes
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6 space-y-6">
              <div className="p-6 rounded-lg border border-border space-y-4">
                <h3 className="text-lg font-semibold">Event Details</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Event Name</p>
                      <p className="font-medium">{event.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Event Type</p>
                      <p className="font-medium">{event.type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatEventDate(event.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p className="font-medium">{event.organizerName} ({event.organizerEmail})</p>
                  </div>
                  {event.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium">{event.description}</p>
                    </div>
                  )}
                </div>

                <Button variant="outline" asChild>
                  <Link to={`/events/${event.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Link>
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="p-6 rounded-lg border border-destructive/50 bg-destructive/5">
                <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Deleting this event will permanently remove all attendees and passes.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{event.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the event and all associated data including {attendees.length} attendees and {passes.length} passes. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteEvent}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageWrapper>
    </>
  );
}
