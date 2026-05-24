import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventType =
  | 'Conference'
  | 'Wedding'
  | 'Workshop'
  | 'Meetup'
  | 'Private Party'
  | 'Other';

export type PassTemplate = 'classic' | 'minimal' | 'vibrant';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  organizerWebsite: string;
  brandColor: string;
  bannerImage: string;
  template: PassTemplate;
  darkBackground: boolean;
  expectedCount: number;
  createdAt: string;
  status: 'upcoming' | 'active' | 'completed';
}

interface EventState {
  events: Event[];
  createEvent: (data: Omit<Event, 'id' | 'createdAt' | 'status'>) => Event;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  getAllEvents: () => Event[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      createEvent: (data) => {
        const id = crypto.randomUUID();
        const eventDate = new Date(data.date);
        const now = new Date();

        let status: Event['status'] = 'upcoming';
        if (eventDate.toDateString() === now.toDateString()) {
          status = 'active';
        } else if (eventDate < now) {
          status = 'completed';
        }

        const newEvent: Event = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          status,
        };

        set((state) => ({
          events: [...state.events, newEvent],
        }));

        return newEvent;
      },

      updateEvent: (id, data) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...data } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      getEventById: (id) => {
        return get().events.find((event) => event.id === id);
      },

      getAllEvents: () => {
        return get().events;
      },
    }),
    {
      name: 'events-storage',
    }
  )
);
