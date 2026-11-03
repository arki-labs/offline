import type { ReactNode } from 'react';
import type { OfflineMutationQueue } from './queue.js';
type OfflineQueueContextValue = {
    queue: OfflineMutationQueue;
};
export type OfflineQueueProviderProps = {
    queue: OfflineMutationQueue;
    children: ReactNode;
};
export declare function OfflineQueueProvider({ queue, children, }: OfflineQueueProviderProps): React.JSX.Element;
export declare function useOfflineQueue(): OfflineQueueContextValue;
/**
 * Like `useOfflineQueue` but returns `null` when no provider is present.
 * Use this in components that are queue-optional (e.g. `OfflineBanner`).
 */
export declare function useOfflineQueueOptional(): OfflineQueueContextValue | null;
export {};
//# sourceMappingURL=OfflineQueueProvider.d.ts.map