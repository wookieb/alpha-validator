import * as yup from 'yup';
import {SchemaValidationResult, Validation, ViolationsList} from 'alpha-validator';

export function byYup(schema: yup.Schema<any>, validateOptions: yup.ValidateOptions = {abortEarly: false}) {
    return (data: any, schemaName: string, opts?: { yup?: yup.ValidateOptions }): Promise<SchemaValidationResult<any>> => {
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
                            error.path.split('.')
                        )
                    }
                    return list;
                }
                throw e;
            })
    }
}