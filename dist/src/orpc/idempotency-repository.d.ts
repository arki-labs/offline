import type { AnyRelations } from 'drizzle-orm';
import type { PgAsyncDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import type { IdempotencyStoreFailure } from './idempotency-failures.js';
import type { IdempotencyKeysTable } from './idempotency-table.js';
/** Any async Postgres drizzle database: node-postgres in production, PGlite in tests and local runs. */
export type IdempotencyDatabase = PgAsyncDatabase<PgQueryResultHKT, AnyRelations>;
export declare class IdempotencyRepository {
    private readonly db;
    private readonly table;
    constructor(db: IdempotencyDatabase, table: IdempotencyKeysTable);
    find(key: string, path: string, userId: string): Promise<unknown>;
    /** Cache a completed response; a failure never authorizes re-running its handler. */
    store(key: string, path: string, userId: string, response: unknown): Promise<void | IdempotencyStoreFailure>;
}
//# sourceMappingURL=idempotency-repository.d.ts.map