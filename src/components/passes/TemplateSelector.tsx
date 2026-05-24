import { cn } from '@/lib/utils';
import type { PassTemplate } from '@/store/useEventStore';
import { templates } from '@/templates';

interface TemplateSelectorProps {
  selectedTemplate: PassTemplate;
  onSelect: (template: PassTemplate) => void;
  brandColor?: string;
}

export function TemplateSelector({
  selectedTemplate,
  onSelect,
  brandColor = '#E8186D',
}: TemplateSelectorProps) {
  const templateList = Object.values(templates);

  return (
    <div className="grid grid-cols-3 gap-4">
      {templateList.map((template) => {
        const isActive = selectedTemplate === template.id;
        const gradient = getTemplateGradient(template.id, brandColor);

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              'group relative flex flex-col items-center overflow-hidden rounded-xl transition-all',
              'hover:scale-[1.02] hover:shadow-lg',
              isActive
                ? 'ring-2 ring-[var(--neon-primary)] shadow-[var(--neon-primary-glow)]'
                : 'ring-1 ring-[var(--neon-border)] hover:ring-[var(--neon-border-active)]'
            )}
          >
            <div
              className="aspect-[3/4] w-full rounded-lg"
              style={{ background: gradient }}
            >
              <div className="flex h-full flex-col justify-between p-3">
                <div className="space-y-1">
                  <div className="h-2 w-3/4 rounded bg-white/30" />
                  <div className="h-1.5 w-1/2 rounded bg-white/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-center">
                    <div className="h-10 w-10 rounded bg-white/40" />
                  </div>
                  <div className="h-1.5 w-2/3 mx-auto rounded bg-white/30" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center backdrop-blur-sm">
              <p className="font-semibold text-sm text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function getTemplateGradient(template: PassTemplate, brandColor: string): string {
  switch (template) {
    case 'classic':
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 35%, #0D0D12 35%, #0D0D12 100%)`;
    case 'minimal':
      return `linear-gradient(175deg, #f3f4f6 0%, #f3f4f6 25%, #ffffff 25%, #ffffff 100%)`;
    case 'vibrant':
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 45%, #ffffff 45%, #ffffff 100%)`;
    default:
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 45%, #ffffff 45%, #ffffff 100%)`;
  }
}
