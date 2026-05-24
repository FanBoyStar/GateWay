import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight } from 'lucide-react';
import { AuthBackground } from '@/components/auth/AuthBackground';

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center p-4" style={{ background: '#0D0D12' }}>
      <AuthBackground />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" href="/" />
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome back
            </h1>
            <p className="text-muted-foreground">Sign in to your Gateway account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="h-10 rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="h-10 rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white font-semibold neon-glow neon-glow-hover transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/sign-up" className="font-semibold text-[var(--neon-primary)] hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          <Link to="/" className="hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
