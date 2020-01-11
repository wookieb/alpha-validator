import {SchemaValidator} from "@src/SchemaValidator";
import {SchemaValidatorService} from "@src/SchemaValidatorService";
import {Container, createStandard, Service} from "alpha-dic";
import {PREDICATE} from "@src/schemaValidationAnnotation";
import * as sinon from 'sinon';
import {Validation} from "alpha-validator";

describe('SchemaValidatorService', () => {

    let container: Container;

    beforeEach(() => {
        container = createStandard();
    });

    it('registers class', async () => {
        const stub = sinon.stub();
        const RESULT = Validation.Success({});

        @SchemaValidatorService('name')
        class Foo implements SchemaValidator {
            validate(data: any, schemaName: string): Validation<any, any> {
                stub.call(this, data, schemaName);
                return RESULT;
            }
        }

        const validations = await container.getByAnnotation(PREDICATE);

        expect(validations)
            .toHaveLength(1);

        const validation = validations[0];
        expect(validation)
            .toBeInstanceOf(Function);

        expect(validation())
            .toStrictEqual(RESULT);

        sinon.assert.calledOn(stub, sinon.match.instanceOf(Foo));
    });

    it('fails to create a service on an object that does not implement SchemaValidator class', () => {
        @SchemaValidatorService('name')
        class Foo {
        }

        return expect(container.getByAnnotation(PREDICATE))
            .rejects
            .toThrowErrorMatchingSnapshot();
    });
});