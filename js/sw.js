self.addEventListener('install', () => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});