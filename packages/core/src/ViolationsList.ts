import {Validation} from "monet";
import {ValidationResult} from "./ValidationResult";

export interface Violation {
    path?: string[];
    message: string;
}

export function createViolation(message: string, path?: string[] | string) {
    return {
        path: path === undefined ? undefined : (Array.isArray(path) ? path : [path]),
        message
    }
}

function matchesPath(path: string[], searchPath: string[]) {
    return searchPath.every((entry, index) => path[index] === entry);
}

export class ViolationsList {
    private violations: Violation[] = [];

    static create() {
        return new ViolationsList();
    }

    addViolation(message: string, path?: string[] | string): this;
    addViolation(violation: Violation): this;
    addViolation(messageOrViolation: string | Violation, path?: string[] | string): this {
        this.violations.push(typeof messageOrViolation === 'string' ? createViolation(messageOrViolation, path) : messageOrViolation);
        return this;
    }

    mergeAtPath(
        path: string[] | string,
        violation: ValidationResult<unknown>
    ) {
        const finalPath = Array.isArray(path) ? path : [path];

        this.violations.push(
            ...this.extractViolationForMerge(violation)
                .map(violation => {
                    const newPath = finalPath.concat(violation.path ?? []);
                    return {
                        ...violation,
                        path: newPath
                    };
                })
        );
        return this;
    }

    merge(violation: ValidationResult<unknown>): this {
        this.violations.push(...this.extractViolationForMerge(violation));
        return this;
    }

    private extractViolationForMerge(violation: Violation | ViolationsList | undefined | Validation<ViolationsList, unknown>): Violation[] {
        if (violation) {
            if (violation instanceof ViolationsList) {
                return violation.getViolations();
            } else if (Validation.isInstance(violation)) {
                if (violation.isFail()) {
                    return violation.fail().getViolations();
                }
            } else {
                return [violation];
            }
        }

        return [];
    }

    getForPath(path: string[] | string): Violation[] {
        const realPath = Array.isArray(path) ? path : [path];
        return this.violations.filter(v => v.path && matchesPath(v.path, realPath));
    }

    getViolations() {
        return this.violations;
    }

    getListOrNothing() {
        if (this.getViolations().length) {
            return this;
        }
        return undefined;
    }
}
