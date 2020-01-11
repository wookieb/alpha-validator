import * as is from 'predicates';

/**
 * Annotation that marks given service as validation function for given schema names
 */
export function schemaValidationAnnotation(...schemaNames: string[]): Annotation {
    is.assert(is.notEmptyArray, 'You need to provide at least one schema name')(schemaNames);
    is.assert(is.arrayOf(is.notBlank), 'Every schema name must be a non-blank string')(schemaNames);
    return {
        name: NAME,
        schemaNames
    };
}

const NAME = 'alpha-validator/schema-validation';

export interface Annotation {
    name: string;
    schemaNames: string[];
}

export const PREDICATE = is.prop('name', is.eq(NAME));