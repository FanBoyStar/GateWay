import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main
      className={cn(
        'min-h-screen bg-background animate-fade-in overflow-x-hidden',
        'pt-16 pb-20 lg:pt-0 lg:pb-0 lg:pl-[240px]',
        className
      )}
    >
      <div className="p-4 lg:p-8 max-w-[1280px] mx-auto">{children}</div>
    </main>
  );
}
