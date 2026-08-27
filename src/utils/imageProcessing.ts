export async function processImageTransformations(
  dataUrl: string,
  rotationDegrees: number = 0,
  filterType: 'none' | 'enhanced' | 'grayscale' = 'none'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      const rad = (rotationDegrees * Math.PI) / 180;
      const is90or270 = Math.abs(rotationDegrees % 180) === 90;

      canvas.width = is90or270 ? img.height : img.width;
      canvas.height = is90or270 ? img.width : img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      if (filterType !== 'none') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          if (filterType === 'grayscale') {
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            // threshold for clean document background
            const cleanGray = gray > 180 ? 255 : gray < 50 ? 0 : gray;
            d[i] = cleanGray;
            d[i + 1] = cleanGray;
            d[i + 2] = cleanGray;
          } else if (filterType === 'enhanced') {
            // Contrast stretch + brightness boost
            const contrast = 1.35;
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            d[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128 + 10));
            d[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128 + 10));
            d[i + 2] = Math.min(255, Math.max(0, factor * (b - 128) + 128 + 10));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 ك.ب';
  const k = 1024;
  const sizes = ['ب', 'ك.ب', 'م.ب', 'ج.ب'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatArabicDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
