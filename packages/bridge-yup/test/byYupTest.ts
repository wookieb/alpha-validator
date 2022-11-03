import {byYup} from "@src/index";
import * as yup from 'yup';
import {ViolationsList} from "alpha-validator";
import {left, right} from "@sweet-monads/either";

describe('byYup', () => {
    const SCHEMA = 'foo';

    it('no violations', () => {
        const data = {
            name: 'wookieb   '
        };

        return expect(
            byYup(
                yup.object()
                    .shape({
                        name: yup.string()
                            .trim()
                            .min(5)
                    })
            )(data, SCHEMA)
        )
            .resolves
            .toEqual(
                right({
                    name: 'wookieb'
                })
            );
    });

    it('simple validation', () => {
        const data = {
            name: 'foo'
        };
        return expect(
            byYup(
                yup.object()
                    .shape({
                        name: yup.string()
                            .trim()
                            .min(5)
                    })
            )(data, SCHEMA)
        )
            .resolves
            .toEqual(
                left(
                    ViolationsList.create()
                        .addViolation({
                            message: 'name must be at least 5 characters',
                            path: ['name']
                        })
                )
            );
    });

    it('nested validation', () => {
        const data = {
            profile: {
                name: 'foo'
            }
        };

        return expect(
            byYup(
                yup.object()
                    .shape({
                        profile: yup.object()
                            .shape({
                                name: yup.string().min(5)
                            })
                    })
            )(data, SCHEMA)
        )
            .resolves
            .toEqual(
                left(
                    ViolationsList.create()
                        .addViolation({
                            message: 'profile.name must be at least 5 characters',
                            path: ['profile', 'name']
                        })
                )
            );
    })
});
