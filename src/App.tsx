import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { PassCard } from '@/components/passes/PassCard';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages
import GatewayLanding from '@/pages/GatewayLanding';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { Dashboard } from '@/pages/Dashboard';
import { CreateEvent } from '@/pages/CreateEvent';
import { EventDetail } from '@/pages/EventDetail';
import { EventsList } from '@/pages/EventsList';
import { AddAttendee } from '@/pages/AddAttendee';
import { PassViewer } from '@/pages/PassViewer';
import { AllPasses } from '@/pages/AllPasses';
import { BulkUpload } from '@/pages/BulkUpload';
import { ScanVerify } from '@/pages/ScanVerify';
import { Profile } from '@/pages/Profile';

function DemoPassPage() {
  const demoEvent = {
    id: 'demo',
    name: 'Tech Summit 2026',
    type: 'Conference' as const,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '18:00',
    venue: 'Grand Convention Center',
    address: '123 Innovation Ave, Tech City',
    description: 'Annual technology summit featuring keynotes, workshops, and networking.',
    organizerName: 'Tech Events Inc.',
    organizerEmail: 'info@techsummit.com',
    organizerWebsite: 'https://techsummit.com',
    brandColor: '#E8186D',
    bannerImage: '',
    template: 'classic' as const,
    darkBackground: true,
    expectedCount: 500,
    createdAt: new Date().toISOString(),
    status: 'upcoming' as const,
  };

  const demoAttendee = {
    id: 'demo-attendee',
    eventId: 'demo',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 555-1234',
    ticketType: 'VIP',
    seatNumber: 'A-12',
    notes: 'Speaker at the event',
    createdAt: new Date().toISOString(),
  };

  const demoPass = {
    id: 'EVT-DEMO01-0001',
    attendeeId: 'demo-attendee',
    eventId: 'demo',
    qrData: JSON.stringify({
      passId: 'EVT-DEMO01-0001',
      eventId: 'demo',
      attendeeName: 'Jane Smith',
      ticketType: 'VIP',
      timestamp: new Date().toISOString(),
    }),
    status: 'unused' as const,
    usedAt: null,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Demo Pass Preview
          </h1>
          <p className="text-muted-foreground">This is what an event pass looks like</p>
        </div>
        <div className="flex justify-center mb-6">
          <div id="demo-pass">
            <PassCard event={demoEvent} attendee={demoAttendee} pass={demoPass} size="full" />
          </div>
        </div>
        <div className="text-center">
          <Button asChild>
            <Link to="/sign-up">Get Started — It's Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GatewayLanding />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/passes/demo" element={<DemoPassPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
          <Route path="/events/new" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
          <Route path="/events/:eventId/add-attendee" element={<ProtectedRoute><AddAttendee /></ProtectedRoute>} />
          <Route path="/events/:eventId/bulk" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
          <Route path="/passes" element={<ProtectedRoute><AllPasses /></ProtectedRoute>} />
          <Route path="/passes/:passId" element={<ProtectedRoute><PassViewer /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><ScanVerify /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
