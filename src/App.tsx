import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { OrganizationSetupModal } from '@/components/OrganizationSetupModal';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import Dashboard from '@/pages/Dashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();
  const [showOrgModal, setShowOrgModal] = useState(false);

  useEffect(() => {
    // Show organization setup modal on first login (when user exists but is not onboarded)
    if (user && !user.is_onboarded && !loading) {
      setShowOrgModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/sign-in'} replace />} />
      </Routes>

      {user && !user.is_onboarded && (
        <OrganizationSetupModal
          open={showOrgModal}
          onComplete={() => setShowOrgModal(false)}
        />
      )}
    </>
  );
}
