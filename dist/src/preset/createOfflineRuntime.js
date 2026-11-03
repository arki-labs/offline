import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, Fragment, useState } from 'react';
import { OfflineDevPanel } from '../devtools/DevPanel.js';
import { OfflineQueueProvider } from '../mutations/OfflineQueueProvider.js';
import { createOfflineMutationQueue } from '../mutations/queue.js';
import { createPersistedQueryClient } from '../query/createPersistedQueryClient.js';
import { PersistedQueryClientProvider } from '../query/PersistedQueryClientProvider.js';
function browserOnly(member) {
    return new Error(`@arki/offline: offline.${member} exists only in the browser. On the server every request gets its own ` +
        'QueryClient inside <offline.Provider>; read it with useQueryClient().');
}
/**
 * One QueryClient per server render, so no request reads another request's cache. `gcTime: Infinity`
 * is TanStack Query's server default: no garbage-collection timers, so the cache is freed with the
 * request. The persisted cache's 24-hour `gcTime` is for the browser and would keep each request's
 * data in memory for a day.
 */
function RequestQueryClientProvider(props) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            ...props.defaultOptions,
            queries: { ...props.defaultOptions?.queries, gcTime: Number.POSITIVE_INFINITY },
        },
    }));
    return createElement(QueryClientProvider, { client: queryClient, children: props.children });
}
// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
/**
 * Creates a fully-wired offline runtime in a single call.
 *
 * Tier 'cache-only' (Tier 1): persisted QueryClient only.
 * Reads survive page reloads and short network outages.
 * Use this as the default for most apps.
 *
 * Tier 'queue' (Tier 2): persisted QueryClient + OfflineMutationQueue.
 * Writes made while offline are queued and replayed on reconnect.
 * Only use this in apps where write durability during offline sessions matters.
 *
 * @example — template usage (Tier 1):
 * ```ts
 * // src/lib/offline.ts
 * import { createOfflineRuntime } from '@arki/offline/preset';
 * import { rpcClient } from './orpc/client';
 *
 * export const offline = createOfflineRuntime({
 *   tier: 'cache-only',
 *   appId: 'myapp',
 *   devtools: true,
 * });
 * ```
 *
 * @example — Tier 2 with mutation queue:
 * ```ts
 * export const offline = createOfflineRuntime({
 *   tier: 'queue',
 *   appId: 'shop',
 *   rpc: rpcClient,
 *   actorId: () => signedInUserId, // your session state; `null` signed out, `undefined` not known yet
 *   devtools: true,
 * });
 * ```
 *
 * Then wire the Provider in your root provider. Components read the client with `useQueryClient()`:
 * ```tsx
 * <offline.Provider>{children}</offline.Provider>
 * ```
 *
 * In the browser, `Provider` uses one persisted QueryClient (`offline.queryClient`). On the server
 * (SSR) this module serves every request, so `Provider` makes a fresh, unpersisted client for each
 * request instead, and `offline.queryClient` throws there.
 */
export function createOfflineRuntime(config) {
    const { appId, devtools = false, queryDefaults } = config;
    // Browser only: on the server one module-level client would be a cache shared by every request.
    const persisted = isServer
        ? undefined
        : createPersistedQueryClient({
            storageKey: `arki-offline-query:${appId}`,
            buster: config.buster,
            defaultOptions: queryDefaults,
        });
    let queue;
    if (config.tier === 'queue') {
        queue = createOfflineMutationQueue({
            storageKey: `arki-offline-mutations:${appId}`,
            deadLetterStorageKey: `arki-offline-mutations-dead:${appId}`,
            rpc: config.rpc,
            actorId: config.actorId,
        });
    }
    function Provider({ children }) {
        let content = children;
        // Dev panel floats visually, but must stay inside the queue provider when
        // tier 'queue' is enabled so it can inspect queued/dead-lettered writes.
        if (devtools) {
            content = createElement(Fragment, null, content, createElement(OfflineDevPanel));
        }
        // Innermost: queue provider (only in tier 'queue')
        if (queue) {
            content = createElement(OfflineQueueProvider, { queue, children: content });
        }
        // Outer: the query client provider. On the server, a fresh client for this request.
        if (!persisted) {
            return createElement(RequestQueryClientProvider, { defaultOptions: queryDefaults, children: content });
        }
        return createElement(PersistedQueryClientProvider, {
            client: persisted.queryClient,
            persister: persisted.persister,
            maxAge: persisted.maxAge,
            buster: persisted.buster,
            children: content,
        });
    }
    return {
        get queryClient() {
            if (!persisted)
                throw browserOnly('queryClient');
            return persisted.queryClient;
        },
        persistNow: () => (persisted ? persisted.persistNow() : Promise.reject(browserOnly('persistNow()'))),
        queue,
        dispose: () => queue?.dispose(),
        Provider,
    };
}
//# sourceMappingURL=createOfflineRuntime.js.map