import type { QueuedMutationId } from './identity.js';
import type { QueuedMutation, EnqueueReceipt } from './model.js';
import type { EnqueueFailure, DrainFailure, QueueStorageFailure, OfflineQueueFailure } from './failures.js';
import type { Identified, InputOf, Operation } from '@arki/contracts/orpc';
import type { Backoff } from '@arki/resilience';
import type { OfflineSafeMeta } from '../orpc/offline-safe-marker.js';
export type { QueuedMutation, QueueErrorCode, EnqueueReceipt } from './model.js';
export type QueueEvent = {
    type: 'enqueued';
    entry: QueuedMutation;
} | {
    type: 'sent';
    entry: QueuedMutation;
} | {
    type: 'dead-letter';
    entry: QueuedMutation;
    error: Error;
} | {
    type: 'failure';
    failure: OfflineQueueFailure;
} | {
    type: 'drained';
} | {
    type: 'auth-required';
} | {
    type: 'online';
} | {
    type: 'offline';
};
/**
 * Structural RPC client interface. Apps adapt their oRPC client to this shape.
 * @arki/offline never imports oRPC directly.
 */
export type AnyRpcClient = {
    call(procedurePath: readonly string[], input: unknown, headers?: Record<string, string>): Promise<unknown>;
};
export type OfflineMutationQueueOptions = {
    storageKey?: string;
    deadLetterStorageKey?: string;
    rpc: AnyRpcClient;
    /**
     * Who is signed in right now: their id, `null` when the session says nobody
     * is (signed out), or `undefined` while the session is not known yet (an
     * offline reload). Read at enqueue (the entry is bound to it) and right
     * before every send attempt. An id is remembered on the device as its last
     * actor; `null` forgets it; only `undefined` falls back to it. It must
     * answer synchronously from local state: it runs offline.
     */
    actorId: () => string | null | undefined;
    /**
     * When to retry a send that failed for a transient reason (5xx, network), and after how many retries the
     * entry goes to the dead-letter store. Default: exponential from 1 s up to 30 s, at most 5 retries.
     */
    retry?: Backoff;
    onDeadLetter?: (entry: QueuedMutation, error: Error) => void;
};
/** An operation whose contract meta says `offlineSafe: true` (see `offlineSafe(p)` in `@arki/offline/orpc`). */
export type OfflineSafeOperation = Operation<unknown, unknown, unknown, OfflineSafeMeta>;
export type OfflineMutationQueue = {
    /**
     * Queue a call to an offline-safe procedure. `carrier` is its utils leaf
     * (`orpc.posts.create` from `createOrpcUtils`): it carries the procedure's
     * path, and the compiler accepts it only when the contract marked it
     * `offlineSafe`. The input is serialisable; the replay loop sends it back
     * through `rpc.call(path, input, headers)`.
     */
    enqueue<Op extends OfflineSafeOperation>(carrier: Identified<Op>, input: InputOf<Op>): Promise<EnqueueReceipt | EnqueueFailure>;
    status(): QueueSnapshot;
    drain(): Promise<void | DrainFailure>;
    deadLetter: {
        list(): Promise<readonly QueuedMutation[] | QueueStorageFailure>;
        retry(id: QueuedMutationId): Promise<void | DrainFailure>;
        discard(id: QueuedMutationId): Promise<void | QueueStorageFailure>;
    };
    subscribe(listener: (event: QueueEvent) => void): () => void;
    dispose(): void;
};
export type QueueSnapshot = {
    queued: number;
    sending: boolean;
    deadLettered: number;
    failure: OfflineQueueFailure | null;
};
export declare function createOfflineMutationQueue(options: OfflineMutationQueueOptions): OfflineMutationQueue;
//# sourceMappingURL=queue.d.ts.map