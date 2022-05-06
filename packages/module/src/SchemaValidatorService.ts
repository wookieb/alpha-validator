import {Annotation, Service, ServiceName} from "alpha-dic";
import {schemaValidatorAnnotation} from "./schemaValidatorAnnotation";

/**
 * Annotation that marks service as validation for given schema names.
 * Object has to implement SchemaValidator interface.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function SchemaValidatorService(schemaNames: string[], serviceName?: ServiceName) {
    return function (clazz: { new(...args: any[]): any }) {
        Service(serviceName)(clazz);
        Annotation(schemaValidatorAnnotation(...schemaNames))(clazz);
    }
}
