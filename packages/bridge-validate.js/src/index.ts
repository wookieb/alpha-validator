import {async} from 'validate.js';
import {ViolationsList} from "alpha-validator";

export function byValidateJs(constraints: any) {
    return (data: any, schemaName: string, options?: { validatejs: any }) => {
        return async(data, constraints, {
            ...(options && options.validatejs || {}),
            format: 'detailed'
        })
            .then(() => {
                return void 0;
            })
            .catch(errors => {
                if (Array.isArray(errors)) {
                    const validationList = ViolationsList.create();
                    for (const error of errors) {
                        validationList.addViolation(
                            error.error,
                            error.attribute.split('.')
                        );
                    }
                    return validationList;
                }
                return errors;
            })
    };
}