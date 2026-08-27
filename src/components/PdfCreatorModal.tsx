import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Download, Share2, Eye, Trash2, Sparkles, Folder, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, ScanPage } from '../types';
import { CATEGORIES } from '../data/categories';
import { generatePdfFromImages } from '../utils/pdfGenerator';
import { formatArabicDate, formatBytes } from '../utils/imageProcessing';

interface PdfCreatorModalProps {
  isOpen: boolean;
  pages: ScanPage[];
  onClose: () => void;
  onSuccessCreated: (doc: DocumentItem) => void;
}

export const PdfCreatorModal: React.FC<PdfCreatorModalProps> = ({
  isOpen,
  pages,
  onClose,
  onSuccessCreated,
}) => {
  const getDefaultName = () => {
    const d = new Date();
    const month = d.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    return `مستند جديد - ${month}`;
  };

  const [fileName, setFileName] = useState<string>(getDefaultName());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('invoices');
  const [quality, setQuality] = useState<number>(85);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [createdDocument, setCreatedDocument] = useState<DocumentItem | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!fileName.trim()) {
      setError('يرجى كتابة اسم للمستند');
      return;
    }
    if (pages.length === 0) {
      setError('لا توجد صفحات لإنشاء المستند');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generatePdfFromImages({
        title: fileName.trim(),
        images: pages.map((p) => ({
          dataUrl: p.dataUrl,
          rotation: p.rotation,
          filter: p.filter,
        })),
        quality,
      });

      const cat = CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
      const newDoc: DocumentItem = {
        id: 'doc_' + Date.now(),
        title: fileName.trim(),
        category: cat.titleAr,
        categoryId: cat.id,
        pagesCount: pages.length,
        sizeBytes: result.sizeBytes,
        createdAt: Date.now(),
        pdfDataUrl: result.dataUri,
        thumbnailUrl: pages[0]?.dataUrl || '',
        pageImages: pages.map((p) => p.dataUrl),
      };

      setPdfBlobUrl(result.blobUrl);
      setCreatedDocument(newDoc);
      onSuccessCreated(newDoc);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    } catch (err: any) {
      console.error('PDF Generation failed:', err);
      setError(err.message || 'حدث خطأ أثناء توليد ملف PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!createdDocument || !createdDocument.pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = createdDocument.pdfDataUrl;
    link.download = `${createdDocument.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!createdDocument) return;
    if (navigator.share && pdfBlobUrl) {
      try {
        const file = await (await fetch(pdfBlobUrl)).blob();
        const shareFile = new File([file], `${createdDocument.title}.pdf`, {
          type: 'application/pdf',
        });
        await navigator.share({
          title: createdDocument.title,
          text: `مستند "${createdDocument.title}" بصيغة PDF`,
          files: [shareFile],
        });
      } catch (err) {
        console.warn('Share API failed or dismissed:', err);
        handleDownload();
      }
    } else {
      handleDownload();
    }
  };

  const handlePreview = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h3 className="text-base font-bold">
              {createdDocument ? 'تم إنشاء ملف PDF بنجاح' : 'إنشاء وتصدير PDF'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!createdDocument ? (
          /* Form to configure document */
          <div className="space-y-4 pt-4">
            {/* Info Badge */}
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-3.5 flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  جاهز لدمج {pages.length} {pages.length === 1 ? 'صفحة' : 'صفحات'} في ملف واحد
                </p>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                  معالجة وإنشاء محلي 100% بدون إرسال إلى أي خادم
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                اسم المستند
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="مثال: فاتورة كهرباء - أغسطس 2026"
                className="w-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 px-4 py-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                التصنيف
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      <span>{cat.titleAr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Quality Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                جودة الصورة وحجم الملف
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { q: 85, label: 'عالية', sub: 'أفضل وضوح' },
                  { q: 65, label: 'متوازنة', sub: 'حجم متوسط' },
                  { q: 45, label: 'مضغوطة', sub: 'أصغر حجم' },
                ].map((item) => {
                  const isSelected = quality === item.q;
                  return (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => setQuality(item.q)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <div className="text-xs">{item.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            {/* Generate Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || pages.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">جاري تحويل وحفظ المستند...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">إنشاء وحفظ ملف PDF الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Post-creation Success & Action Screen */
          <div className="space-y-5 pt-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                {createdDocument.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {createdDocument.pagesCount} صفحات • {formatBytes(createdDocument.sizeBytes)} • تم
                الحفظ محلياً
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handlePreview}
                className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>معاينة PDF</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة / تحميل</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold py-3 rounded-xl hover:bg-stone-300 transition cursor-pointer"
            >
              تم والعودة للرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
