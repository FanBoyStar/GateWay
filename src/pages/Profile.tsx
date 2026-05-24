import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { TemplateSelector } from '@/components/passes/TemplateSelector';
import { useThemeStore } from '@/store/useThemeStore';
import { useEventStore, type PassTemplate } from '@/store/useEventStore';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { usePassStore } from '@/store/usePassStore';
import { useAuth } from '@/contexts/AuthContext';
import { profileFormSchema, type ProfileFormData } from '@/utils/validators';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Building,
  Globe,
  Settings,
  Download,
  Trash2,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';

export function Profile() {
  const { theme, toggleTheme } = useThemeStore();
  const { events } = useEventStore();
  const { attendees } = useAttendeeStore();
  const { passes } = usePassStore();
  const { user, updateProfile } = useAuth();

  const [defaultTemplate, setDefaultTemplate] = useState<PassTemplate>('classic');
  const [defaultColor, setDefaultColor] = useState('#E8186D');
  const [saving, setSaving] = useState(false);

  const savedExtra = (() => {
    try { return JSON.parse(localStorage.getItem('profile_extra') || '{}'); } catch { return {}; }
  })();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.full_name || '',
      email: user?.email || '',
      organizationName: savedExtra.organizationName || '',
      website: savedExtra.website || '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    localStorage.setItem('profile_extra', JSON.stringify({
      organizationName: data.organizationName,
      website: data.website,
    }));
    const { error } = await updateProfile(data.name, data.email);
    setSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profile updated successfully');
    }
  };

  const handleExportData = () => {
    const data = {
      events,
      attendees,
      passes,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `passgen-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const stats = {
    totalEvents: events.length,
    totalAttendees: attendees.length,
    totalPasses: passes.length,
    storageUsed: `${(localStorage.length * 0.5).toFixed(1)} KB`,
  };

  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomNav />
      <PageWrapper>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Profile & Settings
            </h1>
            <p className="text-foreground/60">
              Manage your organizer profile and application preferences
            </p>
          </div>

          {/* Profile Info */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-accent)] flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Organizer Info</h2>
                <p className="text-sm text-foreground/60">
                  Edit your profile details
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                    <Input
                      id="name"
                      {...register('name')}
                      className="pl-10"
                      placeholder="Your name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="pl-10"
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                    <Input
                      id="organizationName"
                      {...register('organizationName')}
                      className="pl-10"
                      placeholder="Company or organization"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                    <Input
                      id="website"
                      type="url"
                      {...register('website')}
                      className="pl-10"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-[var(--neon-accent-soft)] flex items-center justify-center">
                <Palette className="h-5 w-5 text-[var(--neon-accent)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-foreground/60">
                  Customize the app theme
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-sm text-foreground/60">
                    Switch between dark and light mode
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'relative w-14 h-8 rounded-full transition-colors flex items-center px-1',
                    theme === 'dark' ? 'bg-[var(--neon-primary)]' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'absolute flex items-center justify-center w-6 h-6 bg-white rounded-full transition-transform shadow-sm',
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    )}
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-3.5 w-3.5 text-[var(--neon-primary)]" />
                    ) : (
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </span>
                </button>
              </div>

              {/* Default Template */}
              <div>
                <Label className="mb-2 block">Default Pass Template</Label>
                <TemplateSelector
                  selectedTemplate={defaultTemplate}
                  onSelect={setDefaultTemplate}
                  brandColor={defaultColor}
                />
              </div>

              {/* Default Color */}
              <div>
                <Label htmlFor="defaultColor">Default Brand Color</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="defaultColor"
                    type="color"
                    value={defaultColor}
                    onChange={(e) => setDefaultColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={defaultColor}
                    onChange={(e) => setDefaultColor(e.target.value)}
                    className="font-mono"
                    placeholder="#E8186D"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Settings className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Data Management</h2>
                <p className="text-sm text-foreground/60">
                  Export or manage your stored data
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
                <p className="text-sm text-foreground/60">Events</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
                <p className="text-sm text-foreground/60">Attendees</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{stats.totalPasses}</p>
                <p className="text-sm text-foreground/60">Passes</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{stats.storageUsed}</p>
                <p className="text-sm text-foreground/60">Storage</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export All Data as JSON
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Local Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your events, attendees, and passes. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAllData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">About Gateway</h2>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>Version 1.0.0 (MVP)</p>
              <p>Beautiful branded event passes, generated in minutes.</p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
