import {ValidationResult} from "./ValidationResult";
import {OptionalPromise} from "./types";
import {ValidationFunction} from "./ValidationFunction";
import {isPromise} from "./Validator";

export interface SchemaValidation<TInput, TOutput = TInput, TOptions = unknown> {
    (data: TInput, schemaName: string, options?: TOptions): OptionalPromise<ValidationResult<TOutput>>
}

export namespace SchemaValidation {
    export function toValidationFunction<TInput, TOutput, TOptions>(schemaName: string,
                                                                    schemaValidation: SchemaValidation<TInput, TOutput, TOptions>): ValidationFunction<TInput, TOutput, TOptions> {
        return (data: TInput, options?: TOptions) => {
            const validationResult = schemaValidation(data, schemaName, options);

            if (isPromise(validationResult)) {
                return validationResult.then(r => {
                    return ValidationResult.toValidation<TOutput>(r, data as unknown as TOutput);
                })
            }

            return ValidationResult.toValidation<TOutput>(validationResult, data as unknown as TOutput);
        }
    }
}
