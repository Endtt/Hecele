const CACHE = 'hecele-v3';
const FILES = ['./', 'index.html', 'style.css', 'words.js', 'sentences.js', 'app.js', 'manifest.webmanifest'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// Önce ağ, olmazsa önbellek: geliştirirken eski dosya takılı kalmasın
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // cache:'reload' tarayıcı önbelleğini atlar; çevrimdışıysa SW önbelleğine döner
  e.respondWith(fetch(e.request, { cache: 'reload' }).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
