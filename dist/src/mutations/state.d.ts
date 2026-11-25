import type { z } from '@arki/contracts';
import type { QueueStorageFailure } from './failures.js';
/** Persistence decode boundary shared by the queue and dead-letter store. */
export declare function readOfflineState<Schema extends z.ZodType>(storageKey: string, schema: Schema, empty: z.output<Schema>): Promise<z.output<Schema> | QueueStorageFailure>;
export declare function writeOfflineState(storageKey: string, value: unknown, schema: z.ZodType): Promise<void | QueueStorageFailure>;
//# sourceMappingURL=state.d.ts.map