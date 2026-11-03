import type { IdOf } from '@arki/contracts';
/** Stored cache-record identity; distinct from the client's idempotency token. */
export declare const idempotencyKeyId: import("@arki/contracts").BrandedIdDeclaration<"idk_", "offline.idempotency-record">;
/** Inferred from the canonical record schema; stored prefixes remain compatible. */
export type IdempotencyKeyId = IdOf<typeof idempotencyKeyId>;
//# sourceMappingURL=idempotency-id.d.ts.map