import {Annotation, onActivation, Service, ServiceName} from "alpha-dic";
import {schemaValidationAnnotation} from "./schemaValidationAnnotation";
import {SchemaValidator} from "./SchemaValidator";
import * as is from 'predicates';

const assertIsValidator = is.assert(
    is.prop('validate', is.func),
    'Schema validation service needs to be an object with `validate` function. Make sure that SchemaValidator interface is implemented.'
);

/**
 * Annotation that marks service as validation for given schema names.
 * Object has to implement SchemaValidator interface.
 */
export function SchemaValidatorService(schemaNames: string[], serviceName?: ServiceName) {
    return function (clazz: { new(...args: any[]): any }) {
        Service(serviceName)(clazz);
        Annotation(onActivation((validator: SchemaValidator) => {
            assertIsValidator(validator);
            return validator.validate.bind(validator);
        }))(clazz);
        Annotation(schemaValidationAnnotation(...schemaNames))(clazz);
    }
}