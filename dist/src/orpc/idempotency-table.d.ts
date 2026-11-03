import type { ColumnKit, Dialect } from '@arki/db/columns';
export type { IdempotencyKeyId } from './idempotency-id.js';
/**
 * The idempotency table, written once for every dialect. Pass
 * `pgColumns(schema)` from `@arki/db/pg` or `sqliteColumns()` from
 * `@arki/db/sqlite`. This file imports no dialect runtime.
 */
export declare function createIdempotencyTable<D extends Dialect>(c: ColumnKit<D>): import("@arki/db/columns").TableOf<D, "offline_idempotency_keys", {
    id: import("@arki/db/columns").ColumnSpec<D, "varchar", Omit<import("@arki/db/columns").NoFlags & {
        notNull: true;
    } & {
        primaryKey: true;
    }, "type"> & {
        type: `idk_${string}` & import("zod").$brand<"offline.idempotency-record">;
    }>;
    idempotencyKey: import("@arki/db/columns").ColumnSpec<D, "varchar", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    procedurePath: import("@arki/db/columns").ColumnSpec<D, "varchar", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    userId: import("@arki/db/columns").ColumnSpec<D, "text", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    responseJson: import("@arki/db/columns").ColumnSpec<D, "json", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    createdAt: import("@arki/db/columns").ColumnSpec<D, "timestamp", import("@arki/db/columns").NoFlags & {
        notNull: true;
    } & {
        default: true;
    }>;
    expiresAt: import("@arki/db/columns").ColumnSpec<D, "timestamp", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
}>;
/** The Postgres idempotency table, in any schema. */
export type IdempotencyKeysTable = ReturnType<typeof createIdempotencyTable<'pg'>>;
/** The SQLite idempotency table. */
export type SqliteIdempotencyKeysTable = ReturnType<typeof createIdempotencyTable<'sqlite'>>;
//# sourceMappingURL=idempotency-table.d.ts.map