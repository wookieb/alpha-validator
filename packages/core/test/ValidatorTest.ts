import {createViolation, Validator, ViolationsList} from "@src/index";
import {left, right} from "@sweet-monads/either";

describe('Validator', () => {
    let validator: Validator;
    let validation: jest.Mock;
    const SCHEMA = 'foo';


    beforeEach(() => {
        validator = new Validator();
        validation = jest.fn();

        validator.registerValidationForSchema(SCHEMA, validation);
    });

    it('registering validation', () => {
        const validation = (): any => {
            return undefined
        };

        expect(validator.registerValidationForSchema(SCHEMA, validation))
            .toBe(validator);

        expect(validator.hasValidation(SCHEMA))
            .toBeTruthy();
    });

    describe('validation', () => {
        it('fails when validation for schema does not exist', () => {
            return expect(validator.validate({}, 'bar'))
                .rejects
                .toThrowErrorMatchingSnapshot();
        });

        it('resolves to Validation.Success', () => {
            validation.mockReturnValue(undefined);
            const data = {};
            return expect(validator.validate(data, SCHEMA))
                .resolves
                .toEqual(right(data))
        });

        it('resolves to Validation.Success if schema validation resolves to undefined', () => {
            validation.mockResolvedValue(undefined);
            const data = {};
            return expect(validator.validate(data, SCHEMA))
                .resolves
                .toEqual(right(data))
        });

        it('resolves to Validation.Fail if violation is returned', () => {
            const violation = createViolation('foo');
            validation.mockReturnValue(violation);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(
                    left(
                        ViolationsList.create().addViolation(violation)
                    )
                );
        });

        it('resolves to Validation.Fail if validation resolves to violation', () => {
            const violation = createViolation('foo');
            validation.mockResolvedValue(violation);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(
                    left(
                        ViolationsList.create().addViolation(violation)
                    )
                );
        });

        it('resolves to Validation.Fail if ViolationList gets returned', () => {
            const list = ViolationsList.create().addViolation('foo');
            validation.mockReturnValue(list);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(left(list));
        });

        it('resolves to Validation.Fail if validation resolves to ViolationList', () => {
            const list = ViolationsList.create().addViolation('foo');
            validation.mockResolvedValue(list);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(left(list));
        });

        it('rejects when validation resolves to unsupported type', () => {
            validation.mockResolvedValue('anything');
            return expect(validator.validate({}, SCHEMA))
                .rejects
                .toThrowErrorMatchingSnapshot();
        });

        describe('validation function is called with all arguments', () => {
            const DATA = {
                some: 'data'
            };

            it('data and schema', async () => {
                await validator.validate(DATA, SCHEMA);

                expect(validation)
                    .toHaveBeenCalledWith(DATA, SCHEMA, undefined);
            });

            it('data, schema and options', async () => {
                const options = {some: 'options'};
                await validator.validate(DATA, SCHEMA, options);

                expect(validation)
                    .toHaveBeenCalledWith(DATA, SCHEMA, options);
            });
        });
    });

    describe('validation or rejection', () => {
        it('returns sanitized data if there is no violation occur', () => {
            validation.mockReturnValue(undefined);
            const data = {};
            return expect(validator.validateOrReject(data, SCHEMA))
                .resolves
                .toEqual(data);
        });

        it('rejects with ValidatorError in case of any violation', () => {
            const violation = createViolation('Some violation');
            validation.mockReturnValue(violation);
            return expect(validator.validateOrReject({}, SCHEMA))
                .rejects
                .toMatchObject({
                    violations: ViolationsList.create().addViolation(violation),
                    message: 'Invalid data'
                });
        });
    })
});
