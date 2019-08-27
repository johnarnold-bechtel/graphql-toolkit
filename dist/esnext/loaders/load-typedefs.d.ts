import { ExtractOptions } from './../utils/extract-document-string-from-code-file';
import { DocumentNode } from 'graphql';
export interface DocumentFile {
    filePath: string;
    content: DocumentNode;
}
export interface LoadTypedefsOptions {
    ignore?: string | string[];
    tagPluck?: ExtractOptions['tagPluck'];
    noRequire?: boolean;
    skipGraphQLImport?: boolean;
    [key: string]: any;
}
export declare function loadTypedefs<AdditionalConfig = any>(pointToSchema: string | string[], options?: LoadTypedefsOptions & Partial<AdditionalConfig>, filterKinds?: null | string[], cwd?: string): Promise<DocumentFile[]>;
export declare function loadSingleFile(filePath: string, options?: ExtractOptions & {
    noRequire?: boolean;
    skipGraphQLImport?: boolean;
}, cwd?: string): Promise<DocumentNode>;
