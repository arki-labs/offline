import { ContractProcedure } from '@orpc/contract';
/**
 * Mark a contract procedure safe to queue offline. This is the only way to
 * get `offlineSafe: true` into the meta TYPE: `.meta({ offlineSafe: true })`
 * keeps the meta type the builder declared, so the compiler could never see it.
 *
 * Policy is written once, here on the contract:
 * - the server's `idempotency(repo)` middleware dedupes replays of this procedure;
 * - `useOfflineMutation` and `queue.enqueue` compile only for marked procedures.
 *
 * The mark is a declaration: the handler must still be safe to run again
 * when a replay misses the idempotency cache.
 *
 * @example
 * ```ts
 * export const posts = { create: offlineSafe(oc.input(createPost).output(post)) };
 * ```
 */
export function offlineSafe(procedure) {
    const def = procedure['~orpc'];
    return new ContractProcedure({ ...def, meta: { ...def.meta, offlineSafe: true } });
}
//# sourceMappingURL=offline-safe-marker.js.map