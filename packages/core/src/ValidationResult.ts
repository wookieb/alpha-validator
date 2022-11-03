import {Violation, ViolationsList} from "./ViolationsList";
import {isViolation} from "./Validator";
import {Either, left, right, isEither} from "@sweet-monads/either";

export type ValidationResult<T> = ViolationsList | undefined | Violation | Either<ViolationsList, T>;
export namespace ValidationResult {
    export function toEither<T>(result: ValidationResult<T>, data: T): Either<ViolationsList, T> {
        if (result === undefined) {
            return right(data as T);
        }

        if (result instanceof ViolationsList) {
            return left(result);
        }

        if (isViolation(result)) {
            return left(
                ViolationsList.create().addViolation(result)
            );
        }

        if (isEither(result)) {
            return result;
        }

        throw new Error(
            `Invalid result from validation. Expected: ViolationList, Violation, Either object or undefined`
        );
    }
}
