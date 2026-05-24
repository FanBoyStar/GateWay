import type { PassTemplate } from '../store/useEventStore';

export interface TemplateStyle {
  id: PassTemplate;
  name: string;
  description: string;
  containerClass: string;
  headerClass: string;
  bodyClass: string;
  textColor: string;
  subtextColor: string;
  qrBgColor: string;
  qrFgColor: string;
  dividerStyle: string;
}

export const classicTemplate: TemplateStyle = {
  id: 'classic',
  name: 'Classic',
  description: 'Dark background with pink accent stripe',
  containerClass: 'bg-[#0D0D12] border border-[#1E1E2C]',
  headerClass: 'bg-[var(--neon-primary)] min-h-[120px]',
  bodyClass: 'bg-[#0D0D12]',
  textColor: 'text-white',
  subtextColor: 'text-white/60',
  qrBgColor: '#ffffff',
  qrFgColor: '#0D0D12',
  dividerStyle: 'border-t-2 border-dashed border-white/20',
};

export const minimalTemplate: TemplateStyle = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean white design with subtle borders',
  containerClass: 'bg-white dark:bg-[#F8F8F8] border border-gray-200 dark:border-gray-700',
  headerClass: 'bg-gray-100 dark:bg-gray-800 min-h-[80px]',
  bodyClass: 'bg-white dark:bg-[#F8F8F8]',
  textColor: 'text-gray-900 dark:text-gray-100',
  subtextColor: 'text-gray-500 dark:text-gray-400',
  qrBgColor: '#ffffff',
  qrFgColor: '#000000',
  dividerStyle: 'border-t border-gray-200 dark:border-gray-700',
};

export const vibrantTemplate: TemplateStyle = {
  id: 'vibrant',
  name: 'Vibrant',
  description: 'Brand color fills top section',
  containerClass: 'bg-white dark:bg-[#0D0D12] border-none overflow-hidden',
  headerClass: 'min-h-[140px]',
  bodyClass: 'bg-white dark:bg-[#0D0D12]',
  textColor: 'text-white',
  subtextColor: 'text-white/70',
  qrBgColor: '#ffffff',
  qrFgColor: '#000000',
  dividerStyle: 'border-t border-white/20',
};

export const templates: Record<PassTemplate, TemplateStyle> = {
  classic: classicTemplate,
  minimal: minimalTemplate,
  vibrant: vibrantTemplate,
};

export function getTemplateStyle(template: PassTemplate): TemplateStyle {
  return templates[template];
}

export function getTemplatePreviewGradient(template: PassTemplate, brandColor: string): string {
  switch (template) {
    case 'classic':
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 30%, #0D0D12 30%, #0D0D12 100%)`;
    case 'minimal':
      return `linear-gradient(175deg, #f3f4f6 0%, #f3f4f6 25%, #ffffff 25%, #ffffff 100%)`;
    case 'vibrant':
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 40%, #ffffff 40%, #ffffff 100%)`;
    default:
      return `linear-gradient(175deg, ${brandColor} 0%, ${brandColor} 40%, #ffffff 40%, #ffffff 100%)`;
  }
}
