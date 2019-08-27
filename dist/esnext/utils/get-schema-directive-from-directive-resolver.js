import { SchemaDirectiveVisitor } from '@kamilkisiela/graphql-tools';
import { defaultFieldResolver } from 'graphql';
export function getSchemaDirectiveFromDirectiveResolver(directiveResolver) {
    return class extends SchemaDirectiveVisitor {
        visitFieldDefinition(field) {
            const resolver = directiveResolver;
            const originalResolver = field.resolve || defaultFieldResolver;
            const directiveArgs = this.args;
            field.resolve = (...args) => {
                const [source, /* original args */ , context, info] = args;
                return resolver(async () => originalResolver.apply(field, args), source, directiveArgs, context, info);
            };
        }
    };
}
//# sourceMappingURL=get-schema-directive-from-directive-resolver.js.map