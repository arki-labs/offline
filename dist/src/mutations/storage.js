import { get, set, del } from 'idb-keyval';
import { queuedMutationSchema } from './model-schemas.js';
import { QueuePersistenceUnconfirmed, QueueStorageCorrupt, QueueStorageUnavailable } from './failures.js';
import { readOfflineState, writeOfflineState } from './state.js';
import { observeQueue } from './telemetry.js';
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