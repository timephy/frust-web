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

function loadJson(callback, path) {
  fetch(path)
    .then(response => response.json())
    .then(json => callback(null, json))
    .catch(error => callback(error, {
      "error": "while fetching data, sorry"
    }));
}

self.addEventListener('activate', function(event) {
});


function deleteCaches(error, json) {
  if (error)
    console.error(error);
    console.log('custom error');
  else {
    CACHE_NAME = json.commit_sha || 'frustratedCacheFallback';
    console.log(CACHE_NAME);
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key != CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    });
  }
}

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache  ', CACHE_NAME);
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
