"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const flatten_array_1 = require("./flatten-array");
function resolveRelevantMappings(resolvers, path, allMappings) {
    const splitted = path.split('.');
    if (splitted.length === 2) {
        const typeName = splitted[0];
        const fieldName = splitted[1];
        if (fieldName === '*') {
            return flatten_array_1.flattenArray(Object.keys(resolvers[typeName])
                .map(field => resolveRelevantMappings(resolvers, `${typeName}.${field}`, allMappings)))
                .filter(mapItem => !allMappings[mapItem]);
        }
        else {
            const paths = [];
            if (resolvers[typeName] && resolvers[typeName][fieldName]) {
                if (resolvers[typeName][fieldName]['subscribe']) {
                    paths.push(path + '.subscribe');
                }
                if (resolvers[typeName][fieldName]['resolve']) {
                    paths.push(path + '.resolve');
                }
                if (typeof resolvers[typeName][fieldName] === 'function') {
                    paths.push(path);
                }
            }
            return paths;
        }
    }
    else if (splitted.length === 1) {
        const typeName = splitted[0];
        return flatten_array_1.flattenArray(Object.keys(resolvers[typeName])
            .map(fieldName => resolveRelevantMappings(resolvers, `${typeName}.${fieldName}`, allMappings)));
    }
    return [];
}
/**
 * Wraps the resolvers object with the resolvers composition objects.
 * Implemented as a simple and basic middleware mechanism.
 *
 * @param resolvers - resolvers object
 * @param mapping - resolvers composition mapping
 * @hidden
 */
function composeResolvers(resolvers, mapping = {}) {
    const mappingResult = {};
    Object.keys(mapping).map((resolverPath) => {
        if (mapping[resolverPath] instanceof Array || typeof mapping[resolverPath] === 'function') {
            const composeFns = mapping[resolverPath];
            const relevantFields = resolveRelevantMappings(resolvers, resolverPath, mapping);
            relevantFields.forEach((path) => {
                mappingResult[path] = helpers_1.asArray(composeFns);
            });
        }
        else {
            Object.keys(mapping[resolverPath]).map(fieldName => {
                const composeFns = mapping[resolverPath][fieldName];
                const relevantFields = resolveRelevantMappings(resolvers, resolverPath + '.' + fieldName, mapping);
                relevantFields.forEach((path) => {
                    mappingResult[path] = helpers_1.asArray(composeFns);
                });
            });
        }
    });
    Object.keys(mappingResult).forEach(path => {
        const fns = helpers_1.chainFunctions([...helpers_1.asArray(mappingResult[path]), () => lodash_1.get(resolvers, path)]);
        lodash_1.set(resolvers, path, fns());
    });
    return resolvers;
}
exports.composeResolvers = composeResolvers;
//# sourceMappingURL=resolvers-composition.js.map