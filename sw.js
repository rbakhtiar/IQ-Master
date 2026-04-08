const CACHE_NAME = 'iq-master-v1';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).then(fetchResponse => {
                if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return fetchResponse;
                const clone = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return fetchResponse;
            });
        }).catch(() => caches.match('./index.html'))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))).then(() => self.clients.claim())
    );
});
