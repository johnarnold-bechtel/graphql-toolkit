"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fields_1 = require("./fields");
const directives_1 = require("./directives");
function mergeInputType(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (node.kind === 'InputObjectTypeDefinition' || existingNode.kind === 'InputObjectTypeDefinition') ? 'InputObjectTypeDefinition' : 'InputObjectTypeExtension',
                loc: node.loc,
                fields: fields_1.mergeFields(node, node.fields, existingNode.fields, config),
                directives: directives_1.mergeDirectives(node.directives, existingNode.directives, config),
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
        }
    }
    return node;
}
exports.mergeInputType = mergeInputType;
//# sourceMappingURL=input-type.js.map