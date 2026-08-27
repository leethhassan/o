import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Trash2,
  ShieldCheck,
  Info,
  Smartphone,
  ChevronLeft,
  AlertTriangle,
  FileCode,
  Sliders,
} from 'lucide-react';
import { AndroidProjectViewer } from './AndroidProjectViewer';

interface SettingsScreenProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClearAllDocs: () => void;
  docsCount: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  darkMode,
  onToggleDarkMode,
  onClearAllDocs,
  docsCount,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#e0f2f1] dark:bg-[#004d40]/40 text-[#006a6a] dark:text-[#80cbc4] flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#191c1c] dark:text-white">
            الإعدادات
          </h2>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          خيارات المظهر والتخزين المحلي والأمان
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#006a6a] dark:text-[#4dd0e1] px-1">
          المظهر والعرض
        </h3>

        <div className="flex items-center justify-between p-3 rounded-[20px] bg-[#f0f4f4]/60 dark:bg-[#1a2626]/60 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#203030] flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-2xs">
              {darkMode ? <Moon className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white">
                الوضع الداكن (Dark Mode)
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {darkMode ? 'مفعّل - مريح للعين في الإضاءة الخافتة' : 'معطّل - المظهر الفاتح القياسي'}
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={onToggleDarkMode}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
              darkMode ? 'bg-[#006a6a]' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                darkMode ? '-translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-[20px] bg-[#f0f4f4]/60 dark:bg-[#1a2626]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#203030] flex items-center justify-center text-[#006a6a] dark:text-[#4dd0e1] shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white">
                لغة التطبيق
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">العربية (RTL مدمج بالكامل)</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#006a6a] dark:text-[#bfeaea] bg-[#d3e8e8] dark:bg-[#004f4f] px-2.5 py-1 rounded-xl">
            العربية
          </span>
        </div>
      </div>

      {/* Storage & Privacy Section */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#006a6a] dark:text-[#4dd0e1] px-1">
          التخزين والخصوصية
        </h3>

        <div
          onClick={() => setShowPrivacyModal(true)}
          className="flex items-center justify-between p-3 rounded-[20px] bg-[#f0f4f4]/60 dark:bg-[#1a2626]/60 hover:bg-[#e2e8e8] dark:hover:bg-[#203030] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#203030] text-[#006a6a] dark:text-[#4dd0e1] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white">
                الخصوصية والأمان المحلي
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                جميع ملفاتك وصورك محفوظة 100% داخل جهازك
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-stone-400" />
        </div>

        <div
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center justify-between p-3 rounded-[20px] bg-[#fee2e2]/40 dark:bg-[#7f1d1d]/20 hover:bg-[#fee2e2]/70 dark:hover:bg-[#7f1d1d]/30 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] dark:bg-[#7f1d1d]/50 text-[#dc2626] flex items-center justify-center shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#dc2626] dark:text-[#fca5a5]">
                حذف جميع المستندات ({docsCount})
              </div>
              <div className="text-[11px] text-[#dc2626]/80 dark:text-[#fca5a5]/80">
                مسح كافة المستندات المحفوظة من الذاكرة المحلية
              </div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#dc2626]" />
        </div>
      </div>

      {/* Android Native Code & Build Guide */}
      <AndroidProjectViewer />

      {/* About Section */}
      <div className="bg-white dark:bg-[#121c1c] rounded-[28px] p-4 sm:p-5 border border-[#dce5e5] dark:border-[#1e2d2d] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#006a6a] dark:text-[#4dd0e1] px-1">
          عن التطبيق
        </h3>

        <div
          onClick={() => setShowAboutModal(true)}
          className="flex items-center justify-between p-3 rounded-[20px] bg-[#f0f4f4]/60 dark:bg-[#1a2626]/60 hover:bg-[#e2e8e8] dark:hover:bg-[#203030] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#203030] text-stone-600 dark:text-stone-300 flex items-center justify-center shadow-2xs">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white">
                حول تطبيق مستنداتي
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">تطبيق إدارة المستندات والـ PDF</div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-stone-400" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-[20px] bg-[#f0f4f4]/60 dark:bg-[#1a2626]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#203030] text-stone-600 dark:text-stone-300 flex items-center justify-center shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#191c1c] dark:text-white">
                إصدار التطبيق
              </div>
              <div className="text-[11px] text-stone-400 font-mono">com.example.mustanadati</div>
            </div>
          </div>
          <span className="text-xs font-bold text-stone-600 dark:text-stone-300 bg-white dark:bg-[#203030] px-2.5 py-1 rounded-xl shadow-2xs">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#006a6a] dark:text-[#4dd0e1]" />
              <h4 className="text-base font-black text-[#191c1c] dark:text-white">
                الخصوصية والأمان المحلي
              </h4>
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>لا توجد خوادم سحابية:</strong> مستنداتك، صورك، والبيانات الشخصية لا تغادر
                هاتفك أبداً.
              </p>
              <p>
                • <strong>توليد PDF محلياً:</strong> تتم معالجة الصور وضغطها وتحويلها إلى PDF على
                معالج الهاتف مباشرة.
              </p>
              <p>
                • <strong>تخزين آمن:</strong> يتم حفظ بيانات المستندات في قاعدة بيانات مشفرة محلياً
                عبر Room SQLite.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 rounded-2xl text-xs font-bold bg-[#006a6a] text-white hover:bg-[#004f4f] transition cursor-pointer active:scale-95"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] bg-[#d3e8e8] dark:bg-[#004f4f] text-[#004f4f] dark:text-[#bfeaea] flex items-center justify-center text-3xl">
              📄
            </div>
            <div>
              <h4 className="text-lg font-black text-[#191c1c] dark:text-white">
                مستنداتي (Mustanadati)
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                تطبيق أندرويد أصلي متكامل ومبني بـ Kotlin و Jetpack Compose
              </p>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed text-right bg-[#f0f4f4] dark:bg-[#1a2626] p-4 rounded-[20px]">
              يوفر لك التطبيق إمكانية تصوير المستندات بدقة، وتدويرها وقصها وتحسين وضوحها، وترتيب
              الصفحات ودمجها في ملف PDF عالي الجودة مع تصنيفات منظمة وبحث فوري.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-3 rounded-2xl text-xs font-bold bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-800 dark:text-stone-200 hover:bg-[#e2e8e8] transition cursor-pointer active:scale-95"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#121c1c] rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-[#dce5e5] dark:border-[#1e2d2d] space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#191c1c] dark:text-white">
              حذف جميع المستندات؟
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              سيتم حذف كافة المستندات والصفحات المحفوظة نهائياً من الذاكرة المحلية. لا يمكن التراجع
              عن هذه العملية.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-[#f0f4f4] dark:bg-[#1a2626] text-stone-700 dark:text-stone-300 hover:bg-[#e2e8e8] transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onClearAllDocs();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-3 rounded-2xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer active:scale-95"
              >
                مسح الكل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

