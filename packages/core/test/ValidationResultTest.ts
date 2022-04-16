import {ValidationResult} from "@src/ValidationResult";
import {Violation, ViolationsList} from "@src/ViolationsList";
import {Validation} from "monet";

describe('ValidationResult', () => {
    const DATA = {
        some: 'data'
    };

    it('returns data is validation result is undefined', () => {
        expect(ValidationResult.toValidation(undefined, DATA))
            .toEqual(Validation.Success(DATA));
    });

    it('returns violations list if result if result is violation list', () => {
        const list = ViolationsList.create().addViolation('test');
        expect(ValidationResult.toValidation(list, DATA))
            .toEqual(Validation.Fail(list));
    });

    it('returns violations list with violation if result is violation object', () => {
        const violation: Violation = {message: 'some message'};
        expect(ValidationResult.toValidation(violation, DATA))
            .toEqual(Validation.Fail(ViolationsList.create().addViolation(violation)));
    });

    it('returns violations list from Validation', () => {
        const violation: Violation = {message: 'some message'};
        expect(ValidationResult.toValidation(
            Validation.Fail(
                ViolationsList
                    .create()
                    .addViolation(violation)
            ),
            DATA)
        )
            .toEqual(Validation.Fail(ViolationsList.create().addViolation(violation)));
    });
});
