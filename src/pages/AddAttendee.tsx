import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { attendeeFormSchema, type AttendeeFormData } from '@/utils/validators';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ticketTypes = [
  'VIP',
  'General Admission',
  'Speaker',
  'Staff',
  'Press',
];

export function AddAttendee() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdAttendee, setCreatedAttendee] = useState<{
    name: string;
    passId: string;
  } | null>(null);

  const { getEventById } = useEventStore();
  const { addAttendee } = useAttendeeStore();
  const { generatePass } = usePassStore();

  const event = getEventById(eventId || '');

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      ticketType: 'General Admission',
      seatNumber: '',
      notes: '',
      sendEmail: false,
    },
  });

  const onSubmit = async (data: AttendeeFormData) => {
    const newAttendee = addAttendee(eventId || '', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      ticketType: data.ticketType,
      seatNumber: data.seatNumber || '',
      notes: data.notes || '',
    });

    const newPass = generatePass(
      newAttendee.id,
      eventId || '',
      {
        attendeeName: newAttendee.name,
        ticketType: newAttendee.ticketType,
      }
    );

    setCreatedAttendee({ name: newAttendee.name, passId: newPass.id });
    setShowSuccessDialog(true);

    // If sendEmail is true, open email client
    if (data.sendEmail && data.email) {
      const link = `${window.location.origin}/passes/${newPass.id}`;
      const subject = encodeURIComponent(`Your Pass for ${event.name}`);
      const body = encodeURIComponent(
        `Hi ${data.name},\n\nYour pass for ${event.name} is ready!\n\nView your pass here: ${link}\n\nSee you at the event!`
      );
      window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    }

    toast.success(`Pass created for ${newAttendee.name}`);
  };

  const handleAddAnother = () => {
    reset();
    setShowSuccessDialog(false);
  };

  const handleViewPass = () => {
    if (createdAttendee) {
      navigate(`/passes/${createdAttendee.passId}`);
    }
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to={`/events/${eventId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event
            </Link>
          </Button>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                Add Attendee
              </h1>
              <p className="text-muted-foreground">
                Add a new attendee for {event.name} and generate their pass
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="John Doe"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="+1 555-1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticketType">Ticket / Pass Type *</Label>
                    <Controller
                      name="ticketType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ticket type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ticketTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                            <SelectItem value="Custom">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.ticketType && (
                      <p className="text-sm text-destructive mt-1">{errors.ticketType.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="seatNumber">Seat / Table Number (Optional)</Label>
                  <Input
                    id="seatNumber"
                    {...register('seatNumber')}
                    placeholder="A-12 or Table 5"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="sendEmail"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="sendEmail"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label
                    htmlFor="sendEmail"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Send pass via email
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" asChild>
                  <Link to={`/events/${eventId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Create Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      </PageWrapper>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-500" />
              Pass Created Successfully!
            </DialogTitle>
            <DialogDescription>
              A pass has been generated for {createdAttendee?.name}. Pass ID:{' '}
              <span className="font-mono text-xs">{createdAttendee?.passId}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleAddAnother}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another
            </Button>
            <Button onClick={handleViewPass}>View Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
