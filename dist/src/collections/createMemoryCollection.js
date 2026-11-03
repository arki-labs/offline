import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db';
/**
 * Creates an in-memory TanStack DB collection backed by `localOnlyCollectionOptions`.
 *
 * Data survives re-renders but not page reloads. Useful for ephemeral UI state that
 * benefits from reactive live-query semantics without any persistence overhead.
 *
 * Schema is required — same reason as `createLocalCollection`.
 */
export function createMemoryCollection(config) {
    const { schema, getKey, initialData } = config;
    return createCollection(localOnlyCollectionOptions({
        schema,
        getKey,
        ...(initialData === undefined ? {} : { initialData }),
    }));
}
//# sourceMappingURL=createMemoryCollection.js.map