
import {Violation, ViolationsList} from "./ViolationsList";
import {Validation} from "monet";

export type OptionalPromise<T> = Promise<T> | T;

export interface SchemaValidation<T> {
    (data: any, schemaName: string, options?: any): OptionalPromise<SchemaValidation.Result<T>>
}

export namespace SchemaValidation {
    export type Result<T> = ViolationsList | undefined | Violation | Validation<ViolationsList, T>
}