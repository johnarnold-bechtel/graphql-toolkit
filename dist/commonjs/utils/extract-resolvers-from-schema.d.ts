import { GraphQLSchema, DocumentNode } from "graphql";
import { IResolvers } from "@kamilkisiela/graphql-tools";
export interface ExtractResolversFromSchemaOptions {
    selectedTypeDefs?: DocumentNode;
}
export declare function extractResolversFromSchema(schema: GraphQLSchema, options?: ExtractResolversFromSchemaOptions): IResolvers;