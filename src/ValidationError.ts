export default class ValidationError extends Error {
    constructor(public readonly errors: ValidationViolation[], message?: string) {
        super(message || 'Invalid data');
        this.name = 'ValidationError';

        Object.freeze(this.errors);
    }
}

export interface ValidationViolation {
    message: string;
    path: string
}