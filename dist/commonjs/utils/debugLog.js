"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debugLog(...args) {
    if (process && process.env && process.env.DEBUG && !process.env.GQL_TOOLKIT_NODEBUG) {
        console.log(...args);
    }
}
exports.debugLog = debugLog;
//# sourceMappingURL=debugLog.js.map