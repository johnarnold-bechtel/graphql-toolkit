"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const extract_field_resolvers_from_object_type_1 = require("./extract-field-resolvers-from-object-type");
function extractResolversFromSchema(schema, options) {
    const resolvers = {};
    const typeMap = schema.getTypeMap();
    let selectedTypeNames;
    if (options && options.selectedTypeDefs) {
        const invalidSchema = graphql_1.buildASTSchema(options.selectedTypeDefs);
        selectedTypeNames = Object.keys(invalidSchema.getTypeMap());
    }
    for (const typeName in typeMap) {
        if (!typeName.startsWith('__')) {
            const typeDef = typeMap[typeName];
            if (selectedTypeNames && !selectedTypeNames.includes(typeName)) {
                continue;
            }
            if (typeDef instanceof graphql_1.GraphQLScalarType) {
                resolvers[typeName] = typeDef;
            }
            else if (typeDef instanceof graphql_1.GraphQLObjectType || typeDef instanceof graphql_1.GraphQLInterfaceType) {
                resolvers[typeName] = extract_field_resolvers_from_object_type_1.extractFieldResolversFromObjectType(typeDef, {
                    selectedTypeDefs: options && options.selectedTypeDefs
                });
            }
            else if (typeDef instanceof graphql_1.GraphQLEnumType) {
                const enumValues = typeDef.getValues();
                resolvers[typeName] = {};
                for (const { name, value } of enumValues) {
                    resolvers[typeName][name] = value;
                }
            }
            else if (typeDef instanceof graphql_1.GraphQLUnionType) {
                resolvers[typeName] = {
                    __resolveType: typeDef.resolveType,
                };
            }
        }
    }
    return resolvers;
}
exports.extractResolversFromSchema = extractResolversFromSchema;
//# sourceMappingURL=extract-resolvers-from-schema.js.map