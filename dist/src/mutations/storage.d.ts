import type { z } from '@arki/contracts';
import type { QueuedMutation } from './model.js';
import type { QueueStorageFailure } from './failures.js';
export type QueueStorage = {
    read(): Promise<QueuedMutation[] | QueueStorageFailure>;
    write(entries: QueuedMutation[]): Promise<void | QueueStorageFailure>;
    clear(): Promise<void | QueueStorageFailure>;
};
/** Persistence decode boundary shared by the queue and dead-letter store. */
export declare function readOfflineState<Schema extends z.ZodType>(storageKey: string, schema: Schema, empty: z.output<Schema>): Promise<z.output<Schema> | QueueStorageFailure>;
export declare function writeOfflineState(storageKey: string, value: unknown, schema: z.ZodType): Promise<void | QueueStorageFailure>;
export declare function createQueueStorage(storageKey: string): QueueStorage;
export type LastActorStore = {
    read(): Promise<string | null | QueueStorageFailure>;
    remember(actorId: string): Promise<void | QueueStorageFailure>;
    forget(): Promise<void | QueueStorageFailure>;
};
export declare function createLastActorStore(storageKey: string): LastActorStore;
//# sourceMappingURL=storage.d.ts.map