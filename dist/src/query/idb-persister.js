import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { del, get, set } from 'idb-keyval';
import { z } from 'zod';
import { attempt, isFailure } from '@arki/failure';
import { getLogger } from '@arki/log';
import { parse } from '@arki/schema';
import { offlineSerializer } from '../serializer.js';
import { QueryCachePersistFailed } from './failures.js';
/** Enable with `DEBUG=arki:offline:query`. */
const debugPersister = getLogger('arki:offline:query');
/**
 * What a stored cache must look like before TanStack restores it. TanStack owns the shape of the
 * dehydrated queries and mutations (it changes with its version), so only the envelope and the
 * entries' identity are checked here; `buster` and `maxAge` reject anything stale or foreign.
 */
const storedClientSchema = z.custom(value => z
    .object({
    timestamp: z.number(),
    buster: z.string(),
    clientState: z.object({
        mutations: z.array(z.looseObject({})),
        queries: z.array(z.looseObject({ queryHash: z.string(), queryKey: z.array(z.unknown()) })),
    }),
})
    .safeParse(value).success);
/**
 * Creates an async storage persister backed by IndexedDB via idb-keyval.
 *
 * The `storageKey` is used as the single IDB key under which the entire
 * serialized QueryClient cache is stored. The cache is written with SuperJSON
 * (Temporal types registered), so dates and Temporal values restore typed.
 * A cache written as plain JSON restores as empty and is refetched.
 */
export function createIdbPersister(options = {}) {
    const key = options.storageKey ?? 'arki-offline-query';
    const throttled = createAsyncStoragePersister({
        storage: {
            getItem: (storageKey) => get(storageKey).then((v) => v ?? null),
            setItem: (storageKey, value) => set(storageKey, value),
            removeItem: (storageKey) => del(storageKey),
        },
        key,
        throttleTime: 1000,
        serialize: (client) => offlineSerializer.stringify(client),
        deserialize: (text) => {
            const stored = parse(storedClientSchema, offlineSerializer.parse(text));
            if (isFailure(stored))
                throw new Error('The stored query cache does not match its shape', { cause: stored });
            return stored;
        },
    });
    return {
        ...throttled,
        // A stored cache that does not match its shape (an old build, a bad write) is dropped and refetched.
        restoreClient: async () => {
            try {
                return await throttled.restoreClient();
            }
            catch (error) {
                debugPersister.debug('dropping the stored query cache: {reason}', {
                    reason: error instanceof Error ? error.message : String(error),
                });
                await throttled.removeClient();
                return;
            }
        },
        persistClientNow: client => attempt(async () => {
            await set(key, offlineSerializer.stringify(client));
        }, cause => QueryCachePersistFailed({ cause })),
    };
}
//# sourceMappingURL=idb-persister.js.map