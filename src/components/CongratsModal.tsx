import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { VisuallyHidden } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { PartyPopper, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CongratsModalProps {
  open: boolean;
  eventId: string;
  eventName: string;
  onClose: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 0.8}s`,
  duration: `${1.2 + Math.random() * 0.8}s`,
  color: i % 4 === 0 ? '#E8186D' : i % 4 === 1 ? '#a855f7' : i % 4 === 2 ? '#f59e0b' : '#22d3ee',
  size: `${6 + Math.random() * 8}px`,
}));

export function CongratsModal({ open, eventId, eventName, onClose }: CongratsModalProps) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    } else {
      setAnimate(false);
    }
  }, [open]);

  const handleViewEvent = () => {
    onClose();
    navigate(`/events/${eventId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 focus:outline-none">
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>Congratulations on your first event!</DialogPrimitive.Title>
            <DialogPrimitive.Description>Your event has been created successfully.</DialogPrimitive.Description>
          </VisuallyHidden.Root>
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-8 text-center shadow-2xl transition-all duration-500',
              animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            )}
            style={{ boxShadow: '0 0 60px rgba(232,24,109,0.25), 0 0 120px rgba(168,85,247,0.1)' }}
          >
            {/* Confetti particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {PARTICLES.map((p) => (
                <span
                  key={p.id}
                  className="absolute top-0 rounded-full"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    animation: open ? `confettiFall ${p.duration} ${p.delay} ease-in forwards` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--neon-primary)]/5 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-primary)] to-purple-600 shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(232,24,109,0.5)' }}>
              <PartyPopper className="h-9 w-9 text-white" />
            </div>

            {/* Text */}
            <div className="relative space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <p className="text-sm font-medium text-yellow-400 uppercase tracking-widest">
                  First Event Created!
                </p>
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </div>

              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Congratulations!
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed">
                <span className="text-white font-medium">{eventName}</span> is ready to go.
                <br />
                Start adding attendees and sharing passes.
              </p>
            </div>

            {/* Actions */}
            <div className="relative flex flex-col gap-3">
              <Button
                onClick={handleViewEvent}
                className="w-full rounded-full py-5 text-base font-semibold bg-[var(--neon-primary)] neon-glow neon-glow-hover"
              >
                View My Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                I'll explore later
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </Dialog>
  );
}
