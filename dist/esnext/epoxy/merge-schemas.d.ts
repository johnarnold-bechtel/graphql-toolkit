import { GraphQLSchema, DocumentNode } from "graphql";
import { IResolvers, SchemaDirectiveVisitor, IResolverValidationOptions, ILogger } from "@kamilkisiela/graphql-tools";
import { ResolversComposerMapping } from "../utils";
export interface MergeSchemasConfig<Resolvers extends IResolvers = IResolvers> {
    schemas: GraphQLSchema[];
    typeDefs?: (DocumentNode | string)[] | DocumentNode | string;
    resolvers?: Resolvers | Resolvers[];
    resolversComposition?: ResolversComposerMapping<Resolvers>;
    schemaDirectives?: {
        [directiveName: string]: typeof SchemaDirectiveVisitor;
    };
    resolverValidationOptions?: IResolverValidationOptions;
    logger?: ILogger;
    exclusions?: string[];
}
export declare function mergeSchemas({ schemas, typeDefs, resolvers, resolversComposition, schemaDirectives, resolverValidationOptions, logger, exclusions, }: MergeSchemasConfig): GraphQLSchema;
export declare function mergeSchemasAsync({ schemas, typeDefs, resolvers, resolversComposition, schemaDirectives, resolverValidationOptions, logger, exclusions, }: MergeSchemasConfig): Promise<GraphQLSchema>;