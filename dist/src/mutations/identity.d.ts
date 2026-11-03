import type { IdOf } from '@arki/contracts';
/** Browser queue identity; the existing unprefixed Nano ID representation is unchanged. */
export declare const queuedMutationId: import("@arki/contracts").BrandedIdDeclaration<"", "offline.queued-mutation">;
export type QueuedMutationId = IdOf<typeof queuedMutationId>;
/** Transport deduplication identity, distinct from queue and server cache-record identities. */
export declare const mutationIdempotencyKey: import("@arki/contracts").BrandedIdDeclaration<"", "offline.mutation-idempotency-key">;
export type MutationIdempotencyKey = IdOf<typeof mutationIdempotencyKey>;
//# sourceMappingURL=identity.d.ts.map