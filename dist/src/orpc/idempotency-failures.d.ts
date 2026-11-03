import type { FailureOf } from '@arki/failure';
/**
 * The database did not confirm that the response was cached. It may have been saved.
 * @fix Reconcile the cache before retrying its write; never repeat the completed handler.
 * @verify bun run test -- __tests__/orpc/idempotency.pglite.test.ts
 */
export declare const IdempotencyStoreUnconfirmed: import("@arki/failure").FailureDefinition<"offline.idempotency_store_unconfirmed", undefined>;
/** Exact failures returned by response-cache writes, including generation defects. */
export declare const IDEMPOTENCY_STORE_FAILURES: readonly [import("@arki/failure").FailureDefinition<"offline.idempotency_store_unconfirmed", undefined>, import("@arki/failure").FailureDefinition<"contracts.random_source_unavailable", undefined>, import("@arki/failure").FailureDefinition<"failure.unexpected_defect", undefined>];
/** Derived once from the canonical definitions. */
export type IdempotencyStoreFailure = FailureOf<(typeof IDEMPOTENCY_STORE_FAILURES)[number]>;
//# sourceMappingURL=idempotency-failures.d.ts.map