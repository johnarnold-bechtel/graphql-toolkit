"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const directives_1 = require("./directives");
const helpers_1 = require("../../utils/helpers");
const arguments_1 = require("./arguments");
function fieldAlreadyExists(fieldsArr, otherField) {
    const result = fieldsArr.find(field => field.name.value === otherField.name.value);
    if (result) {
        const t1 = utils_1.extractType(result.type);
        const t2 = utils_1.extractType(otherField.type);
        if (t1.name.value !== t2.name.value) {
            throw new Error(`Field "${otherField.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
        }
    }
    return !!result;
}
function mergeFields(type, f1, f2, config) {
    const result = [...f2];
    for (const field of f1) {
        if (fieldAlreadyExists(result, field)) {
            const existing = result.find((f) => f.name.value === field.name.value);
            if (config && config.throwOnConflict) {
                preventConflicts(type, existing, field, false);
            }
            else {
                preventConflicts(type, existing, field, true);
            }
            if (utils_1.isNonNullTypeNode(field.type) && !utils_1.isNonNullTypeNode(existing.type)) {
                existing.type = field.type;
            }
            existing['arguments'] = arguments_1.mergeArguments(field['arguments'], existing['arguments']);
            existing['directives'] = directives_1.mergeDirectives(field['directives'], existing['directives'], config);
        }
        else {
            result.push(field);
        }
    }
    if (config && config.exclusions) {
        return result.filter(field => !config.exclusions.includes(`${type.name.value}.${field.name.value}`));
    }
    return result;
}
exports.mergeFields = mergeFields;
function preventConflicts(type, a, b, ignoreNullability = false) {
    const aType = utils_1.printTypeNode(a.type);
    const bType = utils_1.printTypeNode(b.type);
    if (helpers_1.isNotEqual(aType, bType)) {
        if (safeChangeForFieldType(a.type, b.type, ignoreNullability) === false) {
            throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
        }
    }
}
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
    // both are named
    if (!utils_1.isWrappingTypeNode(oldType) && !utils_1.isWrappingTypeNode(newType)) {
        return oldType.toString() === newType.toString();
    }
    // new is non-null
    if (utils_1.isNonNullTypeNode(newType)) {
        // I don't think it's a breaking change but `merge-graphql-schemas` needs it...
        if (!utils_1.isNonNullTypeNode(oldType) && !ignoreNullability) {
            return false;
        }
        const ofType = utils_1.isNonNullTypeNode(oldType) ? oldType.type : oldType;
        return safeChangeForFieldType(ofType, newType.type);
    }
    // old is non-null
    if (utils_1.isNonNullTypeNode(oldType)) {
        return safeChangeForFieldType(newType, oldType, ignoreNullability);
    }
    // old is list
    if (utils_1.isListTypeNode(oldType)) {
        return (utils_1.isListTypeNode(newType) && safeChangeForFieldType(oldType.type, newType.type)) || (utils_1.isNonNullTypeNode(newType) && safeChangeForFieldType(oldType, newType.type));
    }
    return false;
}
//# sourceMappingURL=fields.js.map