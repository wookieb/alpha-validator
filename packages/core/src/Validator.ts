import {Violation, ViolationsList} from "./ViolationsList";
import {ValidatorError} from "./ValidatorError";
import {Validation} from "monet";
import {SchemaValidation} from "./SchemaValidation";

export function isViolation(data: any): data is Violation {
    return typeof data === 'object' && 'message' in data;
}

export function isPromise(data: any): data is Promise<any> {
    return typeof data === 'object' && 'then' in data;
}

function validationResult<T>(schemaName: string, data: any, result: SchemaValidation.Result<T>): Validation<ViolationsList, T> {
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
        `Invalid result from validation from schema: ${schemaName}. Expected: ViolationList, Violation, Validation object or undefined`
    );
}

export class Validator {
    private validations: Map<string, SchemaValidation<any>> = new Map();

    validate<TInput = any, TResult = TInput>(data: TInput, schemaName: string, options?: any): Promise<Validation<ViolationsList, TResult>> {
        const validation = this.validations.get(schemaName);
        if (!validation) {
            return Promise.reject(
                new Error(`There is no validation registered for schema: ${schemaName}`)
            );
        }
        const result = validation(data, schemaName, options);
        if (isPromise(result)) {
            return result.then(r => {
                return validationResult(schemaName, data, r);
            })
        }
        return new Promise((resolve => {
            resolve(validationResult(schemaName, data, result));
        }));
    }

    validateOrReject<TInput = any, TResult = TInput>(data: TInput, schemaName: string, options?: any, errorMessage = 'Invalid data'): Promise<TResult> {
        return this.validate<TInput, TResult>(data, schemaName, options)
            .then(result => {
                if (result.isFail()) {
                    throw new ValidatorError(result.fail(), errorMessage);
                }
                return result.success();
            });
    }

    registerValidationForSchema(schemaName: string, validation: SchemaValidation<any>): this {
        this.validations.set(schemaName, validation);
        return this;
    }

    hasValidation(schemaName: string) {
        return this.validations.has(schemaName);
    }
}