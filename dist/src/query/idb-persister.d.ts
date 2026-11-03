import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
import { QueryCachePersistFailed } from './failures.js';
export type CreateIdbPersisterOptions = {
    /**
     * The key used to store the persisted QueryClient cache in IndexedDB.
     * @default 'arki-offline-query'
     */
    storageKey?: string;
};
/** A persister that can also write the cache at once, for callers that must know the write is done. */
export type IdbPersister = Persister & {
    /**
     * Writes `client` now and resolves when it is stored. `persistClient` is throttled to one write a
     * second and does not say when it finishes; a page that reloads right after a delete would restore
     * the older snapshot. Resolves `offline.query_cache_persist_failed` when IndexedDB refuses (storage
     * full, private mode) or the cache cannot be serialized.
     */
    persistClientNow: (client: PersistedClient) => Promise<void | ReturnType<typeof QueryCachePersistFailed>>;
};
/**
 * Creates an async storage persister backed by IndexedDB via idb-keyval.
 *
 * The `storageKey` is used as the single IDB key under which the entire
 * serialized QueryClient cache is stored. The cache is written with SuperJSON
 * (Temporal types registered), so dates and Temporal values restore typed.
 * A cache written as plain JSON restores as empty and is refetched.
 */
export declare function createIdbPersister(options?: CreateIdbPersisterOptions): IdbPersister;
//# sourceMappingURL=idb-persister.d.ts.map