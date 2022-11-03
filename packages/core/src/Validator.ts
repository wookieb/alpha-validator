import {Violation, ViolationsList} from "./ViolationsList";
import {ValidatorError} from "./ValidatorError";
import {SchemaValidation} from "./SchemaValidation";
import {ValidationFunction} from "./ValidationFunction";
import {Maybe, fromNullable} from "@sweet-monads/maybe";
import {Either} from "@sweet-monads/either";

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
    ): Promise<Either<ViolationsList, TOutput>> {
        const validation = this.getValidationFunction<TInput, TOutput>(schemaName)

        if (validation.isNone()) {
            return Promise.reject(
                new Error(`There is no validation registered for schema: ${schemaName}`)
            );
        }

        return Promise.resolve(validation.value(data, options));
    }

    getValidationFunction<TInput = unknown, TOutput = TInput>(schemaName: string): Maybe<ValidationFunction<TInput, TOutput>> {
        return fromNullable(this.validations.get(schemaName) as ValidationFunction<TInput, TOutput> | undefined);
    }

    validateOrReject<TInput = any, TResult = TInput, TOptions = unknown>(data: TInput, schemaName: string, options?: TOptions, errorMessage = 'Invalid data'): Promise<TResult> {
        return this.validate<TInput, TResult>(data, schemaName, options)
            .then(result => {
                if (result.isLeft()) {
                    throw new ValidatorError(result.value, errorMessage);
                }
                return result.value;
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
