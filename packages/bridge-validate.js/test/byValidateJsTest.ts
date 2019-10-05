import {byValidateJs} from "@src/index";

describe('byValidateJs', () => {
    const SCHEMA = 'foo';

    it('no violations', () => {
        return expect(
            byValidateJs({
                name: {
                    presence: true,
                    length: {
                        minimum: 5
                    }
                }
            })({
                name: 'wookieb'
            }, SCHEMA)
        )
            .resolves
            .toBeUndefined();
    });

    it('simple validation', () => {
        return expect(
            byValidateJs({
                name: {
                    presence: true,
                    length: {
                        minimum: 5
                    }
                }
            })({
                name: 'foo'
            }, SCHEMA)
        )
            .resolves
            .toMatchSnapshot();
    });

    it('nested validation', () => {
        return expect(
            byValidateJs({
                'profile.name': {
                    presence: true,
                    length: {
                        minimum: 5
                    }
                }
            })({
                profile: {
                    name: 'foo'
                }
            }, SCHEMA)
        )
            .resolves
            .toMatchSnapshot();
    })
});