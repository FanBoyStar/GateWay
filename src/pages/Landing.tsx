import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import {
  Ticket,
  Upload,
  Share2,
  ScanLine,
  Palette,
  Shield,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Branded QR Passes',
    description: 'Custom colors, logos, and event art for unique passes',
  },
  {
    icon: Upload,
    title: 'Bulk Generation',
    description: 'Upload a CSV and generate all passes in seconds',
  },
  {
    icon: Share2,
    title: 'Instant Sharing',
    description: 'Email, WhatsApp link, or direct QR download',
  },
  {
    icon: ScanLine,
    title: 'Live Scan Verification',
    description: 'Know who checks in at your door in real time',
  },
  {
    icon: Palette,
    title: '3 Pass Templates',
    description: 'Classic, Minimal, or Vibrant — match your brand',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your attendee data stays yours, always',
  },
];

const steps = [
  { step: 1, title: 'Create your event', description: 'Set up details, branding, and timing' },
  { step: 2, title: 'Add attendees', description: 'Single entry or bulk CSV upload' },
  { step: 3, title: 'Share passes', description: 'Download, email, or direct link' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-primary-soft)] via-transparent to-[var(--neon-accent-soft)] opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-primary)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-accent)]/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Beautiful Event Passes.
                <br />
                <span className="text-[var(--neon-primary)]">Generated in Minutes.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Create branded QR passes for any event — weddings, conferences,
                workshops, or private parties. Share, scan, and manage with ease.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/90 neon-glow neon-glow-hover transition-all"
                >
                  <Link to="/sign-up">
                    Get Started — Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg"
                >
                  <Link to="/passes/demo">See a Demo Pass</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-fade-in">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                <img
                  src="/hero-pass.webp"
                  alt="Event Pass Example"
                  className="w-full rounded-2xl shadow-2xl transform perspective-1000 rotate-y-6 hover:rotate-y-0 transition-transform duration-500"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                {/* Floating glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--neon-primary)] to-[var(--neon-accent)] opacity-20 blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Everything you need for event passes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-[var(--neon-border-active)] hover:shadow-lg transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-[var(--neon-primary-soft)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-[var(--neon-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[var(--neon-primary)] via-[var(--neon-accent)] to-[var(--neon-primary)]" />

            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-accent)] flex items-center justify-center text-2xl font-bold text-white mb-4 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-semibold bg-[var(--neon-primary)] neon-glow neon-glow-hover"
            >
              <Link to="/sign-up">
                Start Creating Passes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo href="/" size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Gateway. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
