import * as yup from 'yup';
import {Validation, ViolationsList} from 'alpha-validator';
import {ValidateOptions} from 'yup/lib/types';

export function byYup(schema: yup.BaseSchema<any>, validateOptions: ValidateOptions = {abortEarly: false}) {
    return (data: any, schemaName: string, opts?: { yup?: ValidateOptions }): Promise<Validation<ViolationsList, any>> => {
        return schema.validate(data, {
            ...(validateOptions || {}),
            ...(opts && opts.yup || {})
        })
            .then(result => {
                return Validation.Success<ViolationsList, any>(result);
            })
            .catch(e => {
                if (yup.ValidationError.isError(e)) {
                    const list = ViolationsList.create();
                    for (const error of e.inner) {
                        list.addViolation(
                            error.message,
                            error.path ? error.path.split('.') : []
                        )
                    }
                    return Validation.Fail(list);
                }
                throw e;
            })
    }
}
