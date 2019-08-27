"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function alreadyExists(arr, other) {
    return !!arr.find(v => v.name.value === other.name.value);
}
function mergeEnumValues(first, second) {
    return [
        ...second,
        ...(first.filter(d => !alreadyExists(second, d))),
    ];
}
exports.mergeEnumValues = mergeEnumValues;
//# sourceMappingURL=enum-values.js.map