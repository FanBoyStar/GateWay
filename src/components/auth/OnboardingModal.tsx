import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organizationName: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await completeOnboarding(
      formData.organizationName,
      formData.website || undefined
    );

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    completeOnboarding('').then(() => {
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Syne, sans-serif' }} className="text-2xl">
            Set up your organization
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tell us about your organization. You can skip this for now and update it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-sm font-medium">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Acme Events Co."
              value={formData.organizationName}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-lg border border-input bg-background px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">Website (optional)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://acmeevents.com"
              value={formData.website}
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 h-10 rounded-full border border-border hover:bg-accent/50"
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.organizationName}
              className="flex-1 h-10 rounded-full bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 text-white font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Setting up...
                </div>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
