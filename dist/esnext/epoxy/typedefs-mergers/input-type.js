import { mergeFields } from './fields';
import { mergeDirectives } from './directives';
export function mergeInputType(node, existingNode, config) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (node.kind === 'InputObjectTypeDefinition' || existingNode.kind === 'InputObjectTypeDefinition') ? 'InputObjectTypeDefinition' : 'InputObjectTypeExtension',
                loc: node.loc,
                fields: mergeFields(node, node.fields, existingNode.fields, config),
                directives: mergeDirectives(node.directives, existingNode.directives, config),
            };
        }
        catch (e) {
            throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
        }
    }
    return node;
}
//# sourceMappingURL=input-type.js.map