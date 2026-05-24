import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { formatTimeAgo } from '@/utils/dateHelpers';
import { ScanLine, Search, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

interface ScanLog {
  passId: string;
  attendeeName: string;
  eventName: string;
  ticketType: string;
  status: 'valid' | 'used' | 'invalid';
  timestamp: Date;
}

export function ScanVerify() {
  const [passIdInput, setPassIdInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'valid' | 'used' | 'invalid' | null;
    data?: {
      passId: string;
      attendeeName: string;
      eventName: string;
      ticketType: string;
      event: any;
      attendee: any;
      pass: any;
    };
  }>({ type: null });
  const [scanLog, setScanLog] = useState<ScanLog[]>([]);

  const { getEventById } = useEventStore();
  const { getAttendeeById } = useAttendeeStore();
  const { getPassById, markAsUsed } = usePassStore();

  const handleVerify = () => {
    const trimmedId = passIdInput.trim().toUpperCase();

    if (!trimmedId) {
      toast.error('Please enter a pass ID');
      return;
    }

    // Try to find pass by ID
    const pass = getPassById(trimmedId);

    if (!pass) {
      setScanResult({
        type: 'invalid',
        data: {
          passId: trimmedId,
          attendeeName: 'Unknown',
          eventName: 'Unknown',
          ticketType: 'Unknown',
          event: null,
          attendee: null,
          pass: null,
        },
      });
      addToLog(trimmedId, 'Unknown', 'Unknown', 'Unknown', 'invalid');
      return;
    }

    const attendee = getAttendeeById(pass.attendeeId);
    const event = getEventById(pass.eventId);

    if (!attendee || !event) {
      setScanResult({
        type: 'invalid',
        data: {
          passId: trimmedId,
          attendeeName: 'Unknown',
          eventName: 'Unknown',
          ticketType: 'Unknown',
          event: null,
          attendee: null,
          pass,
        },
      });
      addToLog(trimmedId, 'Unknown', 'Unknown', 'Unknown', 'invalid');
      return;
    }

    if (pass.status === 'used') {
      setScanResult({
        type: 'used',
        data: {
          passId: pass.id,
          attendeeName: attendee.name,
          eventName: event.name,
          ticketType: attendee.ticketType,
          event,
          attendee,
          pass,
        },
      });
      addToLog(pass.id, attendee.name, event.name, attendee.ticketType, 'used');
      return;
    }

    if (pass.status === 'cancelled') {
      setScanResult({
        type: 'invalid',
        data: {
          passId: pass.id,
          attendeeName: attendee.name,
          eventName: event.name,
          ticketType: attendee.ticketType,
          event,
          attendee,
          pass,
        },
      });
      addToLog(pass.id, attendee.name, event.name, attendee.ticketType, 'invalid');
      return;
    }

    // Valid unused pass
    setScanResult({
      type: 'valid',
      data: {
        passId: pass.id,
        attendeeName: attendee.name,
        eventName: event.name,
        ticketType: attendee.ticketType,
        event,
        attendee,
        pass,
      },
    });
    addToLog(pass.id, attendee.name, event.name, attendee.ticketType, 'valid');
  };

  const handleMarkAsUsed = () => {
    if (!scanResult.data?.pass) return;

    markAsUsed(scanResult.data.pass.id);
    toast.success('Pass marked as used');

    setScanResult({
      type: 'used',
      data: scanResult.data,
    });
  };

  const addToLog = (
    passId: string,
    attendeeName: string,
    eventName: string,
    ticketType: string,
    status: 'valid' | 'used' | 'invalid'
  ) => {
    setScanLog((prev) => [
      {
        passId,
        attendeeName,
        eventName,
        ticketType,
        status,
        timestamp: new Date(),
      },
      ...prev.slice(0, 49),
    ]);
  };

  const handleScanNext = () => {
    setPassIdInput('');
    setScanResult({ type: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-2xl font-bold mb-2 text-center lg:text-left"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Scan & Verify Passes
          </h1>
          <p className="text-muted-foreground mb-6 text-center lg:text-left">
            Enter a pass ID manually or scan QR code to verify attendees
          </p>

          {/* Manual Entry */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-[var(--neon-primary-soft)] flex items-center justify-center">
                <Keyboard className="h-5 w-5 text-[var(--neon-primary)]" />
              </div>
              <div>
                <h2 className="font-semibold">Manual Entry</h2>
                <p className="text-sm text-muted-foreground">Enter pass ID to verify</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="EVT-XXXXXX-0000"
                  value={passIdInput}
                  onChange={(e) => setPassIdInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="font-mono text-lg tracking-wider"
                />
                <Button onClick={handleVerify}>
                  <Search className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          </div>

          {/* Scan Result */}
          {scanResult.type && scanResult.data && (
            <div
              className={`rounded-2xl border-2 p-6 mb-6 animate-slide-up ${
                scanResult.type === 'valid'
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : scanResult.type === 'used'
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-destructive/50 bg-destructive/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {scanResult.type === 'valid' && (
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                )}
                {scanResult.type === 'used' && (
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                )}
                {scanResult.type === 'invalid' && (
                  <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">
                    {scanResult.type === 'valid' && 'Valid Pass'}
                    {scanResult.type === 'used' && 'Already Scanned'}
                    {scanResult.type === 'invalid' && 'Invalid Pass'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{scanResult.data.attendeeName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Event:</span>
                      <span className="font-medium">{scanResult.data.eventName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Ticket:</span>
                      <span className="font-medium">{scanResult.data.ticketType}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Pass ID:</span>
                      <span className="font-mono">{scanResult.data.passId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {scanResult.type === 'valid' && (
                  <>
                    <Button onClick={handleMarkAsUsed} className="bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Used
                    </Button>
                    <Button variant="outline" onClick={handleScanNext}>
                      Scan Next
                    </Button>
                  </>
                )}
                {(scanResult.type === 'used' || scanResult.type === 'invalid') && (
                  <Button variant="outline" onClick={handleScanNext}>
                    Scan Next
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Recent Scans */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Recent Scans ({scanLog.length})</h2>

            {scanLog.length > 0 ? (
              <div className="space-y-2">
                {scanLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          log.status === 'valid'
                            ? 'bg-emerald-500'
                            : log.status === 'used'
                              ? 'bg-amber-500'
                              : 'bg-destructive'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{log.attendeeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.eventName} - {log.ticketType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground">{log.passId}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(log.timestamp.toISOString())}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scans yet today</p>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
