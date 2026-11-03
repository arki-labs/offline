export declare function observeQueue<Value>(name: string, work: () => Promise<Value>): Promise<Value | import("@arki/failure").Failure<"failure.unexpected_defect", undefined>>;
export declare function observeEnqueue<Value>(work: () => Promise<Value>): Promise<Value | import("@arki/failure").Failure<"failure.unexpected_defect", undefined>>;
//# sourceMappingURL=telemetry.d.ts.map