import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { PassCard } from '@/components/passes/PassCard';
import { StatusBadge } from '@/components/passes/StatusBadge';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import {
  downloadPassAsPng,
  downloadPassAsPdf,
  copyPassLinkToClipboard,
  openEmailWithPassLink,
} from '@/utils/passRenderer';
import { formatDateTime } from '@/utils/dateHelpers';
import { FileImage, FileText, Mail, RefreshCw, Copy, ArrowLeft, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PassViewer() {
  const { passId } = useParams<{ passId: string }>();
  const passRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { getPassById, regeneratePass } = usePassStore();
  const { getAttendeeById } = useAttendeeStore();
  const { getEventById } = useEventStore();

  const pass = getPassById(passId || '');
  const attendee = pass ? getAttendeeById(pass.attendeeId) : undefined;
  const event = pass ? getEventById(pass.eventId) : undefined;

  if (!pass || !attendee || !event) {
    return (
      <>
        <TopBar />
        <Sidebar />
        <BottomNav />
        <PageWrapper>
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Pass not found</h2>
            <p className="text-muted-foreground mb-4">
              The pass you are looking for does not exist or has been deleted.
            </p>
            <Button asChild>
              <Link to="/passes">Back to Passes</Link>
            </Button>
          </div>
        </PageWrapper>
      </>
    );
  }

  const handleDownloadPng = async () => {
    if (!passRef.current) return;
    setIsDownloading(true);
    try {
      await downloadPassAsPng(passRef.current, pass.id);
      toast.success('Pass downloaded as PNG');
    } catch (error) {
      toast.error('Failed to download pass');
    }
    setIsDownloading(false);
  };

  const handleDownloadPdf = async () => {
    if (!passRef.current) return;
    setIsDownloading(true);
    try {
      await downloadPassAsPdf(passRef.current, pass.id);
      toast.success('Pass downloaded as PDF');
    } catch (error) {
      toast.error('Failed to download pass');
    }
    setIsDownloading(false);
  };

  const handleCopyLink = async () => {
    const success = await copyPassLinkToClipboard(pass.id);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleSendEmail = () => {
    openEmailWithPassLink(pass.id, attendee.name, event.name);
  };

  const handleRegenerate = () => {
    const newPass = regeneratePass(pass.id);
    if (newPass) {
      toast.success('Pass regenerated with new ID: ' + newPass.id);
      window.location.href = `/passes/${newPass.id}`;
    } else {
      toast.error('Failed to regenerate pass');
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
            <Link to={`/events/${event.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event
            </Link>
          </Button>

          {/* Pass Display */}
          <div className="flex justify-center mb-6">
            <div ref={passRef}>
              <PassCard event={event} attendee={attendee} pass={pass} size="full" />
            </div>
          </div>

          {/* Verification Status */}
          <div className="mb-6 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {pass.status === 'unused' && (
                  <>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                    <div>
                      <p className="font-medium text-emerald-500">Valid — Not Yet Used</p>
                      <p className="text-sm text-muted-foreground">
                        Present this QR code at the entrance
                      </p>
                    </div>
                  </>
                )}
                {pass.status === 'used' && (
                  <>
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Scanned</p>
                      <p className="text-sm text-muted-foreground">
                        {pass.usedAt ? formatDateTime(pass.usedAt) : 'Used'}
                      </p>
                    </div>
                  </>
                )}
                {pass.status === 'cancelled' && (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Pass Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        This pass has been invalidated
                      </p>
                    </div>
                  </>
                )}
              </div>
              <StatusBadge status={pass.status} />
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16" onClick={handleDownloadPng} disabled={isDownloading}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--neon-primary-soft)]">
                  <FileImage className="h-5 w-5 text-[var(--neon-primary)]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Download PNG</p>
                  <p className="text-xs text-muted-foreground">Shareable image</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-16" onClick={handleDownloadPdf} disabled={isDownloading}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--neon-accent-soft)]">
                  <FileText className="h-5 w-5 text-[var(--neon-accent)]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Download PDF</p>
                  <p className="text-xs text-muted-foreground">Print-ready A6 size</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-16" onClick={handleCopyLink}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/15">
                  <Copy className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Copy Link</p>
                  <p className="text-xs text-muted-foreground">Share pass URL</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="h-16" onClick={handleSendEmail}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15">
                  <Mail className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Send via Email</p>
                  <p className="text-xs text-muted-foreground">Open email client</p>
                </div>
              </div>
            </Button>
          </div>

          {/* Regenerate */}
          <div className="mt-6 pt-6 border-t border-border">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-muted-foreground">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Pass (invalidate old)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Regenerate this pass?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create a new pass with a different ID. The current pass will be marked as cancelled and will no longer work for entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRegenerate}>
                    Regenerate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
