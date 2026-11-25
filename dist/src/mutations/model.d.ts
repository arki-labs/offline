import type { MutationIdempotencyKey, QueuedMutationId } from './identity.js';
/** Why a queued mutation last failed. */
export type QueueErrorCode = 'RETRY' | 'MAX_RETRIES' | 'ACTOR_MISMATCH';
/** One mutation waiting in the queue, as it is stored. */
export type QueuedMutation = {
    id: QueuedMutationId;
    idempotencyKey: MutationIdempotencyKey;
    procedurePath: readonly string[];
    input: unknown;
    actorId: string | null;
    enqueuedAt: number;
    attempts: number;
    lastError?: {
        code: QueueErrorCode;
        message: string;
    } | undefined;
};
/** What `enqueue` answers: the mutation's idempotency key and where it went. */
export type EnqueueReceipt = {
    idempotencyKey: MutationIdempotencyKey;
    status: 'queued' | 'sent' | 'dead-letter';
};
//# sourceMappingURL=model.d.ts.map