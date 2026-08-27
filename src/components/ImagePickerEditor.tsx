import React, { useRef } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, Image as ImageIcon, FileText, Camera, Upload } from 'lucide-react';
import { ScanPage } from '../types';
import { fileToDataUrl } from '../utils/imageProcessing';

interface ImagePickerEditorProps {
  pages: ScanPage[];
  onAddPages: (newPages: ScanPage[]) => void;
  onRemovePage: (id: string) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
  onOpenScan: () => void;
  onProceedToPdf: () => void;
  onClose: () => void;
}

export const ImagePickerEditor: React.FC<ImagePickerEditorProps> = ({
  pages,
  onAddPages,
  onRemovePage,
  onReorderPages,
  onOpenScan,
  onProceedToPdf,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPages: ScanPage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await fileToDataUrl(file);
      newPages.push({
        id: 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        dataUrl,
        originalDataUrl: dataUrl,
        rotation: 0,
        filter: 'none',
      });
    }
    onAddPages(newPages);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>صفحات المستند</span>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
              {pages.length} {pages.length === 1 ? 'صفحة' : 'صفحات'}
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            يمكنك إعادة ترتيب الصفحات أو حذفها أو إضافة صفحات جديدة قبل إنشاء الـ PDF
          </p>
        </div>
      </div>

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center border-2 border-dashed border-stone-300 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-3xl">
            🖼️
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              لم تقم بإضافة أي صفحات بعد
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
              اختر صور المستندات من ألبوم الصور أو التقطها فوراً عبر الكاميرا
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>اختيار صور من الهاتف</span>
            </button>
            <button
              onClick={onOpenScan}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>تصوير بالكاميرا</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-2.5 shadow-xs flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800">
                <img
                  src={page.dataUrl}
                  alt={`صفحة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  صفحة {index + 1}
                </span>
              </div>

              {/* Action Toolbar for this Page */}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onReorderPages(index, index - 1)}
                    disabled={index === 0}
                    title="تحريك للخلف"
                    className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onReorderPages(index, index + 1)}
                    disabled={index === pages.length - 1}
                    title="تحريك للأمام"
                    className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onRemovePage(page.id)}
                  title="حذف هذه الصفحة"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Page Tile */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-800 hover:border-emerald-500 flex flex-col items-center justify-center text-center p-4 cursor-pointer group bg-stone-50/50 dark:bg-stone-900/30 transition"
          >
            <div className="w-10 h-10 rounded-full bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 transition mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 group-hover:text-emerald-600">
              إضافة صفحة أخرى
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">من ألبوم الصور</span>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      {pages.length > 0 && (
        <div className="sticky bottom-20 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة صور</span>
            </button>
            <button
              onClick={onOpenScan}
              className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>كاميرا</span>
            </button>
          </div>

          <button
            onClick={onProceedToPdf}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>إنشاء PDF ({pages.length} صفحات)</span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleMultipleFiles}
        className="hidden"
      />
    </div>
  );
};
