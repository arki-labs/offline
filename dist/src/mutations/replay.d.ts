import type { Backoff } from '@arki/resilience';
import type { DeadLetterStore } from './dead-letter.js';
import type { DrainFailure } from './failures.js';
import type { AnyRpcClient, QueuedMutation, QueueEvent } from './queue.js';
import type { QueueStorage } from './storage.js';
export type ReplayLoopOptions = {
    storage: QueueStorage;
    dlStore: DeadLetterStore;
    rpc: AnyRpcClient;
    /** Who is signed in now (`null`: nobody; `undefined`: not known yet). Read right before every send attempt. */
    actorId: () => string | null | undefined;
    /**
     * When to retry a send that failed for a transient reason (5xx, network), and when to give up and
     * dead-letter the entry. `retry.delay(n, ...)` is the wait before retry `n`; `undefined` ends the retries.
     */
    retry: Backoff;
    onDeadLetter?: (entry: QueuedMutation, error: Error) => void;
    onStateChange: (sending: boolean) => void;
    emit: (event: QueueEvent) => void;
};
export type ReplayLoop = {
    start(): void;
    stop(): void;
    drainNow(): Promise<void | DrainFailure>;
};
export declare function createReplayLoop(options: ReplayLoopOptions): ReplayLoop;
//# sourceMappingURL=replay.d.ts.map