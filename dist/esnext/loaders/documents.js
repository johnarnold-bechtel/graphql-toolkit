import { loadTypedefs } from './load-typedefs';
import { Kind } from 'graphql';
export const OPERATION_KINDS = [Kind.OPERATION_DEFINITION, Kind.FRAGMENT_DEFINITION];
export const NON_OPERATION_KINDS = Object.keys(Kind)
    .reduce((prev, v) => [...prev, Kind[v]], [])
    .filter(v => !OPERATION_KINDS.includes(v));
export async function loadDocuments(documentDef, options = {}, cwd = process.cwd()) {
    return await loadTypedefs(documentDef, { ...options, skipGraphQLImport: true, noRequire: true }, NON_OPERATION_KINDS, cwd);
}
//# sourceMappingURL=documents.js.map