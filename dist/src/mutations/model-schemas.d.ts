/**
 * The schemas that check stored queue values. Internal: the storage and dead-letter store read and write with
 * them. The TS types (`model.ts`, `dead-letter.ts`) are the source; `__tests__/mutations/model.test-d.ts` locks
 * each schema to its type both ways.
 */
import { z } from '@arki/contracts';
/** A `QueuedMutation`. */
export declare const queuedMutationSchema: z.ZodObject<{
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
/** An `EnqueueReceipt`. */
export declare const enqueueReceiptSchema: z.ZodObject<{
    idempotencyKey: z.core.$ZodBranded<z.ZodTemplateLiteral<string>, "offline.mutation-idempotency-key", "out">;
    status: z.ZodEnum<{
        "dead-letter": "dead-letter";
        queued: "queued";
        sent: "sent";
    }>;
}, z.core.$strip>;
/** A `DeadLetterEntry`. */
export declare const deadLetterEntrySchema: z.ZodObject<{
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
//# sourceMappingURL=model-schemas.d.ts.map