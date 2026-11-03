/** The idempotency table in Postgres's default schema. For another schema, call `createIdempotencyTable(pgColumns(schema))`. */
export declare const idempotencyKeys: import("@arki/db/pg").PgTableOf<"offline_idempotency_keys", {
    id: import("@arki/db/columns").ColumnSpec<"pg", "varchar", Omit<import("@arki/db/columns").NoFlags & {
        notNull: true;
    } & {
        primaryKey: true;
    }, "type"> & {
        type: `idk_${string}` & import("zod").$brand<"offline.idempotency-record">;
    }>;
    idempotencyKey: import("@arki/db/columns").ColumnSpec<"pg", "varchar", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    procedurePath: import("@arki/db/columns").ColumnSpec<"pg", "varchar", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    userId: import("@arki/db/columns").ColumnSpec<"pg", "text", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    responseJson: import("@arki/db/columns").ColumnSpec<"pg", "json", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
    createdAt: import("@arki/db/columns").ColumnSpec<"pg", "timestamp", import("@arki/db/columns").NoFlags & {
        notNull: true;
    } & {
        default: true;
    }>;
    expiresAt: import("@arki/db/columns").ColumnSpec<"pg", "timestamp", import("@arki/db/columns").NoFlags & {
        notNull: true;
    }>;
}>;
//# sourceMappingURL=idempotency-keys.d.ts.map