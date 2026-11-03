import type { DefaultOptions } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import type { IdbPersister } from './idb-persister.js';
import type { QueryCachePersistFailed } from './failures.js';
export type CreatePersistedQueryClientOptions = {
    /**
     * The key used to store the persisted QueryClient cache in IndexedDB.
     * @default 'arki-offline-query'
     */
    storageKey?: string;
    /**
     * Maximum age of the persisted cache in milliseconds. Caches older than
     * this will be discarded on restore.
     * @default 86_400_000 (24 hours)
     */
    maxAge?: number;
    /**
     * A buster string that, when changed, invalidates any previously persisted
     * cache. Defaults to `import.meta.env.VITE_BUILD_ID` so a new deploy
     * automatically busts stale caches.
     * @default import.meta.env.VITE_BUILD_ID ?? ''
     */
    buster?: string;
    /**
     * Default options forwarded to the QueryClient constructor.
     */
    defaultOptions?: DefaultOptions;
};
export type PersistedQueryClient = {
    queryClient: QueryClient;
    persister: IdbPersister;
    /**
     * Writes the whole cache to IndexedDB now and resolves when it is stored. Await it after removing
     * a query that must never come back (a deleted item) and before the page can reload; the
     * provider's own writes are throttled to one a second.
     */
    persistNow: () => Promise<void | ReturnType<typeof QueryCachePersistFailed>>;
    /** Resolved buster string — forward to `PersistedQueryClientProvider`. */
    buster: string;
    /** Resolved max age in ms — forward to `PersistedQueryClientProvider`. */
    maxAge: number;
};
/**
 * Creates a TanStack QueryClient paired with an IndexedDB-backed persister.
 *
 * The pair should be passed to `PersistedQueryClientProvider` (or to
 * `PersistQueryClientProvider` from `@tanstack/react-query-persist-client`
 * directly) so the cache survives page reloads and short network outages.
 *
 * @example
 * ```tsx
 * const { queryClient, persister } = createPersistedQueryClient();
 *
 * function App() {
 *   return (
 *     <PersistedQueryClientProvider client={queryClient} persister={persister}>
 *       <YourApp />
 *     </PersistedQueryClientProvider>
 *   );
 * }
 * ```
 */
export declare function createPersistedQueryClient(options?: CreatePersistedQueryClientOptions): PersistedQueryClient;
//# sourceMappingURL=createPersistedQueryClient.d.ts.map