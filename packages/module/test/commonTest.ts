import {assertValidSchemaNames} from "@src/common";

describe('common', () => {
    describe('assertValidSchemaNames', () => {
        describe('failure', () => {
            describe('requires schema name', () => {
                it('to be a non-blank string', () => {
                    expect(() => {
                        assertValidSchemaNames(['   '])
                    })
                        .toThrowErrorMatchingSnapshot();
                });

                it('to be a non-empty string', () => {
                    expect(() => {
                        assertValidSchemaNames([''])
                    })
                        .toThrowErrorMatchingSnapshot();
                });

                it('to be a string', () => {
                    expect(() => {
                        assertValidSchemaNames([true] as any)
                    })
                        .toThrowErrorMatchingSnapshot();
                });
            });
        });

        it('success', () => {
            expect(() => {
                assertValidSchemaNames(['schema', 'valid1'])
            })
                .not
                .toThrow();
        });
    });
});