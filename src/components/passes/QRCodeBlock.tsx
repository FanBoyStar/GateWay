import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeBlockProps {
  value: string;
  size?: number;
  label?: string;
  bgColor?: string;
  fgColor?: string;
}

export function QRCodeBlock({
  value,
  size = 160,
  label,
  bgColor = '#ffffff',
  fgColor = '#000000',
}: QRCodeBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'M',
      });
    }
  }, [value, size, bgColor, fgColor]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-lg p-3 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>
      {label && (
        <span
          className="font-mono text-xs tracking-wide opacity-70"
          style={{ color: fgColor === '#ffffff' ? '#ffffff' : '#666' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
