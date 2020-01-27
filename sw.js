var CACHE_NAME;
const urlsToCache = [
  '/scripts/socket.io.js',
  '/images/teemo.jpg',
  '/images/elmo.jpg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/images/belasto.png',
  '/images/fireworks.gif',
  '/images/fu-meme.jpg',
  '/images/fire.gif',
  '/styles/betterstyle.css',
  '/styles/charts.css'
];

function cacheAll() {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  });
}

function loadJson(callback, path) {
  fetch(path)
    .then(response => response.json())
    .then(json => callback(null, json))
    .catch(error => callback(error, {
      "error": "while fetching data, sorry"
    }));
  return callback;
}

function updateCaches(error, json) {
  var promise = new Promise(function(resolve, reject) {
    if (error) {
      console.log('error getting version json');
      console.error(error);
      reject(error)
    } else {
      CACHE_NAME = json.commit_sha;
      resolve(cacheAll());
    }
  });
  return promise;
}

function deleteCaches() {
  console.log('keeping cache', CACHE_NAME);
  caches.keys().then(keyList => {
    return Promise.all(keyList.map(key => {
      if (key != CACHE_NAME) {
        console.log('deleting cache: ', key);
        return caches.delete(key);
      }
    }));
  });
}

self.addEventListener('activate', function(event) {
  console.log('activating service worker');
  if (CACHE_NAME) {
    console.log('cache name loaded, deleting caches');
    deleteCaches();
  } else {
    console.log('default cache name detected, keeping as is');
  }
});

self.addEventListener('install', function(event) {
  console.log('installing...');
  event.waitUntil(loadJson(updateCaches, '/version.json?' + Math.random()));
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
