import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db';
// A no-op event API to disable cross-tab storage events.
const NULL_STORAGE_EVENT_API = {
    addEventListener: () => {
        /* cross-tab storage events are off */
    },
    removeEventListener: () => {
        /* cross-tab storage events are off */
    },
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
export function createLocalCollection(config) {
    const { storageKey, schema, getKey, syncBetweenTabs = true } = config;
    return createCollection(localStorageCollectionOptions({
        storageKey,
        schema,
        getKey,
        storageEventApi: syncBetweenTabs ? undefined : NULL_STORAGE_EVENT_API,
    }));
}
//# sourceMappingURL=createLocalCollection.js.map