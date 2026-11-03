/**
 * React hooks for the OfflineMutationQueue.
 *
 * Both hooks read from OfflineQueueProvider context.
 * useQueueStatus uses useSyncExternalStore for React 18+ correctness.
 */
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { isFailure } from '@arki/failure';
import { useOfflineQueue } from './OfflineQueueProvider.js';
/**
 * Subscribes to queue events and returns a live status snapshot.
 * Uses useSyncExternalStore for React 18+ concurrent-mode correctness.
 */
export function useQueueStatus() {
    const { queue } = useOfflineQueue();
    const subscribe = useCallback((onStoreChange) => {
        return queue.subscribe((_event) => {
            onStoreChange();
        });
    }, [queue]);
    const getQueuedSnapshot = useCallback(() => queue.status().queued, [queue]);
    const getSendingSnapshot = useCallback(() => queue.status().sending, [queue]);
    const getDeadLetteredSnapshot = useCallback(() => queue.status().deadLettered, [queue]);
    const queued = useSyncExternalStore(subscribe, getQueuedSnapshot, getServerZero);
    const sending = useSyncExternalStore(subscribe, getSendingSnapshot, getServerFalse);
    const deadLettered = useSyncExternalStore(subscribe, getDeadLetteredSnapshot, getServerZero);
    const getFailure = useCallback(() => queue.status().failure, [queue]);
    const failure = useSyncExternalStore(subscribe, getFailure, getServerFailure);
    return useMemo(() => ({ queued, sending, deadLettered, failure }), [queued, sending, deadLettered, failure]);
}
const getServerFailure = () => null;
const getServerZero = () => 0;
const getServerFalse = () => false;
/**
 * Queue calls to an offline-safe procedure. Pass its utils leaf from
 * `createOrpcUtils` — `useOfflineMutation(orpc.posts.create)`. It compiles
 * only when the contract marked the procedure `offlineSafe(p)`; the input
 * type comes from the contract. The replay loop sends each call with an
 * `Idempotency-Key`, which the server's `idempotency(repo)` middleware uses
 * to dedupe replays.
 */
export function useOfflineMutation(carrier) {
    const { queue } = useOfflineQueue();
    const status = useQueueStatus();
    const [pending, setPending] = useState(0);
    const [failure, setFailure] = useState(null);
    const mutate = useCallback(async (input) => {
        setPending(count => count + 1);
        try {
            const result = await queue.enqueue(carrier, input);
            setFailure(isFailure(result) ? result : null);
            return result;
        }
        finally {
            setPending(count => count - 1);
        }
    }, [queue, carrier]);
    return {
        mutate,
        isQueued: status.queued > 0,
        isPending: pending > 0,
        failure: failure ?? status.failure,
    };
}
//# sourceMappingURL=hooks.js.map