import { z } from '@arki/contracts';
import type { FailureOf } from '@arki/failure';
/**
 * The existing offline queue could not be read.
 * @fix Restore access to local storage before attempting another enqueue.
 * @verify bun run test -- __tests__/mutations/queue.test.ts
 */
export declare const QueueStorageUnavailable: import("@arki/failure").FailureDefinition<"offline.queue_storage_unavailable", undefined>;
/**
 * The queued mutation outcome could not be confirmed.
 * @fix Reconcile this identity before retry; a write or remote effect may already exist.
 * @verify bun run test -- __tests__/mutations/queue.test.ts
 */
export declare const QueueAcceptanceUnconfirmed: import("@arki/failure").FailureDefinition<"offline.queue_acceptance_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>;
/** Stored offline data does not match its persistence contract.
 * @fix Preserve the original bytes and repair or explicitly discard invalid local data.
 * @verify bun run test -- __tests__/mutations/queue.test.ts __tests__/mutations/replay.test.ts __tests__/mutations/storage.test.ts
 */
export declare const QueueStorageCorrupt: import("@arki/failure").FailureDefinition<"offline.queue_storage_corrupt", undefined>;
/** A local offline-state write was not confirmed.
 * @fix Reconcile local state before retrying a write whose acknowledgement was lost.
 * @verify bun run test -- __tests__/mutations/queue.test.ts __tests__/mutations/replay.test.ts __tests__/mutations/storage.test.ts
 */
export declare const QueuePersistenceUnconfirmed: import("@arki/failure").FailureDefinition<"offline.queue_persistence_unconfirmed", undefined>;
/** Offline state could not be serialized.
 * @fix Submit a serializable mutation input before retrying.
 * @verify bun run test -- __tests__/mutations/queue.test.ts __tests__/mutations/replay.test.ts __tests__/mutations/storage.test.ts
 */
export declare const QueueEncodingFailure: import("@arki/failure").FailureDefinition<"offline.queue_encoding_failure", undefined>;
/** The server accepted the mutation, but local cleanup was not confirmed.
 * @fix Reconcile the accepted server effect using the original idempotency identity.
 * @verify bun run test -- __tests__/mutations/queue.test.ts __tests__/mutations/replay.test.ts __tests__/mutations/storage.test.ts
 */
export declare const QueueEffectUnconfirmed: import("@arki/failure").FailureDefinition<"offline.queue_effect_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>;
/** The RPC transport is temporarily unavailable.
 * @fix Restore connectivity; the queue owns retries using the original idempotency key.
 * @verify bun run test -- __tests__/mutations/queue.test.ts __tests__/mutations/replay.test.ts __tests__/mutations/storage.test.ts
 */
export declare const QueueTransportUnavailable: import("@arki/failure").FailureDefinition<"offline.queue_transport_unavailable", undefined>;
export declare const QUEUE_STORAGE_FAILURES: readonly [import("@arki/failure").FailureDefinition<"offline.queue_storage_unavailable", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_storage_corrupt", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_persistence_unconfirmed", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_encoding_failure", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>];
export type QueueStorageFailure = FailureOf<(typeof QUEUE_STORAGE_FAILURES)[number]>;
export declare const DRAIN_FAILURES: readonly [import("@arki/failure").FailureDefinition<"offline.queue_storage_unavailable", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_storage_corrupt", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_persistence_unconfirmed", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_encoding_failure", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_effect_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>];
export type DrainFailure = FailureOf<(typeof DRAIN_FAILURES)[number]>;
export declare const ENQUEUE_FAILURES: readonly [import("@arki/failure").FailureDefinition<"offline.queue_storage_unavailable", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_storage_corrupt", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_persistence_unconfirmed", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_encoding_failure", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_acceptance_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>, import("@arki/failure").FailureDefinition<"contracts.random_source_unavailable", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>];
export type EnqueueFailure = FailureOf<(typeof ENQUEUE_FAILURES)[number]>;
export declare const OFFLINE_QUEUE_FAILURES: readonly [import("@arki/failure").FailureDefinition<"offline.queue_storage_unavailable", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_storage_corrupt", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_persistence_unconfirmed", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_encoding_failure", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_acceptance_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>, import("@arki/failure").FailureDefinition<"contracts.random_source_unavailable", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>, import("@arki/failure").FailureDefinition<"offline.queue_effect_unconfirmed", import("@standard-schema/spec").StandardSchemaV1<{
    id: string;
    idempotencyKey: string;
}, {
    id: string & z.$brand<"offline.queued-mutation">;
    idempotencyKey: string & z.$brand<"offline.mutation-idempotency-key">;
}>>];
export type OfflineQueueFailure = FailureOf<(typeof OFFLINE_QUEUE_FAILURES)[number]>;
//# sourceMappingURL=failures.d.ts.map