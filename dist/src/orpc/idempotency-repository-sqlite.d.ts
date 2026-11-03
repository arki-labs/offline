import type { AnyRelations } from 'drizzle-orm';
import type { SQLiteAsyncDatabase } from 'drizzle-orm/sqlite-core';
import type { IdempotencyStoreFailure } from './idempotency-failures.js';
import type { SqliteIdempotencyKeysTable } from './idempotency-table.js';
/** Any async SQLite drizzle database (libSQL) or transaction — only what the repository uses. */
export type SqliteIdempotencyDatabase = Pick<SQLiteAsyncDatabase<'async', unknown, AnyRelations>, 'select' | 'insert'>;
/** The SQLite twin of `IdempotencyRepository`: same cache, same 7-day window, SQLite's own query builders. */
export declare class SqliteIdempotencyRepository {
    private readonly db;
    private readonly table;
    constructor(db: SqliteIdempotencyDatabase, table: SqliteIdempotencyKeysTable);
    find(key: string, path: string, userId: string): Promise<unknown>;
    /** Cache a completed response; a failure never authorizes re-running its handler. */
    store(key: string, path: string, userId: string, response: unknown): Promise<void | IdempotencyStoreFailure>;
}
//# sourceMappingURL=idempotency-repository-sqlite.d.ts.map