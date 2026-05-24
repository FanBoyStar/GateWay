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

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
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

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName);

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
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-muted-foreground">Join Gateway to start creating beautiful event passes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                className="h-10 rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>

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
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
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
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/sign-in" className="font-semibold text-[var(--neon-primary)] hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
