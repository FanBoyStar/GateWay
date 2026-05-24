import { cn } from '@/lib/utils';
import type { Event } from '@/store/useEventStore';
import type { Attendee } from '@/store/useAttendeeStore';
import type { Pass } from '@/store/usePassStore';
import { QRCodeBlock } from './QRCodeBlock';
import { StatusBadge } from './StatusBadge';
import { getTemplateStyle } from '@/templates';
import { formatEventDate, formatEventTime } from '@/utils/dateHelpers';

export interface PassCardProps {
  event: Event;
  attendee: Attendee;
  pass: Pass;
  size?: 'full' | 'thumbnail';
  showActions?: boolean;
  className?: string;
}

export function PassCard({
  event,
  attendee,
  pass,
  size = 'full',
  showActions: _showActions = false,
  className,
}: PassCardProps) {
  void _showActions; // Reserved for future use
  const templateStyle = getTemplateStyle(event.template);
  const isThumbnail = size === 'thumbnail';

  const headerBg =
    event.template === 'vibrant'
      ? { backgroundColor: event.brandColor || 'var(--neon-primary)' }
      : event.template === 'classic'
        ? { backgroundColor: event.brandColor || 'var(--neon-primary)' }
        : {};

  const qrFgColor =
    event.template === 'vibrant'
      ? isThumbnail ? '#000000' : '#000000'
      : event.template === 'classic'
        ? '#0D0D12'
        : '#000000';

  const textColorClass =
    event.template === 'vibrant' || event.template === 'classic'
      ? 'text-white'
      : 'text-gray-900 dark:text-gray-100';

  const subtextColorClass =
    event.template === 'vibrant' || event.template === 'classic'
      ? 'text-white/70'
      : 'text-gray-500 dark:text-gray-400';

  const notchLeft = (
    <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
  );

  const notchRight = (
    <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] shadow-xl',
        isThumbnail ? 'w-[200px]' : 'w-full max-w-[400px]',
        templateStyle.containerClass,
        className
      )}
      id={`pass-card-${pass.id}`}
    >
      {event.template !== 'minimal' && notchLeft}
      {event.template !== 'minimal' && notchRight}

      <div
        className={cn(
          'relative',
          isThumbnail ? 'min-h-[60px]' : 'min-h-[120px]',
          'flex flex-col justify-end p-4'
        )}
        style={{
          ...headerBg,
          backgroundImage: event.bannerImage ? `url(${event.bannerImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {event.bannerImage && (
          <div
            className="absolute inset-0"
            style={{
              background:
                event.template === 'vibrant'
                  ? 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
                  : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))',
            }}
          />
        )}

        <div className="relative z-10 space-y-1">
          <h2
            className={cn(
              'font-semibold leading-tight',
              isThumbnail ? 'text-sm' : 'text-xl',
              textColorClass
            )}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {event.name}
          </h2>

          {!isThumbnail && (
            <div className={cn('flex flex-wrap gap-3 text-sm', subtextColorClass)}>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3">📅</span>
                {formatEventDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3">🕐</span>
                {formatEventTime(event.startTime)}
              </span>
            </div>
          )}

          {!isThumbnail && (
            <p className={cn('flex items-center gap-1 text-sm', subtextColorClass)}>
              <span className="h-3 w-3">📍</span>
              {event.venue}
            </p>
          )}
        </div>
      </div>

      <div
        className={cn(
          'relative my-2 mx-2',
          templateStyle.dividerStyle
        )}
      />

      <div
        className={cn(
          'p-4 space-y-4',
          templateStyle.bodyClass
        )}
      >
        <div className="space-y-2">
          <p
            className={cn(
              'font-bold',
              isThumbnail ? 'text-base' : 'text-lg',
              templateStyle.textColor
            )}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {attendee.name}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-3 py-0.5 text-sm font-medium',
                'bg-[var(--neon-primary-soft)] text-[var(--neon-primary)]'
              )}
            >
              {attendee.ticketType}
            </span>
            {attendee.seatNumber && !isThumbnail && (
              <span className={cn('text-sm', subtextColorClass)}>
                Seat: {attendee.seatNumber}
              </span>
            )}
          </div>
        </div>

        {!isThumbnail && (
          <div className="flex justify-center">
            <QRCodeBlock
              value={pass.qrData}
              size={160}
              label={`PASS ID: ${pass.id}`}
              bgColor={templateStyle.qrBgColor}
              fgColor={qrFgColor}
            />
          </div>
        )}

        {isThumbnail && (
          <div className="flex justify-center">
            <QRCodeBlock
              value={pass.qrData}
              size={80}
              bgColor={templateStyle.qrBgColor}
              fgColor={qrFgColor}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <p
            className={cn(
              'font-mono text-xs tracking-wider',
              templateStyle.subtextColor
            )}
          >
            {isThumbnail ? pass.id.slice(0, 12) + '...' : pass.id}
          </p>

          <StatusBadge status={pass.status} size={isThumbnail ? 'sm' : 'md'} />
        </div>
      </div>
    </div>
  );
}
