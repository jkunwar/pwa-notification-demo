const CACHE_NAME = 'version1';

self.addEventListener('install', (event) => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll([
                '/notificationDemo/',
                '/notificationDemo/index.html',
                '/notificationDemo/css/style.css',
                '/notificationDemo/js/main.js',
                '/notificationDemo/manifest.json',
                '/notificationDemo/icons/favicon-196.png',
                '/notificationDemo/images/cross.png',
                '/notificationDemo/images/tick.png',
            ])
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(cacheName => cacheName != CACHE_NAME).map(item => caches.delete(item)))
    }))
});

self.addEventListener('fetch', (event) => {

    // STALE WHILE REVALIDATE
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchedResponse = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone())
                    return networkResponse
                })
                return cachedResponse || fetchedResponse
            })
        })
    )
});

self.addEventListener('notificationclick', event => {
    switch (event.action) {
        case 'agree':
            postMessage('So we both agree on that!')
            break
        case 'disagree':
            postMessage('Let\'s agree to disagree.')
            break
        default:
            break
    }
})

function postMessage(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(message)
        });
    })
}