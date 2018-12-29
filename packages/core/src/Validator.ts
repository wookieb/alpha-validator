import {Violation, ViolationsList} from "./ViolationsList";
import {ValidationError} from "./ValidationError";

export type OptionalPromise<T> = Promise<T> | T;
export type Validation = (data: any, schemaName: string, options?: any) => OptionalPromise<Violation | ViolationsList | undefined>;

export function isViolation(data: any): data is Violation {
    return typeof data === 'object' && 'message' in data;
}

export function isPromise(data: any): data is Promise<any> {
    return typeof data === 'object' && 'then' in data;
}

export class Validator {
    private validations: Map<string, Validation> = new Map();

    validate(data: any, schemaName: string, options?: any): Promise<ViolationsList | undefined> {
        const validation = this.validations.get(schemaName);
        if (!validation) {
            return Promise.reject(
                new Error(`There is no validation registered for schema: ${schemaName}`)
            );
        }
        const result = validation(data, schemaName, options);
        if (result === undefined || result instanceof ViolationsList) {
            return Promise.resolve(result as ViolationsList | undefined);
        } else if (isViolation(result)) {
            return Promise.resolve(ViolationsList.create().addViolation(result));
        } else if (isPromise(result)) {
            return result.then(r => {
                if (r === undefined || r instanceof ViolationsList) {
                    return r as ViolationsList | undefined;
                } else if (isViolation(r)) {
                    return ViolationsList.create().addViolation(r);
                } else {
                    throw new Error(
                        `Invalid result from validation from schema: ${schemaName}. Expected: ViolationList, Violation object or undefined`
                    );
                }
            })
        } else {
            return Promise.reject(
                new Error(
                    `Invalid result from validation from schema: ${schemaName}. Expected: ViolationList, Violation object, undefined or Promise`
                )
            );
        }
    }

    validateOrReject(data: any, schemaName: string, options?: any, errorMessage = 'Invalid data'): Promise<void> {
        return this.validate(data, schemaName, options)
            .then(result => {
                if (result instanceof ViolationsList) {
                    throw new ValidationError(result, errorMessage);
                }
            });
    }

    registerValidation(schemaName: string, validation: Validation): this {
        this.validations.set(schemaName, validation);
        return this;
    }

    hasValidation(schemaName: string) {
        return this.validations.has(schemaName);
    }
}