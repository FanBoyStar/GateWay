import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-primary-soft)] via-transparent to-[var(--neon-accent-soft)] opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-primary)]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-accent)]/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-[var(--neon-primary)] flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span
            className="font-bold text-xl ml-2"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            PassGen
          </span>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-lg">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your PassGen account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
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

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[var(--neon-primary)] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="font-semibold text-[var(--neon-primary)] hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          <Link to="/" className="hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
