import {ValidationResult} from "@src/ValidationResult";
import {Violation, ViolationsList} from "@src/ViolationsList";
import {left, right} from "@sweet-monads/either";

describe('ValidationResult', () => {
    const DATA = {
        some: 'data'
    };

    it('returns data is validation result is undefined', () => {
        expect(ValidationResult.toEither(undefined, DATA))
            .toEqual(right(DATA));
    });

    it('returns violations list if result if result is violation list', () => {
        const list = ViolationsList.create().addViolation('test');
        expect(ValidationResult.toEither(list, DATA))
            .toEqual(left(list));
    });

    it('returns violations list with violation if result is violation object', () => {
        const violation: Violation = {message: 'some message'};
        expect(ValidationResult.toEither(violation, DATA))
            .toEqual(left(ViolationsList.create().addViolation(violation)));
    });

    it('returns violations list from Validation', () => {
        const violation: Violation = {message: 'some message'};
        expect(ValidationResult.toEither(
            left(
                ViolationsList
                    .create()
                    .addViolation(violation)
            ),
            DATA)
        )
            .toEqual(left(ViolationsList.create().addViolation(violation)));
    });
});
