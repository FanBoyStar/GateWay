import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CongratsModal } from '@/components/CongratsModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { TemplateSelector } from '@/components/passes/TemplateSelector';
import { PassCard } from '@/components/passes/PassCard';
import { useEventStore, type EventType, type PassTemplate } from '@/store/useEventStore';
import { eventFormSchema, type EventFormData } from '@/utils/validators';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Palette,
  Eye,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const eventTypes: EventType[] = [
  'Conference',
  'Wedding',
  'Workshop',
  'Meetup',
  'Private Party',
  'Other',
];

const steps = [
  { id: 1, name: 'Details', icon: Calendar },
  { id: 2, name: 'Branding', icon: Palette },
  { id: 3, name: 'Preview', icon: Eye },
];

export function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent, events } = useEventStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{ id: string; name: string } | null>(null);
  const [bannerImage, setBannerImage] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<PassTemplate>('classic');
  const [darkBackground, setDarkBackground] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      type: 'Conference',
      date: '',
      startTime: '09:00',
      endTime: '18:00',
      venue: '',
      address: '',
      description: '',
      organizerName: '',
      organizerEmail: '',
      organizerWebsite: '',
      expectedCount: 0,
    },
  });

  const watchedFields = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EventFormData) => {
    const isFirstEvent = events.length === 0;

    const event = createEvent({
      name: data.name,
      type: data.type as EventType,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      venue: data.venue,
      address: data.address || '',
      description: data.description || '',
      organizerName: data.organizerName,
      organizerEmail: data.organizerEmail,
      organizerWebsite: data.organizerWebsite || '',
      brandColor: '#E8186D',
      bannerImage,
      template: selectedTemplate,
      darkBackground,
      expectedCount: data.expectedCount || 0,
    });

    if (isFirstEvent) {
      setCreatedEvent({ id: event.id, name: event.name });
      setCongratsOpen(true);
    } else {
      toast.success('Event created successfully!');
      navigate(`/events/${event.id}`);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        watchedFields.name &&
        watchedFields.date &&
        watchedFields.startTime &&
        watchedFields.endTime &&
        watchedFields.venue &&
        watchedFields.organizerName &&
        watchedFields.organizerEmail
      );
    }
    return true;
  };

  // Mock attendee and pass for preview
  const mockAttendee = {
    id: 'preview',
    eventId: 'preview',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '',
    ticketType: 'VIP',
    seatNumber: 'A-12',
    notes: '',
    createdAt: new Date().toISOString(),
  };

  const mockPass = {
    id: 'EVT-PREVIEW-0000',
    attendeeId: 'preview',
    eventId: 'preview',
    qrData: JSON.stringify({
      passId: 'EVT-PREVIEW-0000',
      eventId: 'preview',
      attendeeName: 'John Doe',
      ticketType: 'VIP',
      timestamp: new Date().toISOString(),
    }),
    status: 'unused' as const,
    usedAt: null,
    createdAt: new Date().toISOString(),
  };

  const previewEvent = {
    id: 'preview',
    name: watchedFields.name || 'Event Name',
    type: watchedFields.type as EventType,
    date: watchedFields.date || new Date().toISOString(),
    startTime: watchedFields.startTime,
    endTime: watchedFields.endTime,
    venue: watchedFields.venue || 'Venue Name',
    address: watchedFields.address || '',
    description: watchedFields.description || '',
    organizerName: watchedFields.organizerName || 'Organizer',
    organizerEmail: watchedFields.organizerEmail || 'email@example.com',
    organizerWebsite: watchedFields.organizerWebsite || '',
    brandColor: '#E8186D',
    bannerImage,
    template: selectedTemplate,
    darkBackground,
    expectedCount: watchedFields.expectedCount || 0,
    createdAt: new Date().toISOString(),
    status: 'upcoming' as const,
  };

  return (
    <>
      {createdEvent && (
        <CongratsModal
          open={congratsOpen}
          eventId={createdEvent.id}
          eventName={createdEvent.name}
          onClose={() => {
            setCongratsOpen(false);
            navigate(`/events/${createdEvent.id}`);
          }}
        />
      )}
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                      isActive && 'bg-[var(--neon-primary)] text-white',
                      isComplete && 'bg-[var(--neon-primary-soft)] text-[var(--neon-primary)]',
                      !isActive && !isComplete && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-8 h-0.5 mx-2',
                        currentStep > step.id ? 'bg-[var(--neon-primary)]' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Event Details
                </h2>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Annual Tech Conference 2026"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Event Type *</Label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register('date')}
                        className={errors.date ? 'border-destructive' : ''}
                      />
                      {errors.date && (
                        <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...register('startTime')}
                        className={errors.startTime ? 'border-destructive' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...register('endTime')}
                        className={errors.endTime ? 'border-destructive' : ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="venue">Venue / Location Name *</Label>
                    <Input
                      id="venue"
                      {...register('venue')}
                      placeholder="Grand Convention Center"
                      className={errors.venue ? 'border-destructive' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="123 Main Street, City, State"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional, max 300 chars)</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="A brief description of your event..."
                      maxLength={300}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(watchedFields.description?.length || 0)}/300
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizerName">Organizer Name *</Label>
                      <Input
                        id="organizerName"
                        {...register('organizerName')}
                        placeholder="Jane Smith"
                        className={errors.organizerName ? 'border-destructive' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizerEmail">Organizer Email *</Label>
                      <Input
                        id="organizerEmail"
                        type="email"
                        {...register('organizerEmail')}
                        placeholder="jane@example.com"
                        className={errors.organizerEmail ? 'border-destructive' : ''}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizerWebsite">Website / Social (Optional)</Label>
                      <Input
                        id="organizerWebsite"
                        {...register('organizerWebsite')}
                        placeholder="https://yoursite.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedCount">Expected Attendees (Optional)</Label>
                      <Input
                        id="expectedCount"
                        type="number"
                        {...register('expectedCount', { valueAsNumber: true })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Branding */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Branding & Design
                </h2>

                <div>
                  <Label className="mb-2 block">Pass Template</Label>
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onSelect={setSelectedTemplate}
                    brandColor="#E8186D"
                  />
                </div>

                <div>
                  <Label htmlFor="bannerImage">Event Banner / Cover Image (Optional)</Label>
                  <div className="mt-2">
                    {bannerImage ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={bannerImage}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setBannerImage('')}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[var(--neon-primary)] transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <Label htmlFor="darkBackground">Dark Pass Background</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark background for pass cards
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkBackground(!darkBackground)}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      darkBackground ? 'bg-[var(--neon-primary)]' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                        darkBackground && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Preview & Confirm
                </h2>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Event Summary</h3>
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Name:</p>
                        <p className="text-sm font-medium">{watchedFields.name || '---'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Type:</p>
                        <p className="text-sm font-medium">{watchedFields.type}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Date:</p>
                        <p className="text-sm font-medium">{watchedFields.date || '---'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Time:</p>
                        <p className="text-sm font-medium">
                          {watchedFields.startTime} - {watchedFields.endTime}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Venue:</p>
                        <p className="text-sm font-medium">{watchedFields.venue || '---'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Organizer:</p>
                        <p className="text-sm font-medium">{watchedFields.organizerName || '---'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-muted-foreground">Template:</p>
                        <p className="text-sm font-medium capitalize">{selectedTemplate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pass Preview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pass Preview</h3>
                    <PassCard
                      event={previewEvent}
                      attendee={mockAttendee}
                      pass={mockPass}
                      size="full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (currentStep === 1) {
                    navigate('/events');
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              )}
            </div>
          </form>
        </div>
      </PageWrapper>
    </>
  );
}
