importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');



/*
workbox.setConfig({
	//modulePathPrefix: '/js/vendor/workbox-v6.1.5/',
	debug: false
});*///https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js

const { strategies, core, routing, cacheableResponse, expiration } = workbox;

self.skipWaiting();
core.clientsClaim();

core.setCacheNameDetails({
	prefix: 'pct',
	suffix: '0.0.11'
});

// Cache CSS, JS, and Web Worker requests with a Network First strategy
routing.registerRoute(
	// Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
	({ request }) => {

		return request.destination === 'style' ||
			request.destination === 'script' ||
			request.destination === 'worker'
	},

	new strategies.CacheFirst({
		cacheName: 'cache' + 'pct',
		plugins: [
			new cacheableResponse.CacheableResponsePlugin({
				statuses: [200],
			}),
		],
	})
);

routing.registerRoute(
	({ request }) => request.destination === 'image',
	new strategies.CacheFirst({
		cacheName: 'image-cache',
		plugins: [
			new expiration.ExpirationPlugin({
				maxAgeSeconds: 124 * 60 * 60,
				maxEntries: 500,
			}),
		],
	})
);


// The activate handler takes care of cleaning up old caches
self.addEventListener('activate', event => {
	const currentCacheName = core.cacheNames.runtime;
	// Find the old caches if there are any
	caches.keys().then(cacheNames => {

		console.log('cacheNames', cacheNames, currentCacheName)

		return cacheNames.filter(cacheName => cacheName != currentCacheName && cacheName != 'image-cache');
	}).then(cachesToDelete => {
		return Promise.all(cachesToDelete.map(cacheToDelete => {
			console.log('delete cache', cacheToDelete)
			return caches.delete(cacheToDelete);
		}));
	});
});