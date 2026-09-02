// IndexedDB manager for storing custom user-uploaded Adhan videos and audio files

const DB_NAME = 'AdhanMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'customMedia';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export interface StoredMediaItem {
  id: string; // e.g. "custom_adhan_fajr" or "custom_video_maghrib"
  name: string;
  type: 'video' | 'audio';
  blob: Blob;
  mimeType: string;
  updatedAt: number;
}

export async function saveMediaToDB(id: string, name: string, type: 'video' | 'audio', file: File | Blob): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item: StoredMediaItem = {
      id,
      name,
      type,
      blob: file,
      mimeType: file.type,
      updatedAt: Date.now(),
    };
    const req = store.put(item);
    req.onsuccess = () => {
      // Create Object URL for active session
      const url = URL.createObjectURL(file);
      resolve(url);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaFromDB(id: string): Promise<{ item: StoredMediaItem; url: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        const item = req.result as StoredMediaItem | undefined;
        if (!item) {
          resolve(null);
          return;
        }
        const url = URL.createObjectURL(item.blob);
        resolve({ item, url });
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to load media from DB:', err);
    return null;
  }
}

export async function deleteMediaFromDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
