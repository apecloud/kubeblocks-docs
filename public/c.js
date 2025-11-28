if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) {
      registration.unregister();
    });
  });
}
if (window.caches && caches.keys) {
  caches.keys().then(function (keys) {
    keys.forEach(function (key) {
      caches.delete(key);
    });
  });
}
