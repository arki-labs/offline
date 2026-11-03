import { defineId } from '@arki/contracts';
const format = { alphabet: '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length: 21 };
/** Browser queue identity; the existing unprefixed Nano ID representation is unchanged. */
export const queuedMutationId = defineId('', { kind: 'offline.queued-mutation', format });
/** Transport deduplication identity, distinct from queue and server cache-record identities. */
export const mutationIdempotencyKey = defineId('', { kind: 'offline.mutation-idempotency-key', format });
//# sourceMappingURL=identity.js.map