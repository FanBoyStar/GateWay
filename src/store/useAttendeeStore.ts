import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TicketType =
  | 'VIP'
  | 'General Admission'
  | 'Speaker'
  | 'Staff'
  | 'Press'
  | 'Custom';

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  seatNumber: string;
  notes: string;
  createdAt: string;
}

interface AttendeeState {
  attendees: Attendee[];
  addAttendee: (eventId: string, data: Omit<Attendee, 'id' | 'eventId' | 'createdAt'>) => Attendee;
  updateAttendee: (id: string, data: Partial<Attendee>) => void;
  removeAttendee: (id: string) => void;
  getAttendeesByEvent: (eventId: string) => Attendee[];
  getAttendeeById: (id: string) => Attendee | undefined;
  bulkAddAttendees: (eventId: string, rows: Array<Omit<Attendee, 'id' | 'eventId' | 'createdAt'>>) => Attendee[];
  getAttendeeCount: (eventId: string) => number;
}

export const useAttendeeStore = create<AttendeeState>()(
  persist(
    (set, get) => ({
      attendees: [],

      addAttendee: (eventId, data) => {
        const id = crypto.randomUUID();
        const newAttendee: Attendee = {
          ...data,
          id,
          eventId,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          attendees: [...state.attendees, newAttendee],
        }));

        return newAttendee;
      },

      updateAttendee: (id, data) => {
        set((state) => ({
          attendees: state.attendees.map((attendee) =>
            attendee.id === id ? { ...attendee, ...data } : attendee
          ),
        }));
      },

      removeAttendee: (id) => {
        set((state) => ({
          attendees: state.attendees.filter((attendee) => attendee.id !== id),
        }));
      },

      getAttendeesByEvent: (eventId) => {
        return get().attendees.filter((attendee) => attendee.eventId === eventId);
      },

      getAttendeeById: (id) => {
        return get().attendees.find((attendee) => attendee.id === id);
      },

      bulkAddAttendees: (eventId, rows) => {
        const newAttendees: Attendee[] = rows.map((row) => ({
          ...row,
          id: crypto.randomUUID(),
          eventId,
          createdAt: new Date().toISOString(),
        }));

        set((state) => ({
          attendees: [...state.attendees, ...newAttendees],
        }));

        return newAttendees;
      },

      getAttendeeCount: (eventId) => {
        return get().attendees.filter((a) => a.eventId === eventId).length;
      },
    }),
    {
      name: 'attendees-storage',
    }
  )
);
