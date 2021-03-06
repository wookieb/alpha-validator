import * as is from 'predicates';
import {assertValidSchemaNames} from "./common";

/**
 * Annotation that marks given service as validation function for given schema names
 */
export function schemaValidationAnnotation(...schemaNames: string[]): schemaValidationAnnotation.Annotation {
    assertValidSchemaNames(schemaNames);
    return {
        name: NAME,
        schemaNames
    };
}

const NAME = 'alpha-validator/schema-validation';

export namespace schemaValidationAnnotation {
    export interface Annotation {
        name: string;
        schemaNames: string[];
    }

    export const PREDICATE = is.prop('name', is.eq(NAME));
}