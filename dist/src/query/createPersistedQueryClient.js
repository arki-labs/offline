import { QueryClient } from '@tanstack/react-query';
import { persistQueryClientSave } from '@tanstack/query-persist-client-core';
import { createIdbPersister } from './idb-persister.js';
const DEFAULT_STORAGE_KEY = 'arki-offline-query';
const DEFAULT_MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24 hours
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
export function createPersistedQueryClient(options = {}) {
    const { storageKey = DEFAULT_STORAGE_KEY, maxAge = DEFAULT_MAX_AGE_MS, 
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- VITE_BUILD_ID is inlined by Vite at build time, not read from the Turbo env
    buster = import.meta.env.VITE_BUILD_ID ?? '', defaultOptions, } = options;
    const queryClient = new QueryClient({
        defaultOptions: {
            ...defaultOptions,
            queries: {
                gcTime: maxAge,
                ...defaultOptions?.queries,
            },
        },
    });
    const persister = createIdbPersister({ storageKey });
    const persistNow = async () => {
        let outcome;
        await persistQueryClientSave({
            queryClient,
            persister: {
                ...persister,
                persistClient: async (client) => {
                    const written = await persister.persistClientNow(client);
                    if (written !== undefined)
                        outcome = written;
                },
            },
            buster,
        });
        return outcome;
    };
    return { queryClient, persister, persistNow, buster, maxAge };
}
//# sourceMappingURL=createPersistedQueryClient.js.map