import * as yup from 'yup';
import {ViolationsList} from 'alpha-validator';
import {ValidateOptions} from 'yup/lib/types';
import {Either, left, right} from "@sweet-monads/either";


export function byYup<TInput, TOutput = TInput>(schema: yup.BaseSchema<any>, validateOptions: ValidateOptions = {abortEarly: false}) {
    return (data: TInput, schemaName: string, opts?: { yup?: ValidateOptions }): Promise<Either<ViolationsList, TOutput>> => {
        return schema.validate(data, {
            ...(validateOptions || {}),
            ...(opts && opts.yup || {})
        })
            .then(result => {
                return right<ViolationsList, TOutput>(result);
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
                    return left(list);
                }
                throw e;
            })
    }
}
