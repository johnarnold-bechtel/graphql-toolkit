"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fields_1 = require("./fields");
const directives_1 = require("./directives");
function mergeInterface(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (node.kind === 'InterfaceTypeDefinition' || existingNode.kind === 'InterfaceTypeDefinition') ? 'InterfaceTypeDefinition' : 'InterfaceTypeExtension',
                loc: node.loc,
                fields: fields_1.mergeFields(node, node.fields, existingNode.fields, config),
                directives: directives_1.mergeDirectives(node.directives, existingNode.directives, config),
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL interface "${node.name.value}": ${e.message}`);
        }
    }
    return node;
}
exports.mergeInterface = mergeInterface;
//# sourceMappingURL=interface.js.map