"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const fs_1 = require("fs");
const extract_document_string_from_code_file_1 = require("../utils/extract-document-string-from-code-file");
const utils_1 = require("../utils");
const debugLog_1 = require("../utils/debugLog");
function isSchemaText(obj) {
    return typeof obj === 'string';
}
function isWrappedSchemaJson(obj) {
    const json = obj;
    return json.data !== undefined && json.data.__schema !== undefined;
}
function isSchemaJson(obj) {
    const json = obj;
    return json !== undefined && json.__schema !== undefined;
}
function isSchemaObject(obj) {
    return obj instanceof graphql_1.GraphQLSchema;
}
function isSchemaAst(obj) {
    return obj.kind !== undefined;
}
function resolveExport(fileExport) {
    if (isSchemaObject(fileExport)) {
        return graphql_1.parse(utils_1.printSchemaWithDirectives(fileExport));
    }
    else if (isSchemaText(fileExport)) {
        return graphql_1.parse(fileExport);
    }
    else if (isWrappedSchemaJson(fileExport)) {
        const asSchema = graphql_1.buildClientSchema(fileExport.data);
        const printed = utils_1.printSchemaWithDirectives(asSchema);
        return graphql_1.parse(printed);
    }
    else if (isSchemaJson(fileExport)) {
        const asSchema = graphql_1.buildClientSchema(fileExport);
        const printed = utils_1.printSchemaWithDirectives(asSchema);
        return graphql_1.parse(printed);
    }
    else if (isSchemaAst(fileExport)) {
        return fileExport;
    }
    return null;
}
async function tryToLoadFromExport(filePath) {
    try {
        const rawExports = await eval(`require('${filePath}');`);
        if (rawExports) {
            let rawExport = rawExports.default || rawExports.schema || rawExports;
            if (rawExport) {
                let exportValue = await rawExport;
                exportValue = await (exportValue.default || exportValue.schema || exportValue.typeDefs || exportValue);
                try {
                    return resolveExport(exportValue);
                }
                catch (e) {
                    throw new Error('Exported schema must be of type GraphQLSchema, text, AST, or introspection JSON.');
                }
            }
            else {
                throw new Error(`Invalid export from export file ${filePath}: missing default export or 'schema' export!`);
            }
        }
        else {
            throw new Error(`Invalid export from export file ${filePath}: empty export!`);
        }
    }
    catch (e) {
        throw new Error(`Unable to load from file "${filePath}": ${e.message}`);
    }
}
async function tryToLoadFromCodeAst(filePath, options) {
    const content = fs_1.readFileSync(filePath, 'utf-8');
    const foundDoc = await extract_document_string_from_code_file_1.extractDocumentStringFromCodeFile(new graphql_1.Source(content, filePath), options || {});
    if (foundDoc) {
        return graphql_1.parse(foundDoc);
    }
    else {
        return null;
    }
}
async function loadFromCodeFile(filePath, options) {
    let loaded = null;
    try {
        const result = await tryToLoadFromCodeAst(filePath, options);
        if (result) {
            loaded = result;
        }
    }
    catch (e) {
        debugLog_1.debugLog(`Failed to load schema from code file "${filePath}" using AST: ${e.message}`);
        throw e;
    }
    if (!loaded && !options.noRequire) {
        loaded = await tryToLoadFromExport(filePath);
    }
    return loaded;
}
exports.loadFromCodeFile = loadFromCodeFile;
//# sourceMappingURL=load-from-code-file.js.map