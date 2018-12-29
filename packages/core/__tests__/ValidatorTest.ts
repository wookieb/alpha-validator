import {createViolation, Validation, Validator, ViolationsList} from "../src";

describe('Validator', () => {
    let validator: Validator;
    let validation: jest.Mock;
    const SCHEMA = 'foo';


    beforeEach(() => {
        validator = new Validator();
        validation = jest.fn();

        validator.registerValidation(SCHEMA, validation);
    });

    it('registering validation', () => {
        const validation = (): any => {
            return undefined
        };

        expect(validator.registerValidation(SCHEMA, validation))
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

        it('resolves to undefined if no error returned', () => {
            validation.mockReturnValue(undefined);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toBeUndefined();
        });

        it('resolves to undefined if validation resolves to undefined', () => {
            validation.mockResolvedValue(undefined);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toBeUndefined();
        });

        it('resolves to ViolationList if violation is returned', () => {
            const violation = createViolation('foo');
            validation.mockReturnValue(violation);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(ViolationsList.create().addViolation(violation));
        });

        it('resolves to ViolationList if validation resolves to violation', () => {
            const violation = createViolation('foo');
            validation.mockResolvedValue(violation);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toEqual(ViolationsList.create().addViolation(violation));
        });

        it('resolves to ViolationList if ViolationList gets returned', () => {
            const list = ViolationsList.create().addViolation('foo');
            validation.mockReturnValue(list);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toStrictEqual(list);
        });

        it('resolves to ViolationList if validation resolves to ViolationList', () => {
            const list = ViolationsList.create().addViolation('foo');
            validation.mockResolvedValue(list);
            return expect(validator.validate({}, SCHEMA))
                .resolves
                .toStrictEqual(list);
        });

        it('rejects when validation result type is unsupported', () => {
            validation.mockReturnValue('anything');
            return expect(validator.validate({}, SCHEMA))
                .rejects
                .toThrowErrorMatchingSnapshot();
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
        it('does nothing if there is no violation occur', () => {
            validation.mockReturnValue(undefined);
            return expect(validator.validateOrReject({}, SCHEMA))
                .resolves
                .toEqual(undefined);
        });

        it('rejects with ValidationError in case of any violation', () => {
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