import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { box: 24, boxRadius: 7, icon: 12, text: 'text-base' },
  md: { box: 32, boxRadius: 9, icon: 16, text: 'text-xl' },
  lg: { box: 40, boxRadius: 11, icon: 20, text: 'text-2xl' },
};

export function Logo({ size = 'md', href = '/', className = '' }: LogoProps) {
  const s = sizeMap[size];

  const mark = (
    <div
      style={{
        width: s.box,
        height: s.box,
        borderRadius: s.boxRadius,
        background: 'var(--neon-primary, #E8186D)',
        boxShadow: '0 0 20px color-mix(in srgb, var(--neon-primary, #E8186D) 40%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <QrCode size={s.icon} color="#fff" />
    </div>
  );

  const label = (
    <span
      className={`font-extrabold tracking-tight ${s.text}`}
      style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em' }}
    >
      Gateway
    </span>
  );

  const inner = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {mark}
      {label}
    </span>
  );

  if (href) {
    return (
      <Link to={href} className="no-underline text-foreground hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    );
  }

  return inner;
}
