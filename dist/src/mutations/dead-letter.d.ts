import type { QueuedMutation } from './model.js';
import type { QueuedMutationId } from './identity.js';
import type { QueueStorageFailure } from './failures.js';
/** A dead-lettered mutation, why it failed, and when. `deadLetterEntrySchema` (`model-schemas.ts`) checks it. */
export type DeadLetterEntry = {
    mutation: QueuedMutation;
    error: {
        message: string;
        name: string;
    };
    deadLetteredAt: number;
};
export type DeadLetterStore = {
    list(): Promise<readonly QueuedMutation[] | QueueStorageFailure>;
    add(entry: QueuedMutation, error: Error): Promise<void | QueueStorageFailure>;
    remove(id: QueuedMutationId): Promise<void | QueueStorageFailure>;
    subscribe(listener: () => void): () => void;
};
export declare function createDeadLetterStore(storageKey: string): DeadLetterStore;
//# sourceMappingURL=dead-letter.d.ts.map