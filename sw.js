const CACHE_NAME = 'mosdakia-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', (e) => {
  // استراتيجية Network First لضمان تحميل أحدث نسخة من الملفات البرمجية
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});