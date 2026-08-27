import React, { useState } from 'react';
import { Code, Terminal, Check, Copy, FileCode, FolderCode, Info, Download } from 'lucide-react';

export const AndroidProjectViewer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const termuxCommands = `
# 1. تحديث حزم Termux وتثبيت OpenJDK و Git و Gradle:
pkg update && pkg upgrade -y
pkg install openjdk-17 git gradle -y

# 2. الانتقال إلى مجلد المشروع وبناء الـ APK:
cd android
chmod +x gradlew
./gradlew assembleDebug

# ملف الـ APK النهائي سيكون جاهزاً في المسار:
# app/build/outputs/apk/debug/app-debug.apk
`.trim();

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              مشروع Android الأصلي جاهز (Kotlin & Gradle)
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              حزمة التطبيق: <code className="text-emerald-600 font-mono">com.example.mustanadati</code>
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700/60">
          <div className="text-stone-400 mb-1">واجهة المستخدم</div>
          <div className="font-bold text-stone-800 dark:text-stone-200">Jetpack Compose + Material 3</div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700/60">
          <div className="text-stone-400 mb-1">قاعدة البيانات المحلية</div>
          <div className="font-bold text-stone-800 dark:text-stone-200">Room SQLite (Offline)</div>
        </div>
      </div>

      {/* Termux Guide Block */}
      <div className="bg-stone-950 text-stone-200 rounded-2xl p-4 font-mono text-xs relative space-y-2 border border-stone-800">
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>أوامر البناء في Termux على الهاتف:</span>
          </span>
          <button
            onClick={() => copyToClipboard(termuxCommands, 'termux')}
            className="text-stone-400 hover:text-white flex items-center gap-1 text-[10px] bg-stone-800 px-2 py-1 rounded cursor-pointer"
          >
            {copiedKey === 'termux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'termux' ? 'تم النسخ!' : 'نسخ الأوامر'}</span>
          </button>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed text-stone-300">
          {termuxCommands}
        </pre>
      </div>
    </div>
  );
};
