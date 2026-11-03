import type { FetchStrategy } from './strategies.js';
export type AppShellConfig = {
    strategy?: 'networkFirst' | 'staleWhileRevalidate';
    maxAgeSeconds?: number;
    cacheName?: string;
};
export type ApiRouteConfig = {
    urlPattern: RegExp;
    strategy: 'networkFirst' | 'staleWhileRevalidate';
    maxAgeSeconds?: number;
    cacheName?: string;
};
export type StaticAssetConfig = {
    urlPattern: RegExp;
    strategy?: Extract<FetchStrategy, 'cacheFirst' | 'staleWhileRevalidate'>;
    cacheName?: string;
};
export type RegisterOfflineRoutesOptions = {
    appShell?: AppShellConfig;
    apiRoutes?: ApiRouteConfig[];
    staticAssets?: StaticAssetConfig[];
};
/**
 * Registers Workbox fetch strategies for app shell, API routes, and static assets.
 *
 * Call this in your service worker file after `import '@arki/tanstack-start/pwa/sw'`.
 *
 * Invariant: `networkFirst` is the safe default for API routes — it always
 * tries the network, so queued mutations are never "answered" by a stale cache.
 *
 * Cache busting is handled at the strategy level via `cacheName`. Include a
 * build ID suffix in `cacheName` to invalidate on deploy (e.g. `api-v${buildId}`).
 *
 * @example
 * ```ts
 * // src/service-worker.ts
 * import '@arki/tanstack-start/pwa/sw';
 * import { registerOfflineRoutes } from '@arki/offline/pwa';
 *
 * registerOfflineRoutes({
 *   appShell: { strategy: 'staleWhileRevalidate', cacheName: 'app-shell' },
 *   apiRoutes: [
 *     { urlPattern: /\/rpc\//, strategy: 'networkFirst', maxAgeSeconds: 60, cacheName: 'api' },
 *   ],
 * });
 * ```
 */
export declare function registerOfflineRoutes(options?: RegisterOfflineRoutesOptions): void;
//# sourceMappingURL=register-routes.d.ts.map