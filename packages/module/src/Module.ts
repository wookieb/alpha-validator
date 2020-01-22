import {Module as _Module, StandardActions} from "@pallad/modules";
import {Container, Definition, onActivation} from "alpha-dic";
import {References} from "./References";
import {Validator} from "alpha-validator";
import {Annotation, PREDICATE} from "./schemaValidationAnnotation";
import {SchemaValidator} from "./SchemaValidator";

export class Module extends _Module<{ container: Container }> {

    constructor() {
        super('alpha-validator');
    }

    protected init(): void {
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
                for (const [schemaValidation, _ann] of await this.getByAnnotation<SchemaValidator>(PREDICATE, true)) {
                    const annotation = _ann as Annotation;

                    for (const schemaName of annotation.schemaNames) {
                        service.registerValidationForSchema(schemaName, schemaValidation.validate.bind(schemaValidation));
                    }
                }
                return service;
            }))
    }
}