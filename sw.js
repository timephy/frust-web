const CACHE_NAME = 'frustrated_cache_6';

const urlsToCache = [
  '/',
  '/scripts/socket.io.js',
  '/images/teemo.jpg',
  '/images/elmo.jpg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/images/belasto.png',
  '/images/fireworks.gif',
  '/version.json',
  '/images/fu-meme.jpg',
  '/index.html',
  '/scripts/storage.js',
  '/scripts/utils.js'
];


self.addEventListener('activate', function(event) {
  console.log("clearing old caches");
  var keepCache = [CACHE_NAME];
      event.waitUntil(
          caches.keys().then( keyList => {
              return Promise.all(keyList.map( key => {
                  if (keepCache.indexOf(key) === -1) {
                      return caches.delete(key);
                  }
              }));
          })
  .then(self.clients.claim()));
});

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
