import { z } from '@arki/contracts';
import type { QueuedMutation } from './model.js';
import type { QueuedMutationId } from './identity.js';
import type { QueueStorageFailure } from './failures.js';
declare const deadLetterEntrySchema: z.ZodObject<{
    mutation: z.ZodObject<{
        id: z.core.$ZodBranded<z.ZodTemplateLiteral<string>, "offline.queued-mutation", "out">;
        idempotencyKey: z.core.$ZodBranded<z.ZodTemplateLiteral<string>, "offline.mutation-idempotency-key", "out">;
        procedurePath: z.ZodReadonly<z.ZodArray<z.ZodString>>;
        input: z.ZodUnknown;
        actorId: z.ZodNullable<z.ZodString>;
        enqueuedAt: z.ZodNumber;
        attempts: z.ZodNumber;
        lastError: z.ZodOptional<z.ZodObject<{
            code: z.ZodEnum<{
                ACTOR_MISMATCH: "ACTOR_MISMATCH";
                MAX_RETRIES: "MAX_RETRIES";
                RETRY: "RETRY";
            }>;
            message: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    error: z.ZodObject<{
        message: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>;
    deadLetteredAt: z.ZodNumber;
}, z.core.$strip>;
export type DeadLetterEntry = z.output<typeof deadLetterEntrySchema>;
export type DeadLetterStore = {
    list(): Promise<readonly QueuedMutation[] | QueueStorageFailure>;
    add(entry: QueuedMutation, error: Error): Promise<void | QueueStorageFailure>;
    remove(id: QueuedMutationId): Promise<void | QueueStorageFailure>;
    subscribe(listener: () => void): () => void;
};
export declare function createDeadLetterStore(storageKey: string): DeadLetterStore;
export {};
//# sourceMappingURL=dead-letter.d.ts.map