import React from 'react';
import { Folder, ChevronLeft, Sparkles } from 'lucide-react';
import { DocumentItem } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoriesScreenProps {
  documents: DocumentItem[];
  onSelectCategory: (categoryTitle: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  documents,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#e0f2f1] dark:bg-[#004d40]/40 text-[#006a6a] dark:text-[#80cbc4] flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#191c1c] dark:text-white">
            تصنيفات المستندات
          </h2>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          تنظيم ذكي وفوري لجميع مستنداتك وفواتيرك وأوراقك المهمة
        </p>
      </div>

      {/* Categories Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const count = documents.filter((d) => d.category === cat.titleAr).length;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.titleAr)}
              className="bg-white dark:bg-[#121c1c] border border-[#dce5e5] dark:border-[#1e2d2d] hover:border-[#006a6a] dark:hover:border-[#006a6a] p-4 sm:p-5 rounded-[24px] flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.99] transition group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl ${cat.bgLight} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs`}>
                  {cat.emoji}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#191c1c] dark:text-white group-hover:text-[#006a6a] dark:group-hover:text-[#4dd0e1] transition-colors">
                    {cat.titleAr}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {count} {count === 1 ? 'مستند محفوظ' : 'مستندات محفوظة'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-stone-400 group-hover:text-[#006a6a] dark:group-hover:text-[#4dd0e1] transition">
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-700 dark:text-stone-300">
                  {count}
                </span>
                <ChevronLeft className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

