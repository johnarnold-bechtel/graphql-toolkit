"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("@kamilkisiela/graphql-tools");
const graphql_1 = require("graphql");
function getSchemaDirectiveFromDirectiveResolver(directiveResolver) {
    return class extends graphql_tools_1.SchemaDirectiveVisitor {
        visitFieldDefinition(field) {
            const resolver = directiveResolver;
            const originalResolver = field.resolve || graphql_1.defaultFieldResolver;
            const directiveArgs = this.args;
            field.resolve = (...args) => {
                const [source, /* original args */ , context, info] = args;
                return resolver(async () => originalResolver.apply(field, args), source, directiveArgs, context, info);
            };
        }
    };
}
exports.getSchemaDirectiveFromDirectiveResolver = getSchemaDirectiveFromDirectiveResolver;
//# sourceMappingURL=get-schema-directive-from-directive-resolver.js.map