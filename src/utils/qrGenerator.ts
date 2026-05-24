export interface QRData {
  passId: string;
  eventId: string;
  attendeeName: string;
  ticketType: string;
  timestamp: string;
}

export function buildQRDataString(data: QRData): string {
  return JSON.stringify(data);
}

export function parseQRDataString(qrString: string): QRData | null {
  try {
    const parsed = JSON.parse(qrString);
    if (
      typeof parsed.passId === 'string' &&
      typeof parsed.eventId === 'string' &&
      typeof parsed.attendeeName === 'string' &&
      typeof parsed.ticketType === 'string' &&
      typeof parsed.timestamp === 'string'
    ) {
      return parsed as QRData;
    }
    return null;
  } catch {
    return null;
  }
}

export function isValidPassIdFormat(passId: string): boolean {
  const pattern = /^EVT-[A-HJ-NP-Z2-9]{6}-\d{4}$/;
  return pattern.test(passId);
}
