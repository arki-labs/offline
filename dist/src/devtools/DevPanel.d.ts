import type { ReactNode } from 'react';
/**
 * Floating debug panel for inspecting the offline mutation queue.
 *
 * Rendered only in development builds (guarded by `import.meta.env.DEV`).
 * In production, and outside Vite (no `import.meta.env`), the component
 * returns null immediately — tree-shaking eliminates it from a production bundle.
 */
export declare function OfflineDevPanel(): ReactNode;
//# sourceMappingURL=DevPanel.d.ts.map