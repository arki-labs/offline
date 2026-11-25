import type { QueuedMutation } from './model.js';
import type { QueueStorageFailure } from './failures.js';
export type QueueStorage = {
    read(): Promise<QueuedMutation[] | QueueStorageFailure>;
    write(entries: QueuedMutation[]): Promise<void | QueueStorageFailure>;
    clear(): Promise<void | QueueStorageFailure>;
};
export declare function createQueueStorage(storageKey: string): QueueStorage;
export type LastActorStore = {
    read(): Promise<string | null | QueueStorageFailure>;
    remember(actorId: string): Promise<void | QueueStorageFailure>;
    forget(): Promise<void | QueueStorageFailure>;
};
export declare function createLastActorStore(storageKey: string): LastActorStore;
//# sourceMappingURL=storage.d.ts.map