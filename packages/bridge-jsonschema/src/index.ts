import Ajv from 'ajv';
import {Schema} from "ajv/lib/types";
import {JSONSchemaType} from "ajv/lib/types/json-schema";
import {Either, ViolationsList} from 'alpha-validator';
import {left, right} from '@sweet-monads/either';

const ajv = new Ajv();

function instancePathToPath(instancePath: string): string[] | undefined {
	const path = instancePath.split('/').filter(x => x);
	return path.length ? path : undefined;
}

export function byJsonSchema<TData>(schema: Schema | JSONSchemaType<unknown>) {
	const validator = ajv.compile(schema);
	return (data: TData): Either<ViolationsList, TData> => {
		if (validator(data)) {
			return right(data);
		}
		const violations = ViolationsList.create();
		for (const error of validator.errors!) {
			violations.addViolation(
				error.message!,
				instancePathToPath(error.instancePath)
			);
		}

		return left(violations);
	}
}
