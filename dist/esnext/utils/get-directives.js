import { getDirectiveValues } from 'graphql/execution/values';
export function getDirectives(schema, node) {
    const schemaDirectives = schema && schema.getDirectives ? schema.getDirectives() : [];
    const astNode = node && node['astNode'];
    let result = {};
    if (astNode) {
        schemaDirectives.forEach((directive) => {
            const directiveValue = getDirectiveValues(directive, astNode);
            if (directiveValue !== undefined) {
                result[directive.name] = directiveValue || {};
            }
        });
    }
    return result;
}
//# sourceMappingURL=get-directives.js.map