import {Violation, ViolationsList} from "./ViolationsList";
import {ValidatorError} from "./ValidatorError";
import {Maybe, Validation} from "monet";
import {SchemaValidation} from "./SchemaValidation";
import {ValidationFunction} from "./ValidationFunction";

export function isViolation(data: any): data is Violation {
    return typeof data === 'object' && 'message' in data;
}

export function isPromise(data: any): data is Promise<any> {
    return typeof data === 'object' && 'then' in data;
}

export class Validator {
    private validations: Map<string, ValidationFunction<unknown, unknown>> = new Map();

    validate<TInput = unknown, TOutput = TInput, TOptions = unknown>(
        data: TInput,
        schemaName: string,
        options?: TOptions
    ): Promise<Validation<ViolationsList, TOutput>> {
        const validation = this.getValidation<TInput, TOutput>(schemaName)

        if (validation.isNone()) {
            return Promise.reject(
                new Error(`There is no validation registered for schema: ${schemaName}`)
            );
        }

        return Promise.resolve(validation.some()(data, options));
    }

    getValidation<TInput = unknown, TOutput = TInput>(schemaName: string): Maybe<ValidationFunction<TInput, TOutput>> {
        return Maybe.fromFalsy(this.validations.get(schemaName) as ValidationFunction<TInput, TOutput> | undefined);
    }

    validateOrReject<TInput = any, TResult = TInput, TOptions = unknown>(data: TInput, schemaName: string, options?: TOptions, errorMessage = 'Invalid data'): Promise<TResult> {
        return this.validate<TInput, TResult>(data, schemaName, options)
            .then(result => {
                if (result.isFail()) {
                    throw new ValidatorError(result.fail(), errorMessage);
                }
                return result.success();
            });
    }

    registerValidationForSchema(schemaName: string, validation: SchemaValidation<unknown, unknown, unknown>): this {
        this.validations.set(schemaName, SchemaValidation.toValidationFunction(schemaName, validation));
        return this;
    }

    hasValidation(schemaName: string) {
        return this.validations.has(schemaName);
    }
}
