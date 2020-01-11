import {Container, createStandard} from "alpha-dic";
import * as sinon from 'sinon';
import {schemaValidationAnnotation} from "@src/schemaValidationAnnotation";
import {Module} from '@src/Module';
import {References} from "@src/References";
import {Validator} from "alpha-validator";
import {Engine, StandardActions} from "@pallad/modules";

describe('Module', () => {
    let container: Container;
    let validation1: sinon.SinonStub;
    let validation2: sinon.SinonStub;

    const SCHEMA_1 = 'schema1';
    const SCHEMA_2 = 'schema2';
    const SCHEMA_3 = 'schema3';

    beforeEach(() => {
        validation1 = sinon.stub();
        validation2 = sinon.stub();

        container = createStandard({
            configureServiceDecorator: false
        });

        container.definitionWithValue('validation1', validation1)
            .annotate(schemaValidationAnnotation(SCHEMA_1));

        container.definitionWithValue('validation2', validation2)
            .annotate(schemaValidationAnnotation(SCHEMA_2, SCHEMA_3));
    });

    async function assertProperDefinitionInContainer() {
        const validator = await container.get<Validator>(References.VALIDATOR);
        expect(validator)
            .toBeInstanceOf(Validator);

        expect(validator.hasValidation(SCHEMA_1))
            .toBeTruthy();
        expect(validator.hasValidation(SCHEMA_2))
            .toBeTruthy();
        expect(validator.hasValidation(SCHEMA_3))
            .toBeTruthy();
    }

    it('getting reference', () => {
        const definition = Module.getValidatorDefinition();

        container.registerDefinition(definition);
        return assertProperDefinitionInContainer()
    });

    it('through module', async () => {
        const engine = new Engine({container});
        engine.registerModule(new Module());
        await engine.runAction(StandardActions.INITIALIZATION);

        return assertProperDefinitionInContainer();
    })
});