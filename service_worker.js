//asignar cache y version al cache
const CACHE_NAME = 'v_0.3_cache_molino_rey',
    urlsToCache = [
        './',
        './vendors/gaxon-icon/styles.css',
        './assets/css/style.min.css'

    ];


self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting());
            }).catch(error => console.log("fallo al registrar ", error
            ))
    );
});

self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return cacheNames.map(cacheName => {
                    if (cacheName.indexOf(cacheName) === -1) {
                        return caches.delete(caheName);
                    }
                });

            }).then(() => self.clients.claim())
    );

});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => {
        if (res) {
            return res
        }
        return fetch(e.request)
    }))
});