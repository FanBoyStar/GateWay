import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hop, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <Hop className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PassGen</span>
        </div>
        <div className="flex gap-4">
          <Link to="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">
                Event Passes Made Easy
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create, manage, and distribute digital event passes in minutes. No complicated setup, no hassle.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">Beautiful Pass Designs</h3>
                  <p className="text-sm text-muted-foreground">Choose from professional templates or customize your own</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">QR Code Scanning</h3>
                  <p className="text-sm text-muted-foreground">Instantly verify attendees with built-in scanning</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">Bulk Management</h3>
                  <p className="text-sm text-muted-foreground">Upload and manage thousands of passes at once</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/sign-up">
                <Button size="lg" className="gap-2">
                  Create Your First Event
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 aspect-square flex items-center justify-center border border-primary/20">
              <div className="text-center space-y-4">
                <div className="bg-primary rounded-lg p-4 w-fit mx-auto">
                  <Hop className="h-12 w-12 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">PassGen</h2>
                <p className="text-muted-foreground max-w-xs">
                  Professional event passes, instantly created
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold">100K+</p>
            <p className="text-muted-foreground mt-2">Passes Created</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">50+</p>
            <p className="text-muted-foreground mt-2">Organizations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">1M+</p>
            <p className="text-muted-foreground mt-2">Attendees Verified</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>PassGen - Simplifying event management since 2024</p>
        </div>
      </footer>
    </div>
  );
}
