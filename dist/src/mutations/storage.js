import { get, set, del } from 'idb-keyval';
import { queuedMutationSchema } from './model.js';
import { QueueStorageCorrupt, QueueStorageUnavailable, QueuePersistenceUnconfirmed, QueueEncodingFailure } from './failures.js';
import { observeQueue } from './telemetry.js';
import { offlineSerializer } from '../serializer.js';
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
export function createQueueStorage(storageKey) {
    return {
        read: () => readOfflineState(storageKey, queuedMutationSchema.array(), []),
        write: entries => writeOfflineState(storageKey, entries, queuedMutationSchema.array()),
        clear: () => observeQueue('offline.storage.clear', async () => {
            try {
                await del(storageKey);
            }
            catch (error) {
                return QueuePersistenceUnconfirmed({ cause: error });
            }
            return;
        }),
    };
}
export function createLastActorStore(storageKey) {
    let known;
    return {
        read: () => observeQueue('offline.actor.read', async () => {
            if (known !== undefined)
                return known;
            let raw;
            try {
                raw = await get(storageKey);
            }
            catch (error) {
                return QueueStorageUnavailable({ cause: error });
            }
            if (raw !== undefined && typeof raw !== 'string')
                return QueueStorageCorrupt();
            known ??= typeof raw === 'string' ? raw : null;
            return known;
        }),
        remember: actorId => observeQueue('offline.actor.remember', async () => {
            if (known === actorId)
                return;
            known = actorId;
            try {
                await set(storageKey, actorId);
            }
            catch (error) {
                return QueuePersistenceUnconfirmed({ cause: error });
            }
            return;
        }),
        forget: () => observeQueue('offline.actor.forget', async () => {
            if (known === null)
                return;
            known = null;
            try {
                await del(storageKey);
            }
            catch (error) {
                return QueuePersistenceUnconfirmed({ cause: error });
            }
            return;
        }),
    };
}
//# sourceMappingURL=storage.js.map