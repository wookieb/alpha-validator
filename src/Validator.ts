import {Ajv, ErrorObject, KeywordDefinition} from "ajv";
import ValidationError, {ValidationViolation} from "./ValidationError";

// due to invalid typings for ajv I need to do this trick
const AjvValidator = require('ajv');

export default class Validator {
    constructor(private ajv?: Ajv) {
        this.ajv = ajv || new AjvValidator({
            allErrors: true
        });
    }

    addSchema(schema: object) {
        if (!('$id' in schema)) {
            throw new Error('Missing "$id" for schema');
        }
        this.ajv.addSchema(schema);
    }

    addKeyword(name: string, definition: KeywordDefinition) {
        this.ajv.addKeyword(name, definition);
    }

    async checkIsValid(object: any, schemaRef: string) {
        const validator = this.ajv.getSchema(schemaRef);
        if (!validator) {
            throw new Error(`No schema registered for ref: ${schemaRef}`)
        }

        const result = await validator(object);
        if (!result) {
            return this.errorsToViolations(validator.errors);
        }
    }

    async assertValid(object: any, schemaRef: string, errorMessage?: string) {
        const errors = await this.checkIsValid(object, schemaRef);
        if (errors) {
            throw new ValidationError(errors, errorMessage);
        }
    }

    private errorsToViolations(errors: ErrorObject[]) {
        return errors.map(e => {
            return <ValidationViolation>{
                message: e.message,
                path: e.dataPath
            };
        })
    }
}