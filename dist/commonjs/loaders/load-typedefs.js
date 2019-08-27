'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const isValidPath = require('is-valid-path');
const isGlob = require('is-glob');
const valid_url_1 = require('valid-url');
const load_from_url_1 = require('./load-from-url');
const path_1 = require('path');
const load_from_json_file_1 = require('./load-from-json-file');
const load_from_gql_file_1 = require('./load-from-gql-file');
const load_from_code_file_1 = require('./load-from-code-file');
const debugLog_1 = require('../utils/debugLog');
const fix_windows_path_1 = require('../utils/fix-windows-path');
const globby = require('globby');
const GQL_EXTENSIONS = ['.gql', '.graphql', '.graphqls'];
const CODE_FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
function filterFiles(files) {
  return files.filter(
    (file) =>
      !file.endsWith('.d.ts') &&
      !file.endsWith('.spec.ts') &&
      !file.endsWith('.spec.js') &&
      !file.endsWith('.test.ts') &&
      !file.endsWith('.test.js')
  );
}
async function loadTypedefs(pointToSchema, options = {}, filterKinds = [], cwd = process.cwd()) {
  const typesPaths = normalizeSchemaString(pointToSchema);
  let found = [];
  let foundGlobs = [];
  for (const typesPath of typesPaths) {
    if (isSchemaString(typesPath)) {
      found.push({
        filePath: typesPath,
        content: graphql_1.parse(typesPath),
      });
    } else if (!valid_url_1.isUri(typesPath)) {
      const fixedPath = fix_windows_path_1.fixWindowsPath(typesPath);
      if (isValidPath(fixedPath)) {
        const relevantFiles = filterFiles([fixedPath]);
        found.push(
          ...(await Promise.all(
            relevantFiles.map(async (p) => ({
              filePath: p,
              content: await loadSingleFile(
                p,
                {
                  skipGraphQLImport: options.skipGraphQLImport,
                  noRequire: options.noRequire,
                  tagPluck: options.tagPluck || {},
                },
                cwd
              ),
            }))
          ))
        );
      } else if (isGlob(fixedPath)) {
        foundGlobs.push(fixedPath);
      }
    } else if (valid_url_1.isUri(typesPath)) {
      found.push({
        filePath: typesPath,
        content: await load_from_url_1.loadFromUrl(typesPath, options),
      });
    }
  }
  if (foundGlobs.length > 0) {
    if (options.ignore) {
      const ignoreList = (Array.isArray(options.ignore) ? options.ignore : [options.ignore]).map((g) => `!(${g})`);
      if (ignoreList.length > 0) {
        foundGlobs.push(...ignoreList);
      }
    }
    const relevantFiles = await globby(foundGlobs, { cwd, absolute: true });
    if (relevantFiles.length > 0) {
      found.push(
        ...(await Promise.all(
          relevantFiles
            .sort((a, b) => {
              if (a.filePath < b.filePath) {
                return -1;
              }
              if (a.filePath > b.filePath) {
                return 1;
              }
              return 0;
            })
            .map(async (p) => ({
              filePath: p,
              content: await loadSingleFile(
                p,
                {
                  skipGraphQLImport: options.skipGraphQLImport,
                  noRequire: options.noRequire,
                  tagPluck: options.tagPluck || {},
                },
                cwd
              ),
            }))
        ))
      );
    }
  }
  let allFoundDocuments = graphql_1.concatAST(found.map((a) => a.content).filter((a) => a));
  if (allFoundDocuments.definitions.length > 0 && filterKinds && filterKinds.length > 0) {
    const invalidDefinitions = allFoundDocuments.definitions.filter((d) => filterKinds.includes(d.kind));
    if (invalidDefinitions.length > 0) {
      invalidDefinitions.forEach((d) => {
        debugLog_1.debugLog(`Filtered document of kind ${d.kind} due to filter policy (${filterKinds.join(', ')})`);
      });
    }
    found = found.map((documentFile) => ({
      filePath: documentFile.filePath,
      content: {
        kind: graphql_1.Kind.DOCUMENT,
        definitions: documentFile.content
          ? documentFile.content.definitions.filter((d) => !filterKinds.includes(d.kind))
          : null,
      },
    }));
  }
  const nonEmpty = found.filter((f) => f.content && f.content.definitions && f.content.definitions.length > 0);
  if (nonEmpty.length === 0) {
    throw new Error(`Unable to find any GraphQL type defintions for the following pointers: ${typesPaths.join(', ')}`);
  }
  return nonEmpty;
}
exports.loadTypedefs = loadTypedefs;
async function loadSingleFile(filePath, options = {}, cwd = process.cwd()) {
  const extension = path_1.extname(filePath).toLowerCase();
  const fullPath = fix_windows_path_1.fixWindowsPath(
    path_1.isAbsolute(filePath) ? filePath : path_1.resolve(cwd, filePath)
  );
  try {
    if (extension === '.json') {
      return await load_from_json_file_1.loadFromJsonFile(fullPath);
    } else if (GQL_EXTENSIONS.includes(extension)) {
      return await load_from_gql_file_1.loadFromGqlFile(fullPath, options.skipGraphQLImport);
    } else if (CODE_FILE_EXTENSIONS.includes(extension)) {
      return await load_from_code_file_1.loadFromCodeFile(fullPath, options);
    }
  } catch (e) {
    debugLog_1.debugLog(`Failed to find any GraphQL type definitions in: ${filePath} - ${e.message}`);
    throw e;
  }
  return null;
}
exports.loadSingleFile = loadSingleFile;
function isSchemaString(str) {
  // XXX: is-valid-path or is-glob treat SDL as a valid path
  // (`scalar Date` for example)
  // this why checking the extension is fast enough
  // and prevent from parsing the string in order to find out
  // if the string is a SDL
  if (/\.[a-z0-9]+$/i.test(str)) {
    return false;
  }
  try {
    graphql_1.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
function normalizeSchemaString(str) {
  if (Array.isArray(str)) {
    return str;
  }
  return [str];
}
//# sourceMappingURL=load-typedefs.js.map
