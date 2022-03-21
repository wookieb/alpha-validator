import {Module as _Module, StandardActions} from "@pallad/modules";
import {Container, Definition, onActivation} from "alpha-dic";
import {References} from "./References";
import {SchemaValidation, Validator} from "alpha-validator";
import {schemaValidationAnnotation} from "./schemaValidationAnnotation";
import {schemaValidatorAnnotation} from "./schemaValidatorAnnotation";
import {SchemaValidator} from "./SchemaValidator";
import * as is from "predicates";

const assertIsValidator = is.assert(
    is.prop('validate', is.func),
    'Schema validator service needs to be an object with `validate` function. Make sure that SchemaValidator interface is implemented.'
);

export class Module extends _Module<{ container: Container }> {

    constructor() {
        super('alpha-validator');
    }

    init(): void {
        this.registerAction(StandardActions.INITIALIZATION, context => {
            context.container.registerDefinition(
                Module.getValidatorDefinition()
            );
        });
    }

    static getValidatorDefinition() {
        return Definition.create(References.VALIDATOR)
            .useConstructor(Validator)
            .annotate(onActivation(async function (this: Container, service: Validator) {
                for (const [schemaValidator, ann] of await this.getByAnnotation<SchemaValidator>(schemaValidatorAnnotation.PREDICATE, true)) {
                    const annotation = ann as schemaValidatorAnnotation.Annotation;
                    assertIsValidator(schemaValidator);
                    for (const schemaName of annotation.schemaNames) {
                        service.registerValidationForSchema(
                            schemaName,
                            schemaValidator.validate.bind(schemaValidator)
                        );
                    }
                }

                for (const [schemaValidation, ann] of await this.getByAnnotation<SchemaValidation<any>>(schemaValidationAnnotation.PREDICATE, true)) {
                    const annotation = ann as schemaValidationAnnotation.Annotation;
                    for (const schemaName of annotation.schemaNames) {
                        service.registerValidationForSchema(schemaName, schemaValidation);
                    }
                }
                return service;
            }))
    }
}
