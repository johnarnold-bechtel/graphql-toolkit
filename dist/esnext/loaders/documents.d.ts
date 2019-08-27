import { DocumentFile, LoadTypedefsOptions } from './load-typedefs';
export declare const OPERATION_KINDS: ("OperationDefinition" | "FragmentDefinition")[];
export declare const NON_OPERATION_KINDS: any[];
export declare function loadDocuments(documentDef: string | string[], options?: LoadTypedefsOptions, cwd?: string): Promise<DocumentFile[]>;
