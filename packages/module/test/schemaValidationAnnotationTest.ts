import {schemaValidationAnnotation} from "@src/schemaValidationAnnotation";

describe('schemaValidationAnnotation', () => {
    describe('success', () => {
        it('registering single schema', () => {
            expect(schemaValidationAnnotation('schema1'))
                .toMatchSnapshot();
        });

        it('registering multiple schemas', () => {
            expect(schemaValidationAnnotation('schema1', 'schema2'))
                .toMatchSnapshot();
        });
    });
});