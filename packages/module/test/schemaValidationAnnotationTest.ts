import {schemaValidationAnnotation} from "@src/schemaValidationAnnotation";

describe('schemaValidationAnnotation', () => {
    describe('failure', () => {
        function assert(schemaNames: any) {
            expect(() => {
                schemaValidationAnnotation(schemaNames);
            })
                .toThrowErrorMatchingSnapshot();
        }
        describe('requires schema name', () => {
            it('to be a non-blank string', () => {
                assert('   ');
            });

            it('to be a non-empty string', () => {
                assert('');
            });

            it('to be a string', () => {
                assert(true);
            });
        });
    });

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