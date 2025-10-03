const CACHE_NAME = "chat-cache-v1",
  urlsToCache = [
    "/",
    "./index.html",
    "./sec.js",
    "./cha.js",
    "./profile.png",
    "./logo_foz.png",
  ];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open("chat-cache-v1").then(function (e) {
      return e.addAll(urlsToCache);
    })
  );
}),
  self.addEventListener("fetch", function (e) {
    e.respondWith(
      caches.match(e.request).then(function (n) {
        return n || fetch(e.request);
      })
    );
  });
