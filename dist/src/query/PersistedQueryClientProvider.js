import { jsx as _jsx } from "react/jsx-runtime";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
/**
 * Thin wrapper around `PersistQueryClientProvider` that accepts a pre-built
 * `client` + `persister` pair (from `createPersistedQueryClient`) and forwards
 * the optional `maxAge` and `buster` into `persistOptions`.
 *
 * @example
 * ```tsx
 * const { queryClient, persister } = createPersistedQueryClient();
 *
 * <PersistedQueryClientProvider client={queryClient} persister={persister}>
 *   <App />
 * </PersistedQueryClientProvider>
 * ```
 */
export function PersistedQueryClientProvider({ client, persister, maxAge, buster, dehydrateOptions, children, }) {
    return (_jsx(PersistQueryClientProvider, { client: client, persistOptions: { persister, maxAge, buster, dehydrateOptions }, children: children }));
}
//# sourceMappingURL=PersistedQueryClientProvider.js.map