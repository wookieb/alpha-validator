import {byJsonSchema} from "@src/index";

describe('index', () => {
	const validation = byJsonSchema({
		type: 'object',
		properties: {
			name: {
				type: 'object',
				required: ['firstName', 'lastName'],
				additionalProperties: false,
				properties: {
					firstName: {
						type: 'string'
					},
					lastName: {
						type: 'string'
					},
				}
			},
			age: {
				type: 'number'
			}
		}
	});

	const VALID_INPUT = {
		name: {firstName: 'Tom', lastName: 'Foo'},
		age: 24
	};

	it('returns input object on success', () => {
		const result = validation(VALID_INPUT);

		expect(result.value)
			.toEqual(VALID_INPUT);
	});


	it('returns fail when invalid', () => {
		const result = validation({
			name: {lastName: 'Foo'},
			age: 24
		});

		expect(result.value)
			.toMatchSnapshot();
	});
});
