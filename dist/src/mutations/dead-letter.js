import { isFailure } from '@arki/failure';
import { deadLetterEntrySchema } from './model-schemas.js';
import { readOfflineState, writeOfflineState } from './state.js';
import { observeQueue } from './telemetry.js';
export function createDeadLetterStore(storageKey) {
    const listeners = new Set();
    const readAll = () => readOfflineState(storageKey, deadLetterEntrySchema.array(), []);
    const reporting = new Set();
    function notify() {
        for (const listener of listeners) {
            if (reporting.has(listener))
                continue;
            reporting.add(listener);
            try {
                // Only this observer is guarded while its asynchronous report is pending.
                void Promise.resolve(listener()).catch(() => { }).finally(() => { reporting.delete(listener); });
            }
            catch {
                reporting.delete(listener);
            }
        }
    }
    return {
        list: () => observeQueue('offline.dead_letter.list', async () => {
            const entries = await readAll();
            if (isFailure(entries))
                return entries;
            return entries.map(entry => entry.mutation);
        }),
        add: (mutation, error) => observeQueue('offline.dead_letter.add', async () => {
            const entries = await readAll();
            if (isFailure(entries))
                return entries;
            const entry = {
                mutation, error: { message: error.message, name: error.name }, deadLetteredAt: Date.now(),
            };
            const result = await writeOfflineState(storageKey, [...entries.filter(existing => existing.mutation.id !== mutation.id), entry], deadLetterEntrySchema.array());
            if (isFailure(result))
                return result;
            notify();
            return;
        }),
        remove: id => observeQueue('offline.dead_letter.remove', async () => {
            const entries = await readAll();
            if (isFailure(entries))
                return entries;
            const result = await writeOfflineState(storageKey, entries.filter(entry => entry.mutation.id !== id), deadLetterEntrySchema.array());
            if (isFailure(result))
                return result;
            notify();
            return;
        }),
        subscribe(listener) {
            listeners.add(listener);
            return () => { listeners.delete(listener); };
        },
    };
}
//# sourceMappingURL=dead-letter.js.map