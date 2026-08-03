const CACHE_NAME = "grottes-canalettes-v30";


const urlsToCache = [

  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./langue.js",
  "./manifest.json",
  "./service-worker.js",

  "./images/icon-192.png",
  "./images/icon-152.png",


  // Pages salles

  "./salles/salle.html",
  "./salles/salle-blanche.html",
  "./salles/salle-du-balcon.html",
  "./salles/lac-aux-atolls.html",
  "./salles/salle-du-temple-angkor.html",
  "./salles/gouffre.html",
  "./salles/plafond-des-excentriques.html",


  // Langues

  "./langues/francais.html",
  "./langues/anglais.html",
  "./langues/espagnol.html",
  "./langues/catalan.html",
  "./langues/allemand.html",
  "./langues/russe.html",


  // Textes

  "./textes/salles.json",
  "./textes/fr.json",
  "./textes/en.json",
  "./textes/es.json",


  // Audios français

  "./audios/fr/couloir-des-cupules.mp3",
  "./audios/fr/lac-aux-atolls.mp3",
  "./audios/fr/salle-blanche.mp3",
  "./audios/fr/salle-du-balcon.mp3",
  "./audios/fr/salle-du-temple-angkor.mp3",


  // Audios anglais

  "./audios/en/couloir-des-cupules.mp3",
  "./audios/en/lac-aux-atolls.mp3",
  "./audios/en/salle-blanche.mp3",
  "./audios/en/salle-du-balcon.mp3",
  "./audios/en/salle-du-temple-angkor.mp3",


  // Audios espagnols

  "./audios/es/couloir-des-cupules.mp3",
  "./audios/es/lac-aux-atolls.mp3",
  "./audios/es/salle-blanche.mp3",
  "./audios/es/salle-du-balcon.mp3",
  "./audios/es/salle-du-temple-angkor.mp3"

];



// INSTALLATION

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)

    .then(cache => {

      return Promise.all(

        urlsToCache.map(url => {

          return fetch(url)

          .then(response => {

            return cache.put(url, response);

          })

          .catch(error => {

            console.log("Erreur cache :", url);

          });

        })

      );

    })

  );

});




// ACTIVATION

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()

    .then(cacheNames => {

      return Promise.all(

        cacheNames.map(cache => {

          if(cache !== CACHE_NAME){

            return caches.delete(cache);

          }

        })

      );

    })

    .then(() => self.clients.claim())

  );

});




// MODE HORS CONNEXION

self.addEventListener("fetch", event => {

  const request = event.request;


  if(request.method !== "GET"){

    return;

  }


  event.respondWith(

    caches.match(request)

    .then(response => {


      if(response){

        return response;

      }


      return fetch(request)

      .catch(() => {


        if(request.headers.get("accept")?.includes("text/html")){

          return caches.match("./index.html");

        }


      });


    })

  );

});