import { z } from '@arki/contracts';
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
export type QueuedMutation = z.output<typeof queuedMutationSchema>;
export type QueueErrorCode = NonNullable<QueuedMutation['lastError']>['code'];
export declare const enqueueReceiptSchema: z.ZodObject<{
    idempotencyKey: z.core.$ZodBranded<z.ZodTemplateLiteral<string>, "offline.mutation-idempotency-key", "out">;
    status: z.ZodEnum<{
        "dead-letter": "dead-letter";
        queued: "queued";
        sent: "sent";
    }>;
}, z.core.$strip>;
export type EnqueueReceipt = z.output<typeof enqueueReceiptSchema>;
//# sourceMappingURL=model.d.ts.map