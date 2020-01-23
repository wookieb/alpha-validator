import * as is from 'predicates';
import {assertValidSchemaNames} from "./common";

/**
 * Annotation that marks given service as SchemaValidator service
 */
export function schemaValidatorAnnotation(...schemaNames: string[]): schemaValidatorAnnotation.Annotation {
    assertValidSchemaNames(schemaNames);
    return {
        name: NAME,
        schemaNames
    };
}

const NAME = 'alpha-validator/schema-validator';

export namespace schemaValidatorAnnotation {
    export interface Annotation {
        name: string;
        schemaNames: string[];
    }

    export const PREDICATE = is.prop('name', is.eq(NAME));
}


