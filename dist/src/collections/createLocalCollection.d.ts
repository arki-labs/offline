import type { Collection } from '@tanstack/db';
import type { StandardSchemaV1 } from '@arki/schema';
import type { InferSchemaOutput } from '@tanstack/db';
export type LocalCollectionConfig<TSchema extends StandardSchemaV1, TKey extends string | number = string> = {
    storageKey: string;
    schema: TSchema;
    getKey: (item: InferSchemaOutput<TSchema>) => TKey;
    syncBetweenTabs?: boolean;
};
/**
 * Creates a localStorage-backed TanStack DB collection with mandatory schema validation.
 *
 * The schema requirement prevents shape drift: items that don't conform are caught
 * at the storage layer rather than corrupting serialized data silently.
 *
 * Cross-tab synchronization is enabled by default via browser `storage` events.
 * Set `syncBetweenTabs: false` to scope the collection to the current tab only.
 *
 * Storage key namespacing is the caller's responsibility — prefix keys with the
 * app name to prevent collisions when multiple apps share a subdomain (e.g.
 * `'myapp:games'` rather than just `'games'`).
 */
export declare function createLocalCollection<TSchema extends StandardSchemaV1, TKey extends string | number = string>(config: LocalCollectionConfig<TSchema, TKey>): Collection<InferSchemaOutput<TSchema>, TKey>;
//# sourceMappingURL=createLocalCollection.d.ts.map