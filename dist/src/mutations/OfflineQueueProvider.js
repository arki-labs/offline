import { jsx as _jsx } from "react/jsx-runtime";
/**
 * React context provider for OfflineMutationQueue.
 *
 * Wrap your app (or the relevant subtree) with this provider so that
 * useOfflineMutation and useQueueStatus can access the queue instance.
 *
 * @example
 * ```tsx
 * const queue = createOfflineMutationQueue({ rpc: myRpcClient, actorId: () => signedInUserId });
 *
 * function App() {
 *   return (
 *     <OfflineQueueProvider queue={queue}>
 *       <YourApp />
 *     </OfflineQueueProvider>
 *   );
 * }
 * ```
 */
import { createContext, useContext } from 'react';
const OfflineQueueContext = createContext(null);
export function OfflineQueueProvider({ queue, children, }) {
    return (_jsx(OfflineQueueContext.Provider, { value: { queue }, children: children }));
}
// ---------------------------------------------------------------------------
// Context hook
// ---------------------------------------------------------------------------
export function useOfflineQueue() {
    const ctx = useContext(OfflineQueueContext);
    if (!ctx) {
        throw new Error('useOfflineQueue must be used within an <OfflineQueueProvider>. ' +
            'Wrap your app with <OfflineQueueProvider queue={queue}> to fix this.');
    }
    return ctx;
}
/**
 * Like `useOfflineQueue` but returns `null` when no provider is present.
 * Use this in components that are queue-optional (e.g. `OfflineBanner`).
 */
export function useOfflineQueueOptional() {
    return useContext(OfflineQueueContext);
}
//# sourceMappingURL=OfflineQueueProvider.js.map