import {ViolationsList} from "@src/index";

function createViolation(path: string[]) {
    return {
        message: Math.random() + '',
        path
    };
}

describe('ViolationsList', () => {

    let list: ViolationsList;

    const VIOLATION_1 = createViolation(['name']);
    const VIOLATION_2 = createViolation(['profile', 'firstName']);
    const VIOLATION_3 = createViolation(['super.name']);
    const VIOLATION_4 = createViolation(['deep', '0', 'prop', 'search']);
    const VIOLATION_5 = createViolation(['deep', '1', 'prop', 'search']);

    beforeEach(() => {
        list = ViolationsList.create();
        list.addViolation(VIOLATION_1);
        list.addViolation(VIOLATION_2);
        list.addViolation(VIOLATION_3);
        list.addViolation(VIOLATION_4);
        list.addViolation(VIOLATION_5);
    });

    describe('adding violation', () => {
        const MESSAGE = 'foo';
        const PATH = ['deep', 'property'];

        beforeEach(() => {
            list = ViolationsList.create();
        });

        it('without path', () => {
            expect(list.addViolation(MESSAGE))
                .toStrictEqual(list);

            expect(list.getViolations()[0])
                .toEqual({
                    message: MESSAGE,
                    path: undefined
                });
        });

        it('with path', () => {
            expect(list.addViolation(MESSAGE, PATH[0]))
                .toStrictEqual(list);

            expect(list.getViolations()[0])
                .toEqual({
                    message: MESSAGE,
                    path: [PATH[0]]
                });
        });

        it('with nested path', () => {
            expect(list.addViolation(MESSAGE, PATH))
                .toStrictEqual(list);

            expect(list.getViolations()[0])
                .toEqual({
                    message: MESSAGE,
                    path: PATH
                });
        });
    });

    describe('getting for path', () => {
        it('simple string path', () => {
            expect(list.getForPath('name'))
                .toEqual(
                    expect.arrayContaining([VIOLATION_1])
                );
        });

        it('path with dot', () => {
            expect(list.getForPath('super.name'))
                .toEqual(
                    expect.arrayContaining([VIOLATION_3])
                );
        });

        it('deep path (not full)', () => {
            expect(list.getForPath(['deep']))
                .toEqual(
                    expect.arrayContaining([VIOLATION_4, VIOLATION_5])
                );
        });

        it('deep path (full)', () => {
            expect(list.getForPath(['deep', '0']))
                .toEqual(
                    expect.arrayContaining([VIOLATION_4])
                );
        });
    });

    it('getting all', () => {
        expect(list.getViolations())
            .toEqual(
                expect.arrayContaining([
                    VIOLATION_1,
                    VIOLATION_2,
                    VIOLATION_3,
                    VIOLATION_4,
                    VIOLATION_5
                ])
            );
    });
});