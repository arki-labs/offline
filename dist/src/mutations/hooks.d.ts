import type { Identified, InputOf } from '@arki/contracts/orpc';
import type { EnqueueFailure, OfflineQueueFailure } from './failures.js';
import type { EnqueueReceipt, OfflineMutationQueue } from './queue.js';
import type { OfflineSafeOperation } from './queue.js';
export type QueueStatus = ReturnType<OfflineMutationQueue['status']>;
/**
 * Subscribes to queue events and returns a live status snapshot.
 * Uses useSyncExternalStore for React 18+ concurrent-mode correctness.
 */
export declare function useQueueStatus(): QueueStatus;
export type UseOfflineMutationResult<TInput> = {
    readonly mutate: (input: TInput) => Promise<EnqueueReceipt | EnqueueFailure>;
    readonly isQueued: boolean;
    readonly isPending: boolean;
    readonly failure: OfflineQueueFailure | null;
};
/**
 * Queue calls to an offline-safe procedure. Pass its utils leaf from
 * `createOrpcUtils` — `useOfflineMutation(orpc.posts.create)`. It compiles
 * only when the contract marked the procedure `offlineSafe(p)`; the input
 * type comes from the contract. The replay loop sends each call with an
 * `Idempotency-Key`, which the server's `idempotency(repo)` middleware uses
 * to dedupe replays.
 */
export declare function useOfflineMutation<Op extends OfflineSafeOperation>(carrier: Identified<Op>): UseOfflineMutationResult<InputOf<Op>>;
//# sourceMappingURL=hooks.d.ts.map