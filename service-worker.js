const CACHE_NAME = "canalettes-audio-v36";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/langue.js",
  "/manifest.json",

  "/textes/fr.json",
  "/textes/en.json",
  "/textes/es.json",
  "/textes/ca.json",
  "/textes/de.json",
  "/textes/ru.json",
  "/textes/it.json",

  "/images/icon-192.png",
  "/images/icon-152.png",
  "/images/grotte.jpg"
];

/* INSTALLATION */
self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

});

/* ACTIVATION */
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    }).then(() => self.clients.claim())

  );

});

/* REQUÊTES */
self.addEventListener("fetch", event => {

  const request = event.request;

  /*
    NE JAMAIS mettre le service worker
    lui-même en cache.
  */
  if (
    new URL(request.url).pathname.endsWith("/service-worker.js")
  ) {
    event.respondWith(fetch(request));
    return;
  }

  /*
    Les fichiers JSON de langues doivent toujours
    être récupérés depuis le réseau quand celui-ci
    est disponible.
  */
  if (
    new URL(request.url).pathname.includes("/textes/")
  ) {

    event.respondWith(

      fetch(request)
        .then(response => {

          if (response.ok) {

            const copie = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copie);
            });

          }

          return response;

        })
        .catch(() => {

          return caches.match(request);

        })

    );

    return;
  }

  /*
    Les fichiers audio :
    réseau d'abord, puis cache si nécessaire.
  */
  if (
    new URL(request.url).pathname.includes("/audios/")
  ) {

    event.respondWith(

      fetch(request)
        .then(response => {

          if (response.ok) {

            const copie = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copie);
            });

          }

          return response;

        })
        .catch(() => {

          return caches.match(request);

        })

    );

    return;
  }

  /*
    Pour le reste :
    cache d'abord, puis réseau.
  */
  event.respondWith(

    caches.match(request).then(cachedResponse => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request);

    })

  );

});