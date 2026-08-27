import { DocumentItem } from '../types';

const DB_NAME = 'mustanadati_db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllDocuments(): Promise<DocumentItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as DocumentItem[]) || [];
        // Sort descending by createdAt
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching docs from IndexedDB:', error);
    // Fallback to localStorage
    const local = localStorage.getItem('mustanadati_docs');
    return local ? JSON.parse(local) : [];
  }
}

export async function saveDocument(doc: DocumentItem): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(doc);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    const existing = await getAllDocuments();
    const idx = existing.findIndex((d) => d.id === doc.id);
    if (idx >= 0) existing[idx] = doc;
    else existing.unshift(doc);
    localStorage.setItem('mustanadati_docs', JSON.stringify(existing));
  }
}

export async function deleteDocumentById(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error);
    const existing = await getAllDocuments();
    const filtered = existing.filter((d) => d.id !== id);
    localStorage.setItem('mustanadati_docs', JSON.stringify(filtered));
  }
}

export async function clearAllDatabase(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
    localStorage.removeItem('mustanadati_docs');
  }
}
