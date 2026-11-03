/// <reference lib="webworker" />
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
/**
 * Creates a Workbox strategy handler from a named strategy + config.
 *
 * `networkFirst` always tries the network; falls back to cache on failure.
 * Best for API routes where stale data would be harmful.
 *
 * `staleWhileRevalidate` serves from cache immediately, then updates
 * the cache in the background. Best for app shell (fast loads, eventually fresh).
 *
 * `cacheFirst` always serves from cache if available. Best for versioned
 * static assets that never change at a given URL.
 */
export function createStrategy(strategy, config) {
    const plugins = config.maxAgeSeconds !== undefined || config.maxEntries !== undefined
        ? [new ExpirationPlugin({
                maxAgeSeconds: config.maxAgeSeconds,
                maxEntries: config.maxEntries,
                purgeOnQuotaError: true,
            })]
        : [];
    switch (strategy) {
        case 'networkFirst': {
            return new NetworkFirst({ cacheName: config.cacheName, plugins });
        }
        case 'staleWhileRevalidate': {
            return new StaleWhileRevalidate({ cacheName: config.cacheName, plugins });
        }
        case 'cacheFirst': {
            return new CacheFirst({ cacheName: config.cacheName, plugins });
        }
    }
}
//# sourceMappingURL=strategies.js.map