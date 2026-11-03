import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
export type FetchStrategy = 'networkFirst' | 'staleWhileRevalidate' | 'cacheFirst';
export type StrategyConfig = {
    cacheName: string;
    maxAgeSeconds?: number;
    maxEntries?: number;
};
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
export declare function createStrategy(strategy: FetchStrategy, config: StrategyConfig): NetworkFirst | StaleWhileRevalidate | CacheFirst;
//# sourceMappingURL=strategies.d.ts.map