import * as is from "predicates";

export function assertValidSchemaNames(schemaNames: string[]) {
    is.assert(is.notEmptyArray, 'You need to provide at least one schema name')(schemaNames);
    is.assert(is.arrayOf(is.notBlank), 'Every schema name must be a non-blank string')(schemaNames);
}