export type DocumentCategoryId = 'invoices' | 'study' | 'work' | 'personal' | 'other';

export interface CategoryInfo {
  id: DocumentCategoryId;
  titleAr: string;
  emoji: string;
  colorHex: string;
  bgLight: string;
  bgDark: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  categoryId: DocumentCategoryId;
  pagesCount: number;
  sizeBytes: number;
  createdAt: number;
  pdfDataUrl?: string; // base64 or blob URL
  thumbnailUrl: string; // page 1 thumbnail
  pageImages?: string[]; // stored page image data URLs
}

export interface ScanPage {
  id: string;
  dataUrl: string;
  rotation: number;
  filter: 'none' | 'enhanced' | 'grayscale';
  originalDataUrl: string;
}

export type NavTab = 'home' | 'documents' | 'categories' | 'settings';
