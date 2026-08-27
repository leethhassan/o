/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, DocumentItem, ScanPage } from './types';
import { getAllDocuments, saveDocument, deleteDocumentById, clearAllDatabase } from './db/storage';
import { BottomNavBar, TopHeader } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { DocumentListScreen } from './components/DocumentListScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CameraScanModal } from './components/CameraScanModal';
import { ImagePickerEditor } from './components/ImagePickerEditor';
import { PdfCreatorModal } from './components/PdfCreatorModal';
import { DocumentDetailsModal } from './components/DocumentDetailsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Staged scanned / picked pages
  const [stagedPages, setStagedPages] = useState<ScanPage[]>([]);

  // Modals & Sub-views
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isImagePickerEditorOpen, setIsImagePickerEditorOpen] = useState<boolean>(false);
  const [isPdfCreatorOpen, setIsPdfCreatorOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mustanadati_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mustanadati_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mustanadati_theme', 'light');
    }
  }, [darkMode]);

  // Load documents from IndexedDB on initial mount
  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const docs = await getAllDocuments();
    setDocuments(docs);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // When a photo is captured & confirmed in CameraScanModal
  const handlePhotoConfirmed = (dataUrl: string) => {
    const newPage: ScanPage = {
      id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      dataUrl,
      originalDataUrl: dataUrl,
      rotation: 0,
      filter: 'none',
    };
    setStagedPages((prev) => [...prev, newPage]);
    setIsCameraOpen(false);
    // Directly open the PDF creator modal for immediate fast flow (as requested in user prompt UX flow: فتح التطبيق -> تصوير -> تأكيد -> كتابة الاسم -> إنشاء PDF -> حفظ)
    setIsPdfCreatorOpen(true);
  };

  const handleAddStagedPages = (newPages: ScanPage[]) => {
    setStagedPages((prev) => [...prev, ...newPages]);
  };

  const handleRemoveStagedPage = (id: string) => {
    setStagedPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReorderStagedPages = (fromIdx: number, toIdx: number) => {
    setStagedPages((prev) => {
      const list = [...prev];
      if (fromIdx < 0 || fromIdx >= list.length || toIdx < 0 || toIdx >= list.length) return prev;
      const [item] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, item);
      return list;
    });
  };

  // When a new PDF document is created
  const handleDocumentCreated = async (doc: DocumentItem) => {
    await saveDocument(doc);
    await loadDocs();
    setStagedPages([]);
    setIsImagePickerEditorOpen(false);
  };

  const handleRenameDocument = async (id: string, newTitle: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    const updated = { ...doc, title: newTitle };
    await saveDocument(updated);
    await loadDocs();
    if (selectedDocument?.id === id) {
      setSelectedDocument(updated);
    }
  };

  const handleChangeCategory = async (id: string, newCategory: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    const updated = { ...doc, category: newCategory };
    await saveDocument(updated);
    await loadDocs();
    if (selectedDocument?.id === id) {
      setSelectedDocument(updated);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocumentById(id);
    await loadDocs();
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const handleClearAllDocs = async () => {
    await clearAllDatabase();
    await loadDocs();
    setSelectedDocument(null);
  };

  const handleSelectCategoryFromCategoriesScreen = (categoryTitle: string) => {
    setSelectedCategoryFilter(categoryTitle);
    setActiveTab('documents');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Mobile-optimized viewport wrapper */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col relative px-3 sm:px-4 pt-3">
        {/* Active Page View */}
        {activeTab === 'home' && (
          <HomeScreen
            documents={documents}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) {
                setActiveTab('documents');
              }
            }}
            onOpenScan={() => setIsCameraOpen(true)}
            onOpenPicker={() => setIsImagePickerEditorOpen(true)}
            onOpenPdfCreator={() => {
              if (stagedPages.length > 0) {
                setIsPdfCreatorOpen(true);
              } else {
                setIsImagePickerEditorOpen(true);
              }
            }}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentListScreen
            documents={documents}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategoryFilter={selectedCategoryFilter}
            onSelectCategoryFilter={setSelectedCategoryFilter}
            onSelectDocument={(doc) => setSelectedDocument(doc)}
            onOpenScan={() => setIsCameraOpen(true)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesScreen
            documents={documents}
            onSelectCategory={handleSelectCategoryFromCategoriesScreen}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onClearAllDocs={handleClearAllDocs}
            docsCount={documents.length}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Camera Scan Modal */}
      <CameraScanModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onConfirmPhoto={handlePhotoConfirmed}
      />

      {/* Multi-image Picker & Page Editor Modal / View */}
      {isImagePickerEditorOpen && (
        <div className="fixed inset-0 z-50 bg-stone-100 dark:bg-stone-950 overflow-y-auto">
          <div className="w-full max-w-md mx-auto min-h-screen px-3 sm:px-4 pt-3">
            <TopHeader
              title="اختيار وترتيب الصور"
              showBack
              onBack={() => setIsImagePickerEditorOpen(false)}
            />
            <div className="pt-3">
              <ImagePickerEditor
                pages={stagedPages}
                onAddPages={handleAddStagedPages}
                onRemovePage={handleRemoveStagedPage}
                onReorderPages={handleReorderStagedPages}
                onOpenScan={() => setIsCameraOpen(true)}
                onProceedToPdf={() => setIsPdfCreatorOpen(true)}
                onClose={() => setIsImagePickerEditorOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF Creator Modal */}
      <PdfCreatorModal
        isOpen={isPdfCreatorOpen}
        pages={stagedPages}
        onClose={() => setIsPdfCreatorOpen(false)}
        onSuccessCreated={handleDocumentCreated}
      />

      {/* Document Details Modal */}
      <DocumentDetailsModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onRename={handleRenameDocument}
        onChangeCategory={handleChangeCategory}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}
