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

var CACHE_VERSION = commit_sha;

var CURRENT_CACHES = {
  prefetch: 'frustrated-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var now = Date.now();

  console.log('Handling install event. Resources to prefetch:', urlsToCache);
event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      var cachePromises = urlsToCache.map(function(urlToPrefetch) {
        var url = new URL(urlToPrefetch, location.href);
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

        var request = new Request(url, {
          mode: 'no-cors'
        });
        return fetch(request).then(function(response) {
          if (response.status >= 400) {
            throw new Error('request for ' + urlToPrefetch +
              ' failed with status ' + response.statusText);
          }
          // Use the original URL without the cache-busting parameter as the key for cache.put().
          return cache.put(urlToPrefetch, response);
        }).catch(function(error) {
          console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
        });
      });

      return Promise.all(cachePromises).then(function() {
        console.log('Pre-fetching complete.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});



self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
