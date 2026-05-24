import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PassStatus = 'unused' | 'used' | 'cancelled';

export interface Pass {
  id: string;
  attendeeId: string;
  eventId: string;
  qrData: string;
  status: PassStatus;
  usedAt: string | null;
  createdAt: string;
}

interface PassState {
  passes: Pass[];
  generatePass: (attendeeId: string, eventId: string, eventData: {
    attendeeName: string;
    ticketType: string;
  }) => Pass;
  markAsUsed: (passId: string) => void;
  regeneratePass: (passId: string) => Pass | null;
  getPassByAttendee: (attendeeId: string) => Pass | undefined;
  getPassById: (passId: string) => Pass | undefined;
  getPassesByEvent: (eventId: string) => Pass[];
  bulkGeneratePasses: (attendees: Array<{ attendeeId: string; eventId: string; attendeeName: string; ticketType: string }>) => Pass[];
  getPassCounts: () => { total: number; unused: number; used: number; cancelled: number };
}

export function generatePassId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'EVT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 4; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export const usePassStore = create<PassState>()(
  persist(
    (set, get) => ({
      passes: [],

      generatePass: (attendeeId, eventId, { attendeeName, ticketType }) => {
        const id = generatePassId();
        const qrData = JSON.stringify({
          passId: id,
          eventId,
          attendeeName,
          ticketType,
          timestamp: new Date().toISOString(),
        });

        const newPass: Pass = {
          id,
          attendeeId,
          eventId,
          qrData,
          status: 'unused',
          usedAt: null,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          passes: [...state.passes, newPass],
        }));

        return newPass;
      },

      markAsUsed: (passId) => {
        set((state) => ({
          passes: state.passes.map((pass) =>
            pass.id === passId
              ? { ...pass, status: 'used' as PassStatus, usedAt: new Date().toISOString() }
              : pass
          ),
        }));
      },

      regeneratePass: (passId) => {
        const existingPass = get().passes.find((p) => p.id === passId);
        if (!existingPass) return null;

        // Mark old pass as cancelled
        set((state) => ({
          passes: state.passes.map((pass) =>
            pass.id === passId ? { ...pass, status: 'cancelled' as PassStatus } : pass
          ),
        }));

        // Generate new pass
        const parsedQr = JSON.parse(existingPass.qrData);
        const newId = generatePassId();
        const newQrData = JSON.stringify({
          ...parsedQr,
          passId: newId,
          timestamp: new Date().toISOString(),
        });

        const newPass: Pass = {
          id: newId,
          attendeeId: existingPass.attendeeId,
          eventId: existingPass.eventId,
          qrData: newQrData,
          status: 'unused',
          usedAt: null,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          passes: [...state.passes, newPass],
        }));

        return newPass;
      },

      getPassByAttendee: (attendeeId) => {
        const passes = get().passes.filter((p) => p.attendeeId === attendeeId);
        // Return the most recent non-cancelled pass
        const activePasses = passes.filter((p) => p.status !== 'cancelled');
        if (activePasses.length === 0) return passes[passes.length - 1];
        return activePasses[activePasses.length - 1];
      },

      getPassById: (passId) => {
        return get().passes.find((pass) => pass.id === passId);
      },

      getPassesByEvent: (eventId) => {
        return get().passes.filter((pass) => pass.eventId === eventId);
      },

      bulkGeneratePasses: (attendees) => {
        const newPasses: Pass[] = attendees.map(({ attendeeId, eventId, attendeeName, ticketType }) => {
          const id = generatePassId();
          const qrData = JSON.stringify({
            passId: id,
            eventId,
            attendeeName,
            ticketType,
            timestamp: new Date().toISOString(),
          });

          return {
            id,
            attendeeId,
            eventId,
            qrData,
            status: 'unused' as PassStatus,
            usedAt: null,
            createdAt: new Date().toISOString(),
          };
        });

        set((state) => ({
          passes: [...state.passes, ...newPasses],
        }));

        return newPasses;
      },

      getPassCounts: () => {
        const passes = get().passes;
        return {
          total: passes.length,
          unused: passes.filter((p) => p.status === 'unused').length,
          used: passes.filter((p) => p.status === 'used').length,
          cancelled: passes.filter((p) => p.status === 'cancelled').length,
        };
      },
    }),
    {
      name: 'passes-storage',
    }
  )
);
