import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  type: z.enum(['Conference', 'Wedding', 'Workshop', 'Meetup', 'Private Party', 'Other']),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  venue: z.string().min(1, 'Venue name is required'),
  address: z.string().optional(),
  description: z.string().max(300, 'Description must be 300 characters or less').optional(),
  organizerName: z.string().min(1, 'Organizer name is required'),
  organizerEmail: z.string().email('Valid email required'),
  organizerWebsite: z.string().url('Valid URL required').optional().or(z.literal('')),
  expectedCount: z.number().min(0).optional(),
});

export const attendeeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  ticketType: z.string().min(1, 'Ticket type is required'),
  seatNumber: z.string().optional(),
  notes: z.string().optional(),
  sendEmail: z.boolean().optional(),
});

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  organizationName: z.string().optional(),
  website: z.string().url('Valid URL required').optional().or(z.literal('')),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
export type AttendeeFormData = z.infer<typeof attendeeFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
