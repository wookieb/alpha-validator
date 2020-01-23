import {Container, createStandard} from "alpha-dic";
import * as sinon from 'sinon';
import {schemaValidationAnnotation} from "@src/schemaValidationAnnotation";
import {Module} from '@src/Module';
import {References} from "@src/References";
import {Validator} from "alpha-validator";
import {Engine, StandardActions} from "@pallad/modules";
import {SchemaValidator} from "@src/SchemaValidator";
import {schemaValidatorAnnotation} from "@src/schemaValidatorAnnotation";

describe('Module', () => {
    let container: Container;
    let validation1: sinon.SinonStub;
    let validation2: sinon.SinonStub;
    let validator1: SchemaValidator;
    let validator2: SchemaValidator;

    const SCHEMA_1 = 'schema1';
    const SCHEMA_2 = 'schema2';
    const SCHEMA_3 = 'schema3';
    const SCHEMA_4 = 'schema4';
    const SCHEMA_5 = 'schema5';
    const SCHEMA_6 = 'schema6';

    beforeEach(() => {
        validation1 = sinon.stub();
        validation2 = sinon.stub();

        validator1 = {
            validate: sinon.stub()
        };

        validator2 = {
            validate: sinon.stub()
        };

        container = createStandard({
            configureServiceDecorator: false
        });

        container.definitionWithValue('validation1', validation1)
            .annotate(schemaValidationAnnotation(SCHEMA_1));

        container.definitionWithValue('validation2', validation2)
            .annotate(schemaValidationAnnotation(SCHEMA_2, SCHEMA_3));

        container.definitionWithValue('validation3', validator1)
            .annotate(schemaValidatorAnnotation(SCHEMA_4, SCHEMA_5));

        container.definitionWithValue('validation4', validator2)
            .annotate(schemaValidatorAnnotation(SCHEMA_6));
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
        expect(validator.hasValidation(SCHEMA_4))
            .toBeTruthy();
        expect(validator.hasValidation(SCHEMA_5))
            .toBeTruthy();
        expect(validator.hasValidation(SCHEMA_6))
            .toBeTruthy();

        const value1 = {valu: 'e1'};
        await validator.validate(value1, SCHEMA_4);

        sinon.assert.calledOn(validator1.validate as any, validator1);
        sinon.assert.calledWith(validator1.validate as any, value1);

        const value2 = {valu: 'e2'};
        await validator.validate(value2, SCHEMA_5);
        sinon.assert.calledOn(validator1.validate as any, validator1);
        sinon.assert.calledWith(validator1.validate as any, value2);

        const value3 = {valu: 'e3'};
        await validator.validate(value3, SCHEMA_6);
        sinon.assert.calledOn(validator2.validate as any, validator2);
        sinon.assert.calledWith(validator2.validate as any, value3);
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