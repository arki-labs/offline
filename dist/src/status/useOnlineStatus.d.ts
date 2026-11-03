export type OnlineStatus = {
    online: boolean;
    lastChange: number;
};
/**
 * Returns the current online status and the timestamp of the last change.
 *
 * Uses `useSyncExternalStore` so the value is consistent across concurrent
 * React renders — no stale reads mid-flight.
 */
export declare function useOnlineStatus(): OnlineStatus;
//# sourceMappingURL=useOnlineStatus.d.ts.map