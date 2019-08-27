function alreadyExists(arr, other) {
    return !!arr.find(i => i.name.value === other.name.value);
}
export function mergeNamedTypeArray(first, second) {
    return [
        ...second,
        ...(first.filter(d => !alreadyExists(second, d))),
    ];
}
//# sourceMappingURL=merge-named-type-array.js.map