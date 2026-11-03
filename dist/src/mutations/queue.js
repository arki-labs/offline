/**
 * OfflineMutationQueue — the central write-path primitive.
 *
 * Persists queued mutations to IDB and replays them on reconnect.
 * The queue itself is network-agnostic; the replay loop (replay.ts)
 * drives network I/O and event listener wiring.
 */
import { observeEnqueue, observeQueue } from './telemetry.js';
import { isFailure, UnexpectedDefect } from '@arki/failure';
import { mutationIdempotencyKey, queuedMutationId } from './identity.js';
import { QueueAcceptanceUnconfirmed, QueuePersistenceUnconfirmed } from './failures.js';
import { operationOf } from '@arki/contracts/orpc';
import { getLogger } from '@arki/log';
import { backoff } from '@arki/resilience';
import { createLastActorStore, createQueueStorage } from './storage.js';
import { createDeadLetterStore } from './dead-letter.js';
import { createReplayLoop } from './replay.js';
const log = getLogger('arki:offline:mutations');
function reportListenerError() {
    // Observer defects cannot replace the operation's reconciliation identity.
    try {
        void Promise.resolve(log.debug('Queue subscriber failed: {code}', { code: UnexpectedDefect.code })).catch(() => {
            // Even an asynchronous logger defect stays outside the operation outcome.
        });
    }
    catch { /* Reporting cannot revoke acceptance. */ }
}
// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
const DEFAULT_RETRY = backoff.exponential({ base: 1000, max: 30_000 }).upTo(5);
export function createOfflineMutationQueue(options) {
    const { storageKey = 'arki-offline-mutations', deadLetterStorageKey = 'arki-offline-mutations-dead', rpc, actorId, retry = DEFAULT_RETRY, onDeadLetter, } = options;
    const storage = createQueueStorage(storageKey);
    const lastActor = createLastActorStore(`${storageKey}:last-actor`);
    /** Who is signed in now. An id is remembered as this device's last actor; a sign-out forgets it. */
    function signedInActor() {
        const id = actorId();
        if (typeof id === 'string')
            void lastActor.remember(id).then(reportOutcome);
        else if (id === null)
            void lastActor.forget().then(reportOutcome);
        return id;
    }
    const dlStore = createDeadLetterStore(deadLetterStorageKey);
    const listeners = new Set();
    const state = { sending: false, queuedCount: 0, deadLetteredCount: 0, failure: null };
    // IDB access is browser-only. The factory may be evaluated during SSR
    // (e.g. when an app constructs the runtime at module top level) — in that
    // case the resulting queue is a transient stub that no caller ever uses
    // before the request ends, so skipping the bootstrap reads is safe.
    const isBrowser = typeof window !== 'undefined';
    function reportOutcome(result) {
        if (isFailure(result))
            emit({ type: 'failure', failure: result });
    }
    function reportStorageFailure(error) {
        emit({ type: 'failure', failure: UnexpectedDefect({ cause: error }) });
    }
    // Sync counts on startup (fire-and-forget; acceptable startup race)
    if (isBrowser) {
        void storage.read().then((items) => {
            if (isFailure(items))
                emit({ type: 'failure', failure: items });
            else
                state.queuedCount = items.length;
        }).catch(error => reportStorageFailure(error));
        void dlStore.list().then((items) => {
            if (isFailure(items))
                emit({ type: 'failure', failure: items });
            else
                state.deadLetteredCount = items.length;
        }).catch(error => reportStorageFailure(error));
    }
    // Keep dead-letter count in sync whenever the dead-letter store changes.
    // The subscribe callback only fires after `dlStore.add` succeeded, so by
    // definition IDB was reachable — no `isBrowser` guard needed here.
    const unsubscribeDL = dlStore.subscribe(() => {
        void dlStore.list().then((items) => {
            if (isFailure(items))
                emit({ type: 'failure', failure: items });
            else
                state.deadLetteredCount = items.length;
        }).catch(error => reportStorageFailure(error));
    });
    function emit(event) {
        if (event.type === 'failure')
            state.failure = event.failure;
        // Update queued count based on observable events
        if (event.type === 'enqueued')
            state.queuedCount++;
        if (event.type === 'sent')
            state.queuedCount = Math.max(0, state.queuedCount - 1);
        if (event.type === 'dead-letter')
            state.queuedCount = Math.max(0, state.queuedCount - 1);
        for (const listener of listeners) {
            try {
                void Promise.resolve(listener(event)).catch(reportListenerError);
            }
            catch {
                reportListenerError();
            }
        }
    }
    // -------------------------------------------------------------------------
    // Replay loop (wires navigator.onLine events)
    // -------------------------------------------------------------------------
    const loop = createReplayLoop({
        storage,
        dlStore,
        rpc,
        actorId: signedInActor,
        retry,
        onDeadLetter,
        onStateChange: (sending) => {
            state.sending = sending;
        },
        emit,
    });
    loop.start();
    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    async function enqueue(carrier, input) {
        // Checked at run time too: plain JavaScript callers and forged objects get no compiler.
        const op = operationOf(carrier);
        const marked = op.meta.offlineSafe;
        if (marked !== true) {
            throw new TypeError(`${op.name} is not marked offlineSafe on its contract, so it cannot be queued offline.`);
        }
        const id = queuedMutationId.create();
        if (isFailure(id))
            return id;
        const idempotencyKey = mutationIdempotencyKey.schema.parse(id);
        const now = signedInActor();
        const bound = now === undefined ? await lastActor.read() : now;
        if (isFailure(bound))
            return bound;
        const current = await storage.read();
        if (isFailure(current))
            return current;
        const entry = {
            id, idempotencyKey, procedurePath: op.path, input, actorId: bound,
            enqueuedAt: Date.now(), attempts: 0,
        };
        const persisted = await storage.write([...current, entry]);
        if (isFailure(persisted)) {
            if (!QueuePersistenceUnconfirmed.is(persisted))
                return persisted;
            // IDB can report failure after committing. Preserve the reconciliation identity.
            return QueueAcceptanceUnconfirmed({ id, idempotencyKey }, { cause: persisted });
        }
        emit({ type: 'enqueued', entry });
        let status = 'queued';
        const observeOutcome = (event) => {
            if ((event.type === 'sent' || event.type === 'dead-letter') && event.entry.id === id)
                status = event.type;
        };
        listeners.add(observeOutcome);
        if (typeof navigator !== 'undefined' && navigator.onLine) {
            try {
                const drained = await loop.drainNow();
                if (isFailure(drained))
                    return QueueAcceptanceUnconfirmed({ id, idempotencyKey }, { cause: drained });
            }
            catch (error) {
                return QueueAcceptanceUnconfirmed({ id, idempotencyKey }, { cause: error });
            }
            finally {
                listeners.delete(observeOutcome);
            }
        }
        else {
            listeners.delete(observeOutcome);
        }
        return { idempotencyKey, status };
    }
    function status() {
        // Returns an in-memory snapshot. Bootstrapped from IDB on startup,
        // then kept live via event tracking in emit().
        // The hooks use subscribe() + useSyncExternalStore for reactive updates.
        return {
            queued: state.queuedCount,
            sending: state.sending,
            deadLettered: state.deadLetteredCount,
            failure: state.failure,
        };
    }
    async function drain() {
        const result = await loop.drainNow();
        if (isFailure(result))
            reportOutcome(result);
        else {
            state.failure = null;
            emit({ type: 'drained' });
        }
        return result;
    }
    const deadLetterApi = {
        list() {
            return dlStore.list();
        },
        async retry(id) {
            const items = await dlStore.list();
            if (isFailure(items))
                return items;
            const mutation = items.find((m) => m.id === id);
            if (!mutation)
                return;
            // Reset attempts, re-enqueue, remove from dead-letter. The entry keeps
            // its actorId: a retry never rebinds a write to whoever is signed in now.
            const reset = { ...mutation, attempts: 0, lastError: undefined };
            const current = await storage.read();
            if (isFailure(current))
                return current;
            const queued = await storage.write([...current.filter(entry => entry.id !== id), reset]);
            if (isFailure(queued))
                return queued;
            const removed = await dlStore.remove(id);
            if (isFailure(removed))
                return removed;
            emit({ type: 'enqueued', entry: reset });
            if (typeof navigator !== 'undefined' && navigator.onLine) {
                return drain();
            }
        },
        async discard(id) {
            return dlStore.remove(id);
        },
    };
    function subscribe(listener) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }
    function dispose() {
        loop.stop();
        unsubscribeDL();
        listeners.clear();
    }
    return {
        async enqueue(carrier, input) {
            // Contract misuse remains a static definition error, before owned execution.
            const op = operationOf(carrier);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- JavaScript callers can omit the static offline-safe declaration.
            if (op.meta.offlineSafe !== true)
                throw new TypeError(`${op.name} is not marked offlineSafe on its contract, so it cannot be queued offline.`);
            return observeEnqueue(async () => {
                try {
                    return await enqueue(carrier, input);
                }
                catch (error) {
                    return UnexpectedDefect({ cause: error });
                }
            });
        },
        status,
        drain,
        deadLetter: {
            list: () => deadLetterApi.list(),
            retry: id => observeQueue('offline.queue.retry', () => deadLetterApi.retry(id)),
            discard: id => observeQueue('offline.queue.discard', () => deadLetterApi.discard(id)),
        },
        subscribe,
        dispose,
    };
}
//# sourceMappingURL=queue.js.map