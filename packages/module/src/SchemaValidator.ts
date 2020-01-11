import {SchemaValidation} from "alpha-validator";

export interface SchemaValidator<T = any> {
    validate: SchemaValidation<T>
}