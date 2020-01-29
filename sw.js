const commit_sha = "{{COMMIT_SHA}}" // value will be set by CD

const urlsToCache = ['/',
  '/index.html',
  '/404.html',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/apple-touch-icon.png',
  '/images/belasto.png',
  '/images/browserconfig.xml',
  '/images/darkSplash189.png',
  '/images/darkSplashScreen.svg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/images/elmo.jpg',
  '/images/favicon-16x16.png',
  '/images/favicon-194x194.png',
  '/images/favicon-32x32.png',
  '/images/favicon.ico',
  '/images/fire.gif',
  '/images/fireworks.gif',
  '/images/fu-meme.jpg',
  '/images/ipadpro1_splash.png',
  '/images/ipadpro2_splash.png',
  '/images/ipadpro3_splash.png',
  '/images/ipad_splash.png',
  '/images/iphone5_splash.png',
  '/images/iphone6_splash.png',
  '/images/iphoneplus_splash.png',
  '/images/iphonexr_splash.png',
  '/images/iphonexsmax_splash.png',
  '/images/iphonex_splash.png',
  '/images/lemma67.png',
  '/images/maskable_icon.png',
  '/images/mstile-150x150.png',
  '/images/safari-pinned-tab.svg',
  '/images/sas.png',
  '/images/teemo.jpg',
  '/styles/betterstyle.css',
  '/styles/charts.css',
  '/scripts/anime.min.js',
  '/scripts/display.js',
  '/scripts/script.js',
  '/scripts/socket.io.js',
  '/scripts/socket.io.js.map',
  '/scripts/stats.js',
  '/scripts/storage.js',
  '/scripts/utils.js'
];

var CACHE_NAME;

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
