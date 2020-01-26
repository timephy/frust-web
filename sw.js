var CACHE_NAME = 'frustratedCache';

// don't ever cache /version.json
const urlsToCache = [
  '/',
  '/scripts/socket.io.js',
  '/images/teemo.jpg',
  '/images/elmo.jpg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/images/belasto.png',
  '/images/fireworks.gif',
  '/images/fu-meme.jpg', ,
  '/images/fire.gif',
  '/index.html',
  '/scripts/storage.js',
  '/scripts/utils.js'
];


self.addEventListener('activate', function(event) {
  event.waitUntil(deleteCaches().then(self.clients.claim()));
});

function deleteCaches() {

  return new Promise((resolve, reject) => {
    console.log("clearing old caches");
    fetch('/version.json?' + Math.random()).json().then((json => {
      CACHE_NAME = json;
      console.log(CACHE_NAME);
      var keepCache = [CACHE_NAME];
      caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
          if (keepCache.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
        resolve("Success!")
      })
    })).catch(reject("error!"));
  })


}

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache  ',CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
      });
    })
  );
});
