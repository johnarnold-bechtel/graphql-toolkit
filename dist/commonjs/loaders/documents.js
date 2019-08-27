"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_typedefs_1 = require("./load-typedefs");
const graphql_1 = require("graphql");
exports.OPERATION_KINDS = [graphql_1.Kind.OPERATION_DEFINITION, graphql_1.Kind.FRAGMENT_DEFINITION];
exports.NON_OPERATION_KINDS = Object.keys(graphql_1.Kind)
    .reduce((prev, v) => [...prev, graphql_1.Kind[v]], [])
    .filter(v => !exports.OPERATION_KINDS.includes(v));
async function loadDocuments(documentDef, options = {}, cwd = process.cwd()) {
    return await load_typedefs_1.loadTypedefs(documentDef, { ...options, skipGraphQLImport: true, noRequire: true }, exports.NON_OPERATION_KINDS, cwd);
}
exports.loadDocuments = loadDocuments;
//# sourceMappingURL=documents.js.map