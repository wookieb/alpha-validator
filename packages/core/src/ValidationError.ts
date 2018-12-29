import {ViolationsList} from "./ViolationsList";

export class ValidationError extends Error {
    constructor(readonly violations: ViolationsList, message: string) {
        super(message);
        this.message = message;
        this.name = 'ValidationError';
    }
}