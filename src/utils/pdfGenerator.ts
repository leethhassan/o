import { jsPDF } from 'jspdf';
import { processImageTransformations } from './imageProcessing';

export interface GeneratePdfOptions {
  title: string;
  images: Array<{
    dataUrl: string;
    rotation?: number;
    filter?: 'none' | 'enhanced' | 'grayscale';
  }>;
  quality: number; // 45, 65, 85
}

export async function generatePdfFromImages(options: GeneratePdfOptions): Promise<{
  blobUrl: string;
  dataUri: string;
  sizeBytes: number;
  pdfDoc: jsPDF;
}> {
  const { images, quality } = options;
  if (!images || images.length === 0) {
    throw new Error('لا توجد صور لإنشاء المستند');
  }

  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < images.length; i++) {
    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    const item = images[i];
    // Process image filter & rotation
    const processedUrl = await processImageTransformations(
      item.dataUrl,
      item.rotation || 0,
      item.filter || 'none'
    );

    // Get natural dimensions of processed image
    const imgProps = await getImageProperties(processedUrl);
    
    // Scale to fit page with small 8mm margin
    const margin = 8;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;

    const scale = Math.min(maxW / imgProps.width, maxH / imgProps.height);
    const renderW = imgProps.width * scale;
    const renderH = imgProps.height * scale;

    const posX = (pageWidth - renderW) / 2;
    const posY = (pageHeight - renderH) / 2;

    const compressionQuality = quality >= 80 ? 'FAST' : 'MEDIUM';
    pdf.addImage(processedUrl, 'JPEG', posX, posY, renderW, renderH, undefined, compressionQuality);
  }

  const pdfOutputBlob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(pdfOutputBlob);
  const dataUri = pdf.output('datauristring');
  const sizeBytes = pdfOutputBlob.size;

  return {
    blobUrl,
    dataUri,
    sizeBytes,
    pdfDoc: pdf,
  };
}

function getImageProperties(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
}
