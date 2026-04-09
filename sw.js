const CACHE='iq-v1';
const FILES=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(f=>{if(e.request.method==='GET'&&e.request.url.startsWith(self.location.origin)){let c=f.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}return f;}).catch(()=>caches.match('./index.html')))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.map(key=>key!==CACHE&&caches.delete(key)))).then(()=>self.clients.claim())));
