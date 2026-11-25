import { get, set } from 'idb-keyval';
import { QueueStorageCorrupt, QueueStorageUnavailable, QueuePersistenceUnconfirmed, QueueEncodingFailure } from './failures.js';
import { observeQueue } from './telemetry.js';
import { offlineSerializer } from '../serializer.js';
// Internal: the storage and the dead-letter store read and write through these. They live apart from
// `storage.ts` so `./mutations` names no Zod type (`TYPES_E001`).
/** Persistence decode boundary shared by the queue and dead-letter store. */
export async function readOfflineState(storageKey, schema, empty) {
    return observeQueue('offline.storage.read', async () => {
        let raw;
        try {
            raw = await get(storageKey);
        }
        catch (error) {
            return QueueStorageUnavailable({ cause: error });
        }
        if (raw === undefined)
            return empty;
        try {
            if (typeof raw !== 'string')
                return QueueStorageCorrupt();
            const parsed = offlineSerializer.parse(raw);
            const result = schema.safeParse(parsed);
            return result.success ? result.data : QueueStorageCorrupt({ cause: result.error });
        }
        catch (error) {
            return QueueStorageCorrupt({ cause: error });
        }
    });
}
export async function writeOfflineState(storageKey, value, schema) {
    return observeQueue('offline.storage.write', async () => {
        const parsed = schema.safeParse(value);
        if (!parsed.success)
            return QueueEncodingFailure({ cause: parsed.error });
        let encoded;
        try {
            encoded = offlineSerializer.stringify(parsed.data);
        }
        catch (error) {
            return QueueEncodingFailure({ cause: error });
        }
        try {
            await set(storageKey, encoded);
        }
        catch (error) {
            return QueuePersistenceUnconfirmed({ cause: error });
        }
        return;
    });
}
//# sourceMappingURL=state.js.map