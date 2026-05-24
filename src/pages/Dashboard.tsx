import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {user && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">Name</h2>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">Email</h2>
              <p className="text-lg">{user.email}</p>
            </div>
            {user.organization_name && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Organization</h2>
                <p className="text-lg">{user.organization_name}</p>
              </div>
            )}
            {user.organization_website && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Website</h2>
                <p className="text-lg">{user.organization_website}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
