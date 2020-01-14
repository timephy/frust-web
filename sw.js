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
  '/images/fu-meme.jpg'
];

var prevVersionResponse;
let versionJson = {
  commit_sha: "512fa2e5e1dcbac584562356a8e51f23aa1727fd",  //fallback value
  timestamp: new Date(2010 - 01 - 5) //fallback value
};
let prevVersionJson = {
  commit_sha: "512fa2e5e1dcbac584562356a8e51f23aa1727fd",  //fallback value
  timestamp: new Date(2010 - 01 - 1) //fallback value
};

self.addEventListener('activate', function(event) {
  console.log('activating service worker');

  fetch('/version').then(response => response.json())
    .then(json => {
      versionJson = json;
      console.log(versionJson);

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
      }else{
        console.log('version hasnt changed, keep cache as is');
      }
    })
    .catch((error, json) => {
      console.log('couldnt get version ' + error);
      alert('couldnt get version ' + error);
    });
});

function newVersion() {
  return (versionJson.timestamp > prevVersionJson.timestamp)
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
  if (event.request.url.includes('/version')) {
    console.log('requesting version');
    event.respondWith(
      caches.match(event.request)
      // Cache hit - return response, save the cached response
      .then((response) => {
        prevVersionResponse = response;
        prevVersionResponse.then(response => response.json())
          .then(json => {
            prevVersionJson = json;
            console.log('prevVersionJson '+prevVersionJson);
          }).catch((error, json) => {
            console.log('couldnt get cached version ' + error);
            alert('couldnt get cached version ' + error);
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
