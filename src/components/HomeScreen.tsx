import React from 'react';
import { Camera, Image as ImageIcon, FilePlus, Search, ArrowLeft, Plus, Sparkles, Folder, FileText, ChevronLeft } from 'lucide-react';
import { DocumentItem, NavTab } from '../types';
import { CATEGORIES, getCategoryByTitle } from '../data/categories';
import { formatArabicDate, formatBytes } from '../utils/imageProcessing';

interface HomeScreenProps {
  documents: DocumentItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScan: () => void;
  onOpenPicker: () => void;
  onOpenPdfCreator: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  documents,
  searchQuery,
  onSearchChange,
  onOpenScan,
  onOpenPicker,
  onOpenPdfCreator,
  onSelectDocument,
  onNavigateTab,
}) => {
  const recentDocs = documents.slice(0, 4);

  // Category counts
  const categoryStats = CATEGORIES.slice(0, 4).map((cat) => {
    const count = documents.filter((d) => d.category === cat.titleAr).length;
    return { ...cat, count };
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-24">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[24px] p-3 sm:p-4 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المستند أو التصنيف (مثال: فاتورة، عقد، دراسة)..."
            className="w-full bg-[#f0f4f4] dark:bg-[#1a2626] text-[#191c1c] dark:text-[#e2e8e8] pl-4 pr-11 py-3 rounded-[18px] text-sm border-none focus:ring-2 focus:ring-[#006a6a] placeholder-stone-400 dark:placeholder-stone-500 transition outline-hidden"
          />
          <Search className="w-5 h-5 text-[#006a6a] dark:text-[#4dd0e1] absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Bento Grid Top Section: Hero Card + Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {/* Main Bento Hero Card (8 Cols on md) */}
        <div className="md:col-span-7 lg:col-span-8 bg-[#004f4f] text-white rounded-[32px] p-6 sm:p-7 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
          {/* Subtle background decorative shapes */}
          <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#006a6a]/40 blur-2xl pointer-events-none" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-[#bfeaea]/10 blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#ffeb3b]" />
              <span>مستنداتي الذكي • أمان محلي 100%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-white mb-2">
              مسح وتحويل المستندات إلى PDF
            </h2>
            <p className="text-xs sm:text-sm text-[#d3e8e8] font-normal max-w-md leading-relaxed">
              التقط صور الفواتير، الشهادات، والأوراق بوضوح فائق، وقصّها وادمجها فوراً.
            </p>
          </div>

          <div className="relative z-10 pt-5">
            <button
              onClick={onOpenScan}
              className="bg-[#ffeb3b] hover:bg-[#fdd835] text-[#002020] font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#002020]/10 flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Camera className="w-4 h-4 text-[#002020]" />
              </div>
              <span>تصوير مستند جديد</span>
            </button>
          </div>
        </div>

        {/* Bento Side Action Tiles (4 Cols on md) */}
        <div className="md:col-span-5 lg:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
          {/* Tile 1: Pick from Gallery */}
          <button
            onClick={onOpenPicker}
            className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] hover:border-[#006a6a] dark:hover:border-[#006a6a] transition-all flex items-center gap-3.5 text-right shadow-xs active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] dark:bg-[#880e4f]/30 text-[#d81b60] dark:text-[#f48fb1] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold text-[#191c1c] dark:text-white truncate">
                اختيار من المعرض
              </span>
              <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                دمج صور وتعديلها
              </span>
            </div>
          </button>

          {/* Tile 2: Create PDF */}
          <button
            onClick={onOpenPdfCreator}
            className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] hover:border-[#006a6a] dark:hover:border-[#006a6a] transition-all flex items-center gap-3.5 text-right shadow-xs active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#e3f2fd] dark:bg-[#0d47a1]/30 text-[#1e88e5] dark:text-[#90caf9] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FilePlus className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold text-[#191c1c] dark:text-white truncate">
                إنشاء وتصدير PDF
              </span>
              <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                ضغط وتنسيق فوري
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Bento Middle Section: Categories Bento Box */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[32px] p-5 sm:p-6 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e0f2f1] dark:bg-[#004d40]/40 text-[#006a6a] dark:text-[#80cbc4] flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#191c1c] dark:text-white">
              التصنيفات المنظمة
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('categories')}
            className="text-xs font-bold text-[#006a6a] dark:text-[#4dd0e1] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>جميع التصنيفات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Bento Category Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {categoryStats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigateTab('categories')}
              className={`${cat.bgLight} p-3.5 rounded-[22px] border transition-all text-right hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between h-24`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-black bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-full shadow-2xs">
                  {cat.count}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold block truncate">{cat.titleAr}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bento Bottom Section: Recent Documents Bento Box */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[32px] p-5 sm:p-6 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fee2e2] dark:bg-[#7f1d1d]/40 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#191c1c] dark:text-white flex items-center gap-2">
              <span>أحدث المستندات</span>
              {documents.length > 0 && (
                <span className="text-xs bg-[#e2e8e8] dark:bg-[#1e2d2d] text-[#004f4f] dark:text-[#bfeaea] px-2 py-0.5 rounded-full font-bold">
                  {documents.length}
                </span>
              )}
            </h3>
          </div>

          {documents.length > 0 && (
            <button
              onClick={() => onNavigateTab('documents')}
              className="text-xs font-bold text-[#006a6a] dark:text-[#4dd0e1] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentDocs.length === 0 ? (
          /* Empty State Bento Box */
          <div className="bg-[#f0f4f4] dark:bg-[#162222] rounded-[24px] p-7 text-center border border-dashed border-[#dce5e5] dark:border-[#2a3c3c]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-[#1c2c2c] flex items-center justify-center text-3xl mb-3 shadow-xs">
              📂
            </div>
            <h4 className="text-sm font-bold text-[#191c1c] dark:text-white">
              لا توجد مستندات بعد
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mt-1 mb-4 leading-relaxed">
              ابدأ الآن بمسح أوراقك أو رفع الصور لتحويلها لملفات PDF منظمة ومحفوظة بأمان.
            </p>
            <button
              onClick={onOpenScan}
              className="inline-flex items-center gap-2 bg-[#006a6a] hover:bg-[#004f4f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء أول مستند الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentDocs.map((doc) => {
              const cat = getCategoryByTitle(doc.category);
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="bg-[#f0f4f4]/60 dark:bg-[#162222] border border-[#dce5e5] dark:border-[#223333] hover:border-[#006a6a] dark:hover:border-[#006a6a] p-3.5 rounded-[22px] flex items-center gap-3 cursor-pointer shadow-2xs active:scale-[0.99] transition group"
                >
                  {/* Thumbnail / PDF icon */}
                  <div className="w-13 h-13 rounded-xl bg-white dark:bg-[#1a2727] flex-shrink-0 overflow-hidden relative border border-[#dce5e5] dark:border-[#2a3c3c] flex items-center justify-center">
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
                    <h4 className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white truncate group-hover:text-[#006a6a] dark:group-hover:text-[#4dd0e1] transition-colors">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
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
    </div>
  );
};

