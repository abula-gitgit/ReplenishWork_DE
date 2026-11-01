// Replenish Service Worker (English Edition)
const SW_VERSION = 'v1.0.0-en';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click: focus existing window or open new window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url && client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Periodic Background Sync (when supported by browser e.g. Chrome PWA)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'replenish-check-reminder') {
    event.waitUntil(
      self.registration.showNotification('[Replenish] Routine Supply Check', {
        body: 'Check if any workplace supplies or inspections are due for replacement or restocking today.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'replenish-daily-periodic',
        data: { url: '/' }
      })
    );
  }
});

// Message listener from foreground client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      ...options,
      icon: options?.icon || '/icon.svg',
      badge: options?.badge || '/icon.svg',
      data: options?.data || { url: '/' }
    });
  }
});
