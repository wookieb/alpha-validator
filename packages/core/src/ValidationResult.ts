import {Violation, ViolationsList} from "./ViolationsList";
import {Validation} from "monet";
import {isViolation} from "./Validator";

export type ValidationResult<T> = ViolationsList | undefined | Violation | Validation<ViolationsList, T>;
export namespace ValidationResult {
    export function toValidation<T>(result: ValidationResult<T>, data: T): Validation<ViolationsList, T> {
        if (result === undefined) {
            return Validation.Success(data as T);
        }

        if (result instanceof ViolationsList) {
            return Validation.Fail(result);
        }

        if (isViolation(result)) {
            return Validation.Fail(
                ViolationsList.create().addViolation(result)
            );
        }

        if (Validation.isInstance(result)) {
            return result;
        }

        throw new Error(
            `Invalid result from validation. Expected: ViolationList, Violation, Validation object or undefined`
        );
    }
}
