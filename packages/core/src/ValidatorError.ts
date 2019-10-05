import {ViolationsList} from "./ViolationsList";

export class ValidatorError extends Error {
    constructor(readonly violations: ViolationsList, message: string) {
        super(message);
        this.message = message;
        this.name = 'ValidatorError';
    }
}