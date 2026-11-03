import type { Meta } from '@orpc/contract';
import type { Middleware, ORPCErrorConstructorMap } from '@orpc/server';
import type { IdempotencyRepository } from './idempotency-repository.js';
/** What the middleware reads from the request context. */
export type IdempotentContext = {
    readonly headers: Headers;
    readonly session: {
        readonly user: {
            readonly id: string;
        };
    } | null | undefined;
};
/** The two calls the middleware makes. `IdempotencyRepository` is the Postgres one, `SqliteIdempotencyRepository` the SQLite one. */
export type IdempotencyStore = Pick<IdempotencyRepository, 'find' | 'store'>;
/**
 * oRPC middleware that deduplicates replayed offline mutations. Install it
 * ONCE where the app builds its implementer:
 *
 *   implement(rpcContract).$context<RequestContext>().use(idempotency(repo))
 *
 * It acts only on procedures whose contract meta says `offlineSafe: true`
 * (see `offlineSafe(p)`); every other procedure passes straight through.
 * For a marked one:
 *
 * 1. Reads `Idempotency-Key` from the request headers; no key → runs the
 *    handler as usual (not a queued replay).
 * 2. A queued replay carries `Offline-Actor`: the user who queued the write.
 *    It must equal the session user (both absent counts as equal). Otherwise
 *    → 403 FORBIDDEN, which the client queue dead-letters. This catches what
 *    the browser cannot: a session cookie that changed between the queue's
 *    own actor check and the request leaving the browser. A missing header
 *    with a signed-in session is refused too.
 * 3. No signed-in user → runs the handler (the cache is scoped to a user).
 * 4. A stored response for (key, path, userId) within the 7-day TTL → returns
 *    it without calling the handler.
 * 5. Otherwise runs the handler and stores its output.
 *
 * Best-effort under concurrency: two replays of one key that arrive together
 * can both run the handler (lookup, run and store are separate steps).
 */
export declare function idempotency(repo: IdempotencyStore): Middleware<IdempotentContext, Record<never, never>, unknown, unknown, ORPCErrorConstructorMap<Record<never, never>>, Meta>;
//# sourceMappingURL=idempotency.d.ts.map