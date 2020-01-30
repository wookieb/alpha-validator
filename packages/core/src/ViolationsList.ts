import {Validation} from "monet";

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

    merge(violation: Violation | ViolationsList | undefined | Validation<ViolationsList, any>): this {
        if (violation) {
            if (violation instanceof ViolationsList) {
                this.violations.push(...violation.getViolations());
            } else if (Validation.isInstance(violation)) {
                if (violation.isFail()) {
                    this.violations.push(...violation.fail().getViolations());
                }
            } else {
                this.violations.push(violation);
            }
        }
        return this;
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