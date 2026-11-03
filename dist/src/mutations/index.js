/**
 * @arki/offline/mutations
 *
 * IDB-backed offline mutation queue with FIFO replay, strict idempotency,
 * dead-letter handling, and React hooks.
 */
export { createOfflineMutationQueue } from './queue.js';
export { createQueueStorage } from './storage.js';
export { createDeadLetterStore } from './dead-letter.js';
export { createReplayLoop } from './replay.js';
export { OfflineQueueProvider, useOfflineQueue } from './OfflineQueueProvider.js';
export { useQueueStatus, useOfflineMutation } from './hooks.js';
export { queuedMutationId, mutationIdempotencyKey } from './identity.js';
export { ENQUEUE_FAILURES, DRAIN_FAILURES, QUEUE_STORAGE_FAILURES, OFFLINE_QUEUE_FAILURES, QueueStorageUnavailable, QueueAcceptanceUnconfirmed, QueueStorageCorrupt, QueuePersistenceUnconfirmed, QueueEncodingFailure, QueueEffectUnconfirmed, QueueTransportUnavailable } from './failures.js';
//# sourceMappingURL=index.js.map