import type { IdempotencyKeyId } from './idempotency-id.js';
import type { IdempotencyStoreFailure } from './idempotency-failures.js';
/** One cache row, ready to insert. */
export type IdempotencyRow = {
    readonly id: IdempotencyKeyId;
    readonly idempotencyKey: string;
    readonly procedurePath: string;
    readonly userId: string;
    readonly responseJson: unknown;
    readonly expiresAt: Date;
};
/**
 * Cache a completed response through the dialect's own `insert` (an insert that ignores a duplicate key).
 * A failure never authorizes re-running its handler.
 */
export declare function storeIdempotentResponse(key: string, path: string, userId: string, response: unknown, insert: (row: IdempotencyRow) => PromiseLike<unknown>): Promise<void | IdempotencyStoreFailure>;
//# sourceMappingURL=idempotency-store.d.ts.map