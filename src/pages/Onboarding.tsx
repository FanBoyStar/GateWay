import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { ArrowRight, Check, Building2, Palette, Rocket } from 'lucide-react';

const PRESET_COLORS = [
  { hex: '#E8186D', label: 'Neon Pink' },
  { hex: '#7B5CF0', label: 'Electric Violet' },
  { hex: '#0EA5E9', label: 'Sky Blue' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#F97316', label: 'Orange' },
  { hex: '#8B5CF6', label: 'Purple' },
];

const STEPS = [
  { id: 1, label: 'Organization', icon: Building2 },
  { id: 2, label: 'Brand Color', icon: Palette },
  { id: 3, label: 'All Set', icon: Rocket },
];

function isValidHex(hex: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function Onboarding() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [website, setWebsite] = useState('');
  const [brandColor, setBrandColor] = useState('#E8186D');
  const [customHex, setCustomHex] = useState('');
  const [customHexError, setCustomHexError] = useState(false);

  useEffect(() => {
    if (user?.onboarding_completed) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
      return () => clearTimeout(t);
    }
  }, [done, navigate]);

  const handleCustomHex = (val: string) => {
    setCustomHex(val);
    const full = val.startsWith('#') ? val : `#${val}`;
    if (isValidHex(full)) {
      setBrandColor(full);
      setCustomHexError(false);
    } else {
      setCustomHexError(val.length > 0);
    }
  };

  const handleFinish = async () => {
    setError(null);
    setLoading(true);
    const { error } = await completeOnboarding(orgName.trim(), website.trim() || undefined, brandColor);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setStep(3);
      setDone(true);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    await completeOnboarding('');
    navigate('/dashboard', { replace: true });
  };

  const firstName = user?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4" style={{ background: '#0D0D12' }}>
      <AuthBackground />

      <div className="relative w-full max-w-lg z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" href="/" />
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isComplete = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                    style={{
                      borderColor: isActive || isComplete ? 'var(--neon-primary)' : 'rgba(255,255,255,0.15)',
                      background: isComplete ? 'var(--neon-primary)' : isActive ? 'rgba(232,24,109,0.15)' : 'rgba(255,255,255,0.05)',
                      boxShadow: isActive ? '0 0 20px var(--neon-primary-glow)' : 'none',
                    }}
                  >
                    {isComplete
                      ? <Check className="w-5 h-5 text-white" />
                      : <Icon className="w-4 h-4" style={{ color: isActive ? 'var(--neon-primary)' : 'rgba(255,255,255,0.4)' }} />
                    }
                  </div>
                  <span className="text-xs font-medium" style={{ color: isActive ? 'var(--neon-primary)' : 'rgba(255,255,255,0.4)' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-16 h-px mx-2 mb-5 transition-all duration-300"
                    style={{ background: step > s.id ? 'var(--neon-primary)' : 'rgba(255,255,255,0.12)' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8 backdrop-blur-sm"
          style={{
            background: 'rgba(21,21,30,0.85)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {/* ── Step 1: Organization ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Welcome, {firstName}! 👋
                </h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Let's get your workspace set up. This takes under a minute.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-sm font-medium text-white/80">
                    Organization name
                  </Label>
                  <Input
                    id="orgName"
                    type="text"
                    placeholder="Acme Events Co."
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="h-11 rounded-xl border bg-white/5 text-white placeholder:text-white/30 focus:border-[var(--neon-primary)]"
                    style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-white/80">
                    Website <span className="text-white/35 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://acmeevents.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-11 rounded-xl border bg-white/5 text-white placeholder:text-white/30 focus:border-[var(--neon-primary)]"
                    style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  type="button"
                  onClick={handleSkip}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 h-11 rounded-full border border-white/15 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
                >
                  Skip setup
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!orgName.trim()}
                  className="flex-1 h-11 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'var(--neon-primary)', boxShadow: '0 0 24px var(--neon-primary-glow)' }}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Brand color ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Pick your brand color
                </h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  This color will appear on all your event passes and QR codes.
                </p>
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => { setBrandColor(c.hex); setCustomHex(''); setCustomHexError(false); }}
                    className="group flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-150"
                    style={{
                      background: brandColor === c.hex ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: `2px solid ${brandColor === c.hex ? c.hex : 'transparent'}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full transition-transform duration-150 group-hover:scale-110"
                      style={{
                        background: c.hex,
                        boxShadow: brandColor === c.hex ? `0 0 14px ${c.hex}80` : 'none',
                      }}
                    />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom hex */}
              <div className="space-y-2 mb-6">
                <Label className="text-sm font-medium text-white/80">Custom hex color</Label>
                <div className="flex gap-2 items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10 transition-all"
                    style={{ background: brandColor }}
                  />
                  <Input
                    type="text"
                    placeholder="#E8186D"
                    value={customHex}
                    onChange={(e) => handleCustomHex(e.target.value)}
                    className="h-10 rounded-xl border bg-white/5 text-white placeholder:text-white/30 font-mono"
                    style={{ borderColor: customHexError ? '#EF4444' : 'rgba(255,255,255,0.12)' }}
                  />
                </div>
                {customHexError && (
                  <p className="text-xs text-red-400">Enter a valid hex color (e.g. #FF0066)</p>
                )}
              </div>

              {/* Live preview strip */}
              <div
                className="rounded-xl p-4 mb-6 flex items-center gap-4 border border-white/5"
                style={{ background: 'rgba(13,13,18,0.8)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: brandColor, boxShadow: `0 0 20px ${brandColor}60` }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                    <rect x="12" y="2" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                    <rect x="2" y="12" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                    <rect x="12" y="12" width="4" height="4" rx="0.5" fill="white" opacity="0.9"/>
                    <rect x="18" y="12" width="2" height="2" rx="0.5" fill="white" opacity="0.9"/>
                    <rect x="12" y="18" width="2" height="2" rx="0.5" fill="white" opacity="0.9"/>
                    <rect x="16" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{orgName || 'Your Organization'}</p>
                  <p className="text-xs" style={{ color: brandColor }}>Event Pass · {brandColor.toUpperCase()}</p>
                </div>
              </div>

              {error && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-11 rounded-full border border-white/15 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 h-11 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: brandColor, boxShadow: `0 0 24px ${brandColor}60` }}
                >
                  {loading ? (
                    <><Spinner className="h-4 w-4" /> Saving...</>
                  ) : (
                    <>Finish setup <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: All set ── */}
          {step === 3 && (
            <div className="animate-fade-in text-center py-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: `${brandColor}20`, border: `2px solid ${brandColor}`, boxShadow: `0 0 32px ${brandColor}50` }}
              >
                <Check className="w-10 h-10" style={{ color: brandColor }} />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                You're all set!
              </h1>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Your workspace is ready. Taking you to the dashboard…
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-pulse-dot"
                    style={{ background: brandColor, animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>

              <Button
                type="button"
                onClick={() => navigate('/dashboard', { replace: true })}
                className="h-11 px-8 rounded-full font-semibold text-white"
                style={{ background: brandColor, boxShadow: `0 0 24px ${brandColor}60` }}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
