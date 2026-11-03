import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isFailure } from '@arki/failure';
import { useState, useEffect } from 'react';
import { useOnlineStatus } from '../status/useOnlineStatus.js';
import { useOfflineQueueOptional } from '../mutations/OfflineQueueProvider.js';
/**
 * Floating debug panel for inspecting the offline mutation queue.
 *
 * Rendered only in development builds (guarded by `import.meta.env.DEV`).
 * In production, the component returns null immediately — tree-shaking
 * eliminates it from the bundle entirely.
 */
export function OfflineDevPanel() {
    // Gate: no-op in production. Vite replaces import.meta.env.DEV at build time.
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- DEV is a Vite build-time constant, not a Turbo env var
    if (!import.meta.env.DEV)
        return null;
    return _jsx(DevPanelImpl, {});
}
function DevPanelImpl() {
    const [failure, setFailure] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deadLettered, setDeadLettered] = useState([]);
    const { online } = useOnlineStatus();
    const queueCtx = useOfflineQueueOptional();
    useEffect(() => {
        if (!queueCtx)
            return;
        const { queue } = queueCtx;
        const refresh = () => {
            void queue.deadLetter.list().then(result => {
                if (isFailure(result))
                    setFailure(result);
                else {
                    setDeadLettered(result);
                    setFailure(null);
                }
            });
        };
        refresh();
        const unsub = queue.subscribe(() => {
            refresh();
        });
        return unsub;
    }, [queueCtx]);
    const status = queueCtx?.queue.status();
    return (_jsxs("div", { style: {
            position: 'fixed',
            bottom: 12,
            right: 12,
            zIndex: 9999,
            fontFamily: 'monospace',
            fontSize: 12,
        }, children: [_jsxs("button", { onClick: () => setIsOpen((v) => !v), style: {
                    background: online ? '#166534' : '#991b1b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    cursor: 'pointer',
                }, children: ["offline ", online ? '✓' : '✗', status && status.queued > 0 ? ` · ${status.queued}q` : '', status && status.deadLettered > 0 ? ` · ${status.deadLettered}dl` : ''] }), isOpen && (_jsxs("div", { style: {
                    background: '#1c1c1e',
                    color: '#e5e5ea',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 6,
                    minWidth: 280,
                    maxHeight: 400,
                    overflowY: 'auto',
                    boxShadow: '0 4px 24px rgba(0,0,0,.5)',
                }, children: [_jsx("div", { style: { marginBottom: 8, fontWeight: 'bold' }, children: "Offline Dev Panel" }), _jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", online ? '🟢 online' : '🔴 offline'] }), status && (_jsxs("div", { children: [_jsx("strong", { children: "Queue:" }), " ", status.queued, " queued \u00B7 ", status.sending ? 'sending…' : 'idle', " \u00B7 ", status.deadLettered, " dead-lettered"] })), (failure ?? status?.failure) && _jsx("div", { role: "alert", children: (failure ?? status?.failure)?.message }), deadLettered.length > 0 && (_jsxs("div", { style: { marginTop: 8 }, children: [_jsx("strong", { children: "Dead-letter:" }), deadLettered.map((m) => (_jsxs("div", { style: { fontSize: 11, marginTop: 4, opacity: 0.8 }, children: [m.procedurePath.join('.'), " \u2014 ", m.lastError?.message ?? 'unknown error', queueCtx && (_jsxs("span", { children: [' ', _jsx("button", { style: { fontSize: 10, cursor: 'pointer', marginLeft: 4 }, onClick: () => void queueCtx.queue.deadLetter.retry(m.id).then(result => setFailure(isFailure(result) ? result : null)), children: "retry" }), _jsx("button", { style: { fontSize: 10, cursor: 'pointer', marginLeft: 4 }, onClick: () => void queueCtx.queue.deadLetter.discard(m.id).then(result => setFailure(isFailure(result) ? result : null)), children: "discard" })] }))] }, m.id)))] })), !queueCtx && (_jsx("div", { style: { marginTop: 8, opacity: 0.6, fontSize: 11 }, children: "No OfflineQueueProvider in tree \u2014 queue features unavailable." }))] }))] }));
}
//# sourceMappingURL=DevPanel.js.map