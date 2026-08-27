import React, { useState } from 'react';
import {
  X,
  Eye,
  Share2,
  Edit2,
  Folder,
  Trash2,
  Download,
  Calendar,
  Layers,
  HardDrive,
  FileCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { DocumentItem } from '../types';
import { CATEGORIES, getCategoryByTitle } from '../data/categories';
import { formatArabicDate, formatBytes } from '../utils/imageProcessing';

interface DocumentDetailsModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onRename: (id: string, newTitle: string) => void;
  onChangeCategory: (id: string, newCategory: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  document: doc,
  onClose,
  onRename,
  onChangeCategory,
  onDelete,
}) => {
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [renameInput, setRenameInput] = useState<string>('');

  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  if (!doc) return null;

  const cat = getCategoryByTitle(doc.category);

  const handleDownloadPdf = () => {
    if (!doc.pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = doc.pdfDataUrl;
    link.download = `${doc.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share && doc.pdfDataUrl) {
      try {
        const res = await fetch(doc.pdfDataUrl);
        const blob = await res.blob();
        const file = new File([blob], `${doc.title}.pdf`, { type: 'application/pdf' });
        await navigator.share({
          title: doc.title,
          text: `مستند "${doc.title}"`,
          files: [file],
        });
      } catch (err) {
        handleDownloadPdf();
      }
    } else {
      handleDownloadPdf();
    }
  };

  const handleOpenViewer = () => {
    if (doc.pdfDataUrl) {
      window.open(doc.pdfDataUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121c1c] rounded-[32px] max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] text-[#191c1c] dark:text-white my-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dce5e5] dark:border-[#1e2d2d]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat.emoji}</span>
            <h3 className="text-sm sm:text-base font-black truncate max-w-[240px]">{doc.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f0f4f4] dark:hover:bg-[#1a2626] text-stone-400 hover:text-stone-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail & Preview Frame */}
        <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden bg-black border border-[#dce5e5] dark:border-[#1e2d2d] flex items-center justify-center group">
          {doc.thumbnailUrl ? (
            <img
              src={doc.thumbnailUrl}
              alt={doc.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
            />
          ) : (
            <div className="text-5xl">{cat.emoji}</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3.5">
            <div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border shadow-xs ${cat.bgLight}`}
              >
                {cat.emoji} {doc.category}
              </span>
            </div>
            <button
              onClick={handleOpenViewer}
              className="bg-[#006a6a] hover:bg-[#004f4f] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة PDF</span>
            </button>
          </div>
        </div>

        {/* Document Details Metadata Bento Box */}
        <div className="bg-[#f0f4f4] dark:bg-[#1a2626] rounded-[22px] p-4 border border-[#dce5e5] dark:border-[#223333] space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>تاريخ الإنشاء:</span>
            </span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{formatArabicDate(doc.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>عدد الصفحات:</span>
            </span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {doc.pagesCount} {doc.pagesCount === 1 ? 'صفحة' : 'صفحات'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>حجم الملف:</span>
            </span>
            <span className="font-semibold font-mono text-stone-800 dark:text-stone-200">{formatBytes(doc.sizeBytes)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>نوع المستند:</span>
            </span>
            <span className="font-bold text-[#006a6a] dark:text-[#4dd0e1]">PDF محلي مشفر</span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleOpenViewer}
            className="bg-[#006a6a] hover:bg-[#004f4f] text-white text-xs font-bold py-3 px-3 rounded-2xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>فتح وقراءة PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-[#004f4f] hover:bg-[#003838] text-white text-xs font-bold py-3 px-3 rounded-2xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة المستند</span>
          </button>
        </div>

        {/* Secondary Management Options */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => {
              setRenameInput(doc.title);
              setShowRenameModal(true);
            }}
            className="flex-1 bg-[#f0f4f4] dark:bg-[#1a2626] hover:bg-[#e2e8e8] text-stone-700 dark:text-stone-300 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>إعادة تسمية</span>
          </button>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 bg-[#f0f4f4] dark:bg-[#1a2626] hover:bg-[#e2e8e8] text-stone-700 dark:text-stone-300 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>تغيير التصنيف</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl transition cursor-pointer"
            title="حذف المستند"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[28px] max-w-sm w-full p-5 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-4">
            <h4 className="text-sm font-bold text-[#191c1c] dark:text-white">
              إعادة تسمية المستند
            </h4>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full bg-[#f0f4f4] dark:bg-[#1a2626] text-[#191c1c] dark:text-white px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#006a6a] outline-hidden"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-[#f0f4f4] dark:hover:bg-[#1a2626] transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (renameInput.trim()) {
                    onRename(doc.id, renameInput.trim());
                    setShowRenameModal(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006a6a] text-white hover:bg-[#004f4f] transition cursor-pointer"
              >
                حفظ الاسم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[28px] max-w-sm w-full p-5 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-3">
            <h4 className="text-sm font-bold text-[#191c1c] dark:text-white">تغيير التصنيف</h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((c) => {
                const isCurrent = doc.category === c.titleAr;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onChangeCategory(doc.id, c.titleAr);
                      setShowCategoryModal(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#d3e8e8] dark:bg-[#004f4f] text-[#004f4f] dark:text-[#bfeaea] font-bold border border-[#006a6a]/40'
                        : 'bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-700 dark:text-stone-300 hover:bg-[#e2e8e8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.emoji}</span>
                      <span>{c.titleAr}</span>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[#006a6a] dark:text-[#bfeaea]" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowCategoryModal(false)}
              className="w-full py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-[#f0f4f4] dark:hover:bg-[#1a2626] transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[28px] max-w-sm w-full p-5 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#191c1c] dark:text-white">
              حذف هذا المستند؟
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف مستند "{doc.title}" نهائياً من الذاكرة المحلية؟ لا يمكن
              التراجع بعد ذلك.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-700 dark:text-stone-300 hover:bg-[#e2e8e8] transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onDelete(doc.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

