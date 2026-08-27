import { CategoryInfo, DocumentCategoryId } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'invoices',
    titleAr: 'فواتير',
    emoji: '🧾',
    colorHex: '#006a6a',
    bgLight: 'bg-[#f0f9f9] text-[#004f4f] border-[#cce8e8] dark:bg-[#004f4f]/30 dark:text-[#bfeaea] dark:border-[#006a6a]/40',
    bgDark: 'bg-[#004f4f]/40 text-[#bfeaea]',
  },
  {
    id: 'study',
    titleAr: 'دراسة',
    emoji: '🎓',
    colorHex: '#1e88e5',
    bgLight: 'bg-[#fdf2f2] text-[#991b1b] border-[#fecaca] dark:bg-[#991b1b]/20 dark:text-[#fca5a5] dark:border-[#991b1b]/40',
    bgDark: 'bg-[#991b1b]/30 text-[#fca5a5]',
  },
  {
    id: 'work',
    titleAr: 'عمل',
    emoji: '💼',
    colorHex: '#d97706',
    bgLight: 'bg-[#fff9eb] text-[#b45309] border-[#fde68a] dark:bg-[#b45309]/20 dark:text-[#fcd34d] dark:border-[#b45309]/40',
    bgDark: 'bg-[#b45309]/30 text-[#fcd34d]',
  },
  {
    id: 'personal',
    titleAr: 'شخصية',
    emoji: '👤',
    colorHex: '#7c3aed',
    bgLight: 'bg-[#f3f0ff] text-[#6d28d9] border-[#ddd6fe] dark:bg-[#6d28d9]/20 dark:text-[#c4b5fd] dark:border-[#6d28d9]/40',
    bgDark: 'bg-[#6d28d9]/30 text-[#c4b5fd]',
  },
  {
    id: 'other',
    titleAr: 'أخرى',
    emoji: '📁',
    colorHex: '#4b5563',
    bgLight: 'bg-[#f4f6f6] text-[#374151] border-[#dce5e5] dark:bg-[#1f2937]/40 dark:text-[#9ca3af] dark:border-[#374151]/50',
    bgDark: 'bg-[#1f2937]/40 text-[#9ca3af]',
  },
];

export function getCategoryByTitle(title: string): CategoryInfo {
  return CATEGORIES.find((c) => c.titleAr === title) || CATEGORIES[4];
}

export function getCategoryById(id: DocumentCategoryId): CategoryInfo {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[4];
}

