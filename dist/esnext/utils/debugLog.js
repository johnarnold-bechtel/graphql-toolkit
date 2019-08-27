export function debugLog(...args) {
    if (process && process.env && process.env.DEBUG && !process.env.GQL_TOOLKIT_NODEBUG) {
        console.log(...args);
    }
}
//# sourceMappingURL=debugLog.js.map