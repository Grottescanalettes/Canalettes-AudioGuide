const CACHE_NAME = "grottes-canalettes-v32";

const urlsToCache = [

    // ================================
    // PAGES PRINCIPALES
    // ================================

    "./",
    "./index.html",

    // ================================
    // CSS / JAVASCRIPT
    // ================================

    "./style.css",
    "./script.js",
    "./langue.js",
    "./manifest.json",

    // ================================
    // IMAGES / ICÔNES
    // ================================

    "./images/grotte.jpg",
    "./images/icon-192.png",
    "./images/icon-152.png",

    // ================================
    // PAGE SALLE
    // ================================

    "./salles/salle.html",
    "./salles/salle-blanche.html",
    "./salles/salle-du-balcon.html",
    "./salles/lac-aux-atolls.html",
    "./salles/salle-du-temple-angkor.html",
    "./salles/gouffre.html",
    "./salles/plafond-des-excentriques.html",

    // ================================
    // LANGUES
    // ================================

    "./langues/francais.html",
    "./langues/anglais.html",
    "./langues/espagnol.html",
    "./langues/catalan.html",
    "./langues/allemand.html",
    "./langues/russe.html",
    "./langues/italien.html",

    // ================================
    // TEXTES
    // ================================

    "./textes/salles.json",
    "./textes/fr.json",
    "./textes/en.json",
    "./textes/es.json",
    "./textes/ca.json",
    "./textes/de.json",
    "./textes/ru.json",
    "./textes/it.json",

    // ================================
    // AUDIO FRANÇAIS
    // ================================

    "./audios/fr/couloir-des-cupules.mp3",
    "./audios/fr/lac-aux-atolls.mp3",
    "./audios/fr/salle-blanche.mp3",
    "./audios/fr/salle-du-balcon.mp3",
    "./audios/fr/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO ANGLAIS
    // ================================

    "./audios/en/couloir-des-cupules.mp3",
    "./audios/en/lac-aux-atolls.mp3",
    "./audios/en/salle-blanche.mp3",
    "./audios/en/salle-du-balcon.mp3",
    "./audios/en/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO ESPAGNOL
    // ================================

    "./audios/es/couloir-des-cupules.mp3",
    "./audios/es/lac-aux-atolls.mp3",
    "./audios/es/salle-blanche.mp3",
    "./audios/es/salle-du-balcon.mp3",
    "./audios/es/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO CATALAN
    // ================================

    "./audios/ca/couloir-des-cupules.mp3",
    "./audios/ca/lac-aux-atolls.mp3",
    "./audios/ca/salle-blanche.mp3",
    "./audios/ca/salle-du-balcon.mp3",
    "./audios/ca/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO ALLEMAND
    // ================================

    "./audios/de/couloir-des-cupules.mp3",
    "./audios/de/lac-aux-atolls.mp3",
    "./audios/de/salle-blanche.mp3",
    "./audios/de/salle-du-balcon.mp3",
    "./audios/de/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO RUSSE
    // ================================

    "./audios/ru/couloir-des-cupules.mp3",
    "./audios/ru/lac-aux-atolls.mp3",
    "./audios/ru/salle-blanche.mp3",
    "./audios/ru/salle-du-balcon.mp3",
    "./audios/ru/salle-du-temple-angkor.mp3",

    // ================================
    // AUDIO ITALIEN
    // ================================

    "./audios/it/couloir-des-cupules.mp3",
    "./audios/it/lac-aux-atolls.mp3",
    "./audios/it/salle-blanche.mp3",
    "./audios/it/salle-du-balcon.mp3",
    "./audios/it/salle-du-temple-angkor.mp3"
];


// ====================================
// INSTALLATION
// ====================================

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {

            return Promise.all(

                urlsToCache.map(url => {

                    return fetch(url)
                        .then(response => {

                            if (!response.ok) {
                                throw new Error(
                                    "Erreur HTTP " +
                                    response.status +
                                    " pour " +
                                    url
                                );
                            }

                            return cache.put(url, response);

                        })
                        .catch(error => {

                            console.log(
                                "Impossible de mettre en cache :",
                                url,
                                error
                            );

                        });

                })

            );

        })

    );

});


// ====================================
// ACTIVATION
// ====================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames.map(cacheName => {

                    if (cacheName !== CACHE_NAME) {

                        console.log(
                            "Suppression ancien cache :",
                            cacheName
                        );

                        return caches.delete(cacheName);

                    }

                })

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


// ====================================
// REQUÊTES
// ====================================

self.addEventListener("fetch", event => {

    const request = event.request;

    // On ne traite que les requêtes GET
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(request).then(cachedResponse => {

            // Si le fichier est déjà en cache
            if (cachedResponse) {
                return cachedResponse;
            }

            // Sinon on tente Internet
            return fetch(request)

                .then(response => {

                    return response;

                })

                .catch(() => {

                    // Si on demande une page HTML
                    // et qu'Internet est absent,
                    // on retourne l'accueil.

                    if (
                        request.headers
                            .get("accept")
                            ?.includes("text/html")
                    ) {

                        return caches.match("./index.html");

                    }

                });

        })

    );

});