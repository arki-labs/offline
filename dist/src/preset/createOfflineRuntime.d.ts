import type { DefaultOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import type { AnyRpcClient, OfflineMutationQueue } from '../mutations/queue.js';
import type { QueryCachePersistFailed } from '../query/failures.js';
export type CacheOnlyConfig = {
    tier: 'cache-only';
    appId: string;
    buster?: string;
    devtools?: boolean;
    /** Forwarded to the underlying QueryClient — wire SuperJSON / staleTime / dehydration filters here. */
    queryDefaults?: DefaultOptions;
};
export type QueueConfig = {
    tier: 'queue';
    appId: string;
    rpc: AnyRpcClient;
    /** Who is signed in now (`null`: signed out; `undefined`: not known yet). Queued writes replay only under the actor that queued them. */
    actorId: () => string | null | undefined;
    buster?: string;
    devtools?: boolean;
    /** Forwarded to the underlying QueryClient — wire SuperJSON / staleTime / dehydration filters here. */
    queryDefaults?: DefaultOptions;
};
export type OfflineRuntimeConfig = CacheOnlyConfig | QueueConfig;
export type OfflineRuntime = {
    /**
     * The browser's one persisted QueryClient. Browser only: reading it on the server throws, because a
     * module-level client there would be one cache shared by every request. On the server each render of
     * `Provider` gets its own client; read it with `useQueryClient()`.
     */
    queryClient: QueryClient;
    /**
     * Writes the persisted query cache to IndexedDB now and resolves when it is stored. After removing
     * a query that must not come back (a deleted item), await it before the page can reload: the
     * automatic writes are throttled to one a second. Resolves `offline.query_cache_persist_failed` when
     * IndexedDB refuses the write. Browser only: on the server it rejects.
     */
    persistNow: () => Promise<void | ReturnType<typeof QueryCachePersistFailed>>;
    queue?: OfflineMutationQueue;
    /** Stops the queue's replay loop and removes its window listeners. Call it when the runtime is torn down (tests, hot reload). */
    dispose: () => void;
    /** In the browser: the persisted client. On the server: a fresh client for each request, never persisted. */
    Provider: (props: {
        children: ReactNode;
    }) => ReactNode;
};
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
export declare function createOfflineRuntime(config: OfflineRuntimeConfig): OfflineRuntime;
//# sourceMappingURL=createOfflineRuntime.d.ts.map