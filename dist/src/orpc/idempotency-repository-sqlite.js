import { and, eq, gt } from 'drizzle-orm';
import { storeIdempotentResponse } from './idempotency-store.js';
/** The SQLite twin of `IdempotencyRepository`: same cache, same 7-day window, SQLite's own query builders. */
export class SqliteIdempotencyRepository {
    db;
    table;
    constructor(db, table) {
        this.db = db;
        this.table = table;
    }
    async find(key, path, userId) {
        const rows = await this.db
            .select({ responseJson: this.table.responseJson })
            .from(this.table)
            .where(and(eq(this.table.idempotencyKey, key), eq(this.table.procedurePath, path), eq(this.table.userId, userId), gt(this.table.expiresAt, new Date())))
            .limit(1);
        return rows[0]?.responseJson ?? null;
    }
    /** Cache a completed response; a failure never authorizes re-running its handler. */
    store(key, path, userId, response) {
        return storeIdempotentResponse(key, path, userId, response, row => this.db.insert(this.table).values(row).onConflictDoNothing());
    }
}
//# sourceMappingURL=idempotency-repository-sqlite.js.map