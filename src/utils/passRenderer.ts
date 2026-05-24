import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PassExportOptions {
  passId: string;
  format: 'png' | 'pdf';
}

export async function capturePassAsImage(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

export async function downloadPassAsPng(element: HTMLElement, passId: string): Promise<void> {
  const blob = await capturePassAsImage(element);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pass-${passId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadPassAsPdf(element: HTMLElement, passId: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  // A6 dimensions in mm: 105 x 148
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6',
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 105;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Center the image vertically if it's smaller than the page
  const pageHeight = 148;
  const yOffset = Math.max(0, (pageHeight - imgHeight) / 2);

  pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, Math.min(imgHeight, pageHeight));
  pdf.save(`pass-${passId}.pdf`);
}

export async function copyPassLinkToClipboard(passId: string): Promise<boolean> {
  const link = `${window.location.origin}/passes/${passId}`;
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = link;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export function openEmailWithPassLink(passId: string, attendeeName: string, eventName: string): void {
  const link = `${window.location.origin}/passes/${passId}`;
  const subject = encodeURIComponent(`Your Pass for ${eventName}`);
  const body = encodeURIComponent(
    `Hi ${attendeeName},\n\nYour pass for ${eventName} is ready!\n\nView your pass here: ${link}\n\nSee you at the event!`
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export async function downloadAllPassesAsZip(passes: Array<{ element: HTMLElement; passId: string }>): Promise<void> {
  // For MVP, download each pass individually
  // A proper ZIP implementation would require JSZip library
  for (const { element, passId } of passes) {
    await downloadPassAsPng(element, passId);
    // Small delay to prevent browser blocking multiple downloads
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
