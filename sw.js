const CACHE_NAME = 'frustrated-cache';
const commit_sha = "512fa2e5e1dcbac584562356a8e51f23aa1727fd";

const urlsToCache = [
  '/',
  '/index.html',
  '/styles/betterstyle.css',
  '/scripts/storage.js',
  '/scripts/script.js',
  '/scripts/socket.io.js',
  '/scripts/display.js',
  '/scripts/utils.js',
  '/images/teemo.jpg',
  '/images/elmo.jpg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/version',
  '/images/fu-meme.jpg'
];

var prevVersionResponse;
var cacheError = false;
let prevVersionJson = {
  commit_sha: "512fa2e5e1dcbac584562356a8e51f23aa1727fd", //fallback value
  timestamp: "2005-01-14T20:24:21.644Z" //fallback value
};
let currentVersionJson = {
  commit_sha: "512fa2e5e1dcbac584562356a8e51f23aa1727fd", //fallback value
  timestamp: "2010-01-14T20:24:21.644Z" //fallback value
};

self.addEventListener('activate', function(event) {
  console.log('activating service worker');

  fetch('/version').then(response => response.json())
    .then(json => {
      prevVersionJson = json;
      console.log(prevVersionJson);

      if (newVersion()) {
        event.waitUntil(
          caches.keys().then(function(cacheNames) {
            forEach((cacheNames, cacheName) => {
              caches.delete(cacheName);
              console.log('deleting cache' + cacheName);
              alert('deleting cache ');
            });

            //all caches deleted, now repopulate them
            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
              })
          })
        );
      } else {
        console.log('version hasnt changed, keep cache as is');
      }
    })
    .catch((error, json) => {
      console.log('couldnt get version ' + error);
      cacheError = true;
    });
});

function newVersion() {
  return (prevVersionJson.timestamp > currentVersionJson.timestamp) || cacheError;
}

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
  if (event.request.url.endsWith('version')) {
    console.log('requesting version');
    event.respondWith(
      caches.match(event.request)
      // Cache hit - return response, save the cached response
      .then((response) => {
        prevVersionResponse = response;
        prevVersionResponse.then(response => response.json())
          .then(json => {
            currentVersionJson = json;
            console.log('currentVersionJson ' + currentVersionJson);
          }).catch((error, json) => {
            console.log('couldnt get cached version ' + error);
            alert('couldnt get cached version ' + error);
            cacheError = true;
          });

        return fetch(event.request);
      }));
    return;
  } else {
    event.respondWith(
      caches.match(event.request)
      // Cache hit - return response, or a new version is available, then get
      .then((response) => (!response || newVersion()) ? fetch(event.request) : response)
    );
    return;
  }
});
