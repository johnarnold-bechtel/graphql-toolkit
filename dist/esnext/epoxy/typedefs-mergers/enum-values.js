function alreadyExists(arr, other) {
    return !!arr.find(v => v.name.value === other.name.value);
}
export function mergeEnumValues(first, second) {
    return [
        ...second,
        ...(first.filter(d => !alreadyExists(second, d))),
    ];
}
//# sourceMappingURL=enum-values.js.map