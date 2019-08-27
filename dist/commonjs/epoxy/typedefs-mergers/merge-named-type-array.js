"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function alreadyExists(arr, other) {
    return !!arr.find(i => i.name.value === other.name.value);
}
function mergeNamedTypeArray(first, second) {
    return [
        ...second,
        ...(first.filter(d => !alreadyExists(second, d))),
    ];
}
exports.mergeNamedTypeArray = mergeNamedTypeArray;
//# sourceMappingURL=merge-named-type-array.js.map