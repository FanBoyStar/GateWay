import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useEventStore } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { parseCSV, generateSampleCSV, type CSVRow } from '@/utils/csvParser';
import { Upload, FileText, Check, CircleAlert as AlertCircle, Download, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function BulkUpload() {
  const { eventId } = useParams<{ eventId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');
  const [_file, setFile] = useState<File | null>(null);
  void _file; // Store file reference for potential future use
  const [parseResult, setParseResult] = useState<{
    validRows: CSVRow[];
    errorRows: CSVRow[];
    totalRows: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);

  const { getEventById } = useEventStore();
  const { bulkAddAttendees } = useAttendeeStore();
  const { bulkGeneratePasses } = usePassStore();

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setStep('processing');

    try {
      const result = await parseCSV(selectedFile);
      setParseResult(result);
      setStep('preview');
    } catch (error) {
      toast.error('Failed to parse CSV file');
      setStep('upload');
    }
  };

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-attendees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded');
  };

  const handleConfirmUpload = async () => {
    if (!parseResult || parseResult.validRows.length === 0) {
      toast.error('No valid rows to process');
      return;
    }

    setStep('processing');
    setProgress(0);

    // Add attendees in batches
    const batchSize = 10;
    const validRows = parseResult.validRows;
    const totalBatches = Math.ceil(validRows.length / batchSize);
    const allNewAttendees: Array<{ attendeeId: string; eventId: string; attendeeName: string; ticketType: string }> = [];

    for (let i = 0; i < totalBatches; i++) {
      const batch = validRows.slice(i * batchSize, (i + 1) * batchSize);

      const newAttendees = bulkAddAttendees(eventId || '', batch.map(row => ({
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        ticketType: row.ticketType,
        seatNumber: row.seatNumber || '',
        notes: row.notes || '',
      })));

      newAttendees.forEach(attendee => {
        allNewAttendees.push({
          attendeeId: attendee.id,
          eventId: eventId || '',
          attendeeName: attendee.name,
          ticketType: attendee.ticketType,
        });
      });

      setProgress(((i + 1) / totalBatches) * 100);
      setGeneratedCount(allNewAttendees.length);

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate all passes
    bulkGeneratePasses(allNewAttendees);

    setStep('complete');
    toast.success(`Generated ${allNewAttendees.length} passes`);
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setParseResult(null);
    setProgress(0);
    setGeneratedCount(0);
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to={`/events/${eventId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event
            </Link>
          </Button>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Bulk Upload Attendees
            </h1>
            <p className="text-muted-foreground mb-6">
              Upload a CSV file to generate passes for multiple attendees at once
            </p>

            {step === 'upload' && (
              <div className="space-y-6">
                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-[var(--neon-primary)] hover:bg-[var(--neon-primary-soft)]/5 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Drop your CSV here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV format: Name, Email, Phone (optional), Ticket Type
                  </p>
                </div>

                {/* Sample Download */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Need a template?</p>
                      <p className="text-xs text-muted-foreground">
                        Download our sample CSV file
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadSample}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Sample
                  </Button>
                </div>
              </div>
            )}

            {step === 'preview' && parseResult && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{parseResult.totalRows}</p>
                    <p className="text-sm text-muted-foreground">Total Rows</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-500/10">
                    <p className="text-2xl font-bold text-emerald-500">{parseResult.validRows.length}</p>
                    <p className="text-sm text-muted-foreground">Valid Rows</p>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10">
                    <p className="text-2xl font-bold text-destructive">{parseResult.errorRows.length}</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">#</th>
                          <th className="px-4 py-2 text-left font-medium">Name</th>
                          <th className="px-4 py-2 text-left font-medium">Email</th>
                          <th className="px-4 py-2 text-left font-medium">Ticket</th>
                          <th className="px-4 py-2 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[...parseResult.validRows.slice(0, 10), ...parseResult.errorRows.slice(0, 5)].map((row, index) => (
                          <tr key={index} className={row.errors.length > 0 ? 'bg-destructive/5' : ''}>
                            <td className="px-4 py-2 text-muted-foreground">{row.rowNumber}</td>
                            <td className="px-4 py-2">{row.name || <span className="text-muted-foreground italic">empty</span>}</td>
                            <td className="px-4 py-2">{row.email || <span className="text-muted-foreground italic">empty</span>}</td>
                            <td className="px-4 py-2">{row.ticketType}</td>
                            <td className="px-4 py-2">
                              {row.errors.length > 0 ? (
                                <span className="flex items-center gap-1 text-destructive">
                                  <AlertCircle className="h-3 w-3" />
                                  {row.errors[0]}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-emerald-500">
                                  <Check className="h-3 w-3" />
                                  Valid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmUpload}
                    disabled={parseResult.validRows.length === 0}
                  >
                    Process {parseResult.validRows.length} Valid Rows
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-12 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-[var(--neon-primary-soft)] mx-auto flex items-center justify-center animate-pulse">
                  <Upload className="h-8 w-8 text-[var(--neon-primary)]" />
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-2 w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Processing attendees... {generatedCount} generated
                  </p>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="py-12 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 mx-auto flex items-center justify-center">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Bulk Upload Complete!</h2>
                  <p className="text-muted-foreground">
                    Successfully generated {generatedCount} passes
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" asChild>
                    <Link to={`/events/${eventId}`}>Back to Event</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/events/${eventId}`}>
                      View All Passes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
