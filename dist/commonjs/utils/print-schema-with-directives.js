"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const IGNORED_SCALARS = [
    graphql_1.GraphQLBoolean.name,
    graphql_1.GraphQLInt.name,
    graphql_1.GraphQLString.name,
    graphql_1.GraphQLFloat.name,
    graphql_1.GraphQLID.name,
];
function printSchemaWithDirectives(schema) {
    const allTypes = schema.getTypeMap();
    const allTypesAst = Object.keys(allTypes)
        .map(key => allTypes[key].astNode)
        .filter(a => a);
    const noAstTypes = Object.keys(allTypes)
        .map(key => IGNORED_SCALARS.includes(key) || key.startsWith('__') || allTypes[key].astNode ? null : allTypes[key])
        .filter(a => a);
    const directivesAst = schema.getDirectives().map(def => def.astNode).filter(a => a);
    if (allTypesAst.length === 0 || directivesAst.length === 0) {
        return graphql_1.printSchema(schema);
    }
    else {
        const astTypesPrinted = [...allTypesAst, ...directivesAst].map(ast => graphql_1.print(ast));
        const nonAstPrinted = noAstTypes.map(p => graphql_1.printType(p));
        return [...astTypesPrinted, ...nonAstPrinted].join('\n');
    }
}
exports.printSchemaWithDirectives = printSchemaWithDirectives;
//# sourceMappingURL=print-schema-with-directives.js.map