const CACHE = 'hecele-v1';
const FILES = ['./', 'index.html', 'style.css', 'words.js', 'app.js', 'manifest.webmanifest'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
));
// Önce ağ, olmazsa önbellek: geliştirirken eski dosya takılı kalmasın
self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
