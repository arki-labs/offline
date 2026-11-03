import { useSyncExternalStore } from 'react';
const isOnline = () => typeof navigator === 'undefined' ? true : navigator.onLine;
function subscribeToOnlineStatus(callback) {
    if (typeof window === 'undefined')
        return () => {
            /* nothing to unsubscribe */
        };
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
    };
}
// Cached snapshot — useSyncExternalStore compares with Object.is, so we MUST
// return the same reference until the underlying state actually changes.
// Returning a fresh object on every call triggers React error #185
// ("Maximum update depth exceeded").
let cachedSnapshot = {
    online: isOnline(),
    lastChange: Date.now(),
};
// Refresh the cached snapshot on online/offline events. SSR-safe: only wires
// listeners in browser environments.
if (typeof window !== 'undefined') {
    const refresh = () => {
        cachedSnapshot = { online: isOnline(), lastChange: Date.now() };
    };
    window.addEventListener('online', refresh);
    window.addEventListener('offline', refresh);
}
function getOnlineSnapshot() {
    return cachedSnapshot;
}
// Stable server snapshot — referentially constant across renders so the
// useSyncExternalStore contract holds during SSR/hydration.
const SERVER_SNAPSHOT = { online: true, lastChange: 0 };
const getServerSnapshot = () => SERVER_SNAPSHOT;
/**
 * Returns the current online status and the timestamp of the last change.
 *
 * Uses `useSyncExternalStore` so the value is consistent across concurrent
 * React renders — no stale reads mid-flight.
 */
export function useOnlineStatus() {
    return useSyncExternalStore(subscribeToOnlineStatus, getOnlineSnapshot, getServerSnapshot);
}
//# sourceMappingURL=useOnlineStatus.js.map