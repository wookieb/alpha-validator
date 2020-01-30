
import {Violation, ViolationsList} from "./ViolationsList";
import {Validation} from "monet";
import {isViolation} from "./Validator";

export type OptionalPromise<T> = Promise<T> | T;

export interface SchemaValidation<T> {
    (data: any, schemaName: string, options?: any): OptionalPromise<SchemaValidation.Result<T>>
}

export namespace SchemaValidation {
    export type Result<T> = ViolationsList | undefined | Violation | Validation<ViolationsList, T>

    export namespace Result {
        export function toValidation<T = any>(result: Result<T>, data: any): Validation<ViolationsList, T> {
            if (result === undefined) {
                return Validation.Success(data);
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
}