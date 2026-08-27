import React from 'react';
import { Search, Plus, Filter, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
import { DocumentItem } from '../types';
import { CATEGORIES, getCategoryByTitle } from '../data/categories';
import { formatArabicDate, formatBytes } from '../utils/imageProcessing';

interface DocumentListScreenProps {
  documents: DocumentItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (cat: string | null) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenScan: () => void;
}

export const DocumentListScreen: React.FC<DocumentListScreenProps> = ({
  documents,
  searchQuery,
  onSearchChange,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onSelectDocument,
  onOpenScan,
}) => {
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategoryFilter || doc.category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Search and Filters Header */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#191c1c] dark:text-white flex items-center gap-2">
            <span>جميع المستندات</span>
            <span className="text-xs bg-[#d3e8e8] dark:bg-[#004f4f] text-[#004f4f] dark:text-[#bfeaea] px-2.5 py-0.5 rounded-full font-black">
              {filteredDocs.length}
            </span>
          </h2>
          <button
            onClick={onOpenScan}
            className="bg-[#006a6a] hover:bg-[#004f4f] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>مستند جديد</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو التصنيف (مثال: فاتورة، دراسة)..."
            className="w-full bg-[#f0f4f4] dark:bg-[#1a2626] text-[#191c1c] dark:text-[#e2e8e8] pl-4 pr-10 py-2.5 rounded-[16px] text-xs sm:text-sm border-none focus:ring-2 focus:ring-[#006a6a] placeholder-stone-400 dark:placeholder-stone-500 transition outline-hidden"
          />
          <Search className="w-4 h-4 text-[#006a6a] dark:text-[#4dd0e1] absolute right-3.5 top-3 pointer-events-none" />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => onSelectCategoryFilter(null)}
            className={`text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition cursor-pointer ${
              selectedCategoryFilter === null
                ? 'bg-[#004f4f] text-white shadow-xs'
                : 'bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-600 dark:text-stone-300 hover:bg-[#e2e8e8] dark:hover:bg-[#253535]'
            }`}
          >
            الكل ({documents.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat.titleAr).length;
            const isSelected = selectedCategoryFilter === cat.titleAr;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategoryFilter(isSelected ? null : cat.titleAr)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#004f4f] text-white shadow-xs'
                    : 'bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-600 dark:text-stone-300 hover:bg-[#e2e8e8] dark:hover:bg-[#253535]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.titleAr}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-8 sm:p-10 text-center border border-dashed border-[#dce5e5] dark:border-[#2a3c3c] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0f4f4] dark:bg-[#1a2626] flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-sm font-bold text-[#191c1c] dark:text-white">
            {searchQuery || selectedCategoryFilter
              ? 'لم يتم العثور على مستندات مطابقة'
              : 'لا توجد مستندات بعد'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
            {searchQuery || selectedCategoryFilter
              ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً'
              : 'ابدأ بالتقاط صورة أو اختيار ملفات لتحويلها إلى مستندات PDF'}
          </p>
          <button
            onClick={onOpenScan}
            className="inline-flex items-center gap-1.5 bg-[#006a6a] hover:bg-[#004f4f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستند جديد</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {filteredDocs.map((doc) => {
            const cat = getCategoryByTitle(doc.category);
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="bg-white dark:bg-[#121c1c] border border-[#dce5e5] dark:border-[#1e2d2d] hover:border-[#006a6a] dark:hover:border-[#006a6a] p-3.5 rounded-[22px] flex items-center gap-3.5 cursor-pointer shadow-xs active:scale-[0.99] transition group"
              >
                {/* Thumbnail */}
                <div className="w-13 h-13 rounded-xl bg-[#f0f4f4] dark:bg-[#1a2727] flex-shrink-0 overflow-hidden relative border border-[#dce5e5] dark:border-[#2a3c3c] flex items-center justify-center">
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{cat.emoji}</span>
                  )}
                  <span className="absolute bottom-0 right-0 bg-[#dc2626] text-white text-[9px] font-bold px-1 rounded-tl">
                    PDF
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white truncate group-hover:text-[#006a6a] dark:group-hover:text-[#4dd0e1] transition-colors">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${cat.bgLight}`}
                    >
                      {cat.emoji} {doc.category}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      {doc.pagesCount} {doc.pagesCount === 1 ? 'صفحة' : 'صفحات'}
                    </span>
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                      {formatBytes(doc.sizeBytes)}
                    </span>
                  </div>
                  <p className="text-[9px] text-stone-400 dark:text-stone-500 mt-1">
                    {formatArabicDate(doc.createdAt)}
                  </p>
                </div>

                <div className="p-1 text-stone-400 group-hover:text-[#006a6a] dark:group-hover:text-[#4dd0e1] transition">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

