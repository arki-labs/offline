import type { ReactNode } from 'react';
export type OfflineBannerState = {
    online: boolean;
    queued: number;
    deadLettered: number;
};
export type OfflineBannerProps = {
    children: (state: OfflineBannerState) => ReactNode;
};
/**
 * Headless render-prop component that exposes offline + queue state to the caller.
 *
 * The caller owns all visual presentation — OfflineBanner only provides data.
 * This keeps @arki/offline decoupled from any particular design system.
 *
 * Works with or without `OfflineQueueProvider`. When no queue provider is present,
 * `queued` and `deadLettered` default to 0.
 *
 * @example
 * <OfflineBanner>
 *   {({ online, queued }) =>
 *     !online ? <Banner>You are offline — {queued} changes pending</Banner> : null
 *   }
 * </OfflineBanner>
 */
export declare function OfflineBanner({ children }: OfflineBannerProps): ReactNode;
//# sourceMappingURL=OfflineBanner.d.ts.map