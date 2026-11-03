import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import { isFailure, UnexpectedDefect } from '@arki/failure';
import { idempotencyKeyId } from './idempotency-id.js';
import { IdempotencyStoreUnconfirmed } from './idempotency-failures.js';
const TTL_DAYS = 7;
/**
 * Cache a completed response through the dialect's own `insert` (an insert that ignores a duplicate key).
 * A failure never authorizes re-running its handler.
 */
export function storeIdempotentResponse(key, path, userId, response, insert) {
    let span;
    observe(() => { span = trace.getTracer('@arki/offline').startSpan('offline.idempotency.store'); });
    let execution;
    const executeOnce = async () => {
        let result;
        try {
            const id = idempotencyKeyId.create();
            if (isFailure(id)) {
                result = id;
            }
            else {
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + TTL_DAYS);
                try {
                    await insert({ id, idempotencyKey: key, procedurePath: path, userId, responseJson: response, expiresAt });
                }
                catch (error) {
                    result = IdempotencyStoreUnconfirmed({ cause: error });
                }
            }
        }
        catch (error) {
            result = UnexpectedDefect({ cause: error });
        }
        if (isFailure(result)) {
            const failure = result;
            observe(() => { span?.setAttribute('failure.code', failure.code); });
            observe(() => { span?.setStatus({ code: SpanStatusCode.ERROR, message: failure.code }); });
        }
        observe(() => { span?.end(); });
        return result;
    };
    // Reserve ownership before any provider/reporter can reenter the context callback.
    const execute = () => (execution ??= Promise.resolve().then(executeOnce));
    // A faulty context manager may omit/repeat the callback or throw after invoking it.
    // Always return the one owned execution, even when telemetry fails.
    observe(() => {
        if (span !== undefined) {
            // eslint-disable-next-line failure/must-use -- This secondary telemetry observer shares execute()'s cached outcome; the primary outcome is returned below.
            void Promise.resolve(context.with(trace.setSpan(context.active(), span), execute)).catch(() => {
                // Observe rejected work from a defective context manager; execute() owns the outcome.
            });
        }
    });
    return execute();
}
/** App-owned telemetry cannot change cache writes or their returned outcomes. */
function observe(report) {
    try {
        report();
    }
    catch { /* Best-effort reporting. */ }
}
//# sourceMappingURL=idempotency-store.js.map