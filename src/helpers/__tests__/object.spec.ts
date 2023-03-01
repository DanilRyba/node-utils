import { assignWithFilter, filter, find, isNonEmptyObject, isObject } from "../object";

const nonObjects = [
    undefined,
    null,
    1,
    'string',
    [],
    () => {}
];

describe('helpers -> object', () => {
    describe('validation', () => {
        const convertedNonObjects = nonObjects.map(v => { return { v, exp: false } });

        describe('isObject', () => {
            it.each([
                ...convertedNonObjects,
                { v: {}, exp: true }
            ])(`When function param "target" is "$v", then function must return "$exp"`, ({ v, exp }) => {
                const result = isObject(v);
    
                expect(result).toBe(exp);
            });
        });

        describe('isNonEmptyObject', () => {
            it.each([
                ...convertedNonObjects,
                { v: {}, exp: false },
                { v: { nonEmpty: 1 }, exp: true }
            ])(`When function param "target" is "$v", then function must return "$exp"`, ({ v, exp }) => {
                const result = isNonEmptyObject(v);
    
                expect(result).toBe(exp);
            });
        });
    });

    describe('search', () => {
        describe('find', () => {
            it.each(
                nonObjects,
            )(`When function param "source" is not "object"(%p), then function must return "null"`, (value) => {
                const result = find(value, () => { return true; });
    
                expect(result).toBeNull();
            });

            it('When function param "findFn" is not "function", then function must return "null"', () => {
                const result = find({}, null);

                expect(result).toBeNull();
            });

            it('When the function parameter "source"({ a: 1 }) does not have a property that satisfies the "findFn" condition("v > 2"), the function must return the value "undefined"', () => {
                const result = find({ a: 1 }, (v) => v > 2);

                expect(result).toBeUndefined();
            });

            it('When the function parameter "source"({ a: 1, b: 2, c: 3 }) has a property that satisfies the condition "findFn"("v > 2"), the function must return the value "["c", 3]"', () => {
                const result = find({ a: 1, b: 2, c: 3 }, (v) => v > 2);

                expect(result).toStrictEqual(['c', 3]);
            });
        });
    })

    describe('manipulators', () => {
        describe('filter', () => {
            it.each(
                nonObjects,
            )(`When function param "source" is not "object"(%p), then function must return "null"`, (value) => {
                const result = filter(value, () => { return true; });
    
                expect(result).toBeNull();
            });

            it('When function param "filterFn" is not "function", then function must return "null"', () => {
                const result = filter({}, null);

                expect(result).toBeNull();
            });

            it('When function param "source" is "{ a: 1, b: 2, c: 3, d: 4, e: 5}" and we need to get object with only numbers greater than 2,then function must return "{ c: 3, d: 4, e: 5 }"', () => {
                const result = filter({ a: 1, b: 2, c: 3, d: 4, e: 5}, (v => v > 2));

                expect(result).toStrictEqual({ c: 3, d: 4, e: 5 });
            });
        });

        describe('assignWithFilter', () => {
            it.each(
                nonObjects,
            )(`When function param "source" is not "object"(%p), then function must return "null"`, (value) => {
                const result = assignWithFilter(value, () => { return true; });
    
                expect(result).toBeNull();
            });

            it('When function param "filterFn" is not "function", then function must return "null"', () => {
                const result = assignWithFilter({}, null);

                expect(result).toBeNull();
            });

            it('When function param "targets"([{ b: 4 }, { c: 3 }, [1], "string"]) has non object items, then function must skipped them and return "object"({ b: 4, c: 3 }) without these items', () => {
                const result = assignWithFilter({}, (v) => v > 2, { b: 4 }, { c: 3 }, [1], 'string');

                expect(result).toStrictEqual({ b: 4, c: 3 });
            });

            it('When the "source" function parameter is "{ a: 1, b: 2 }" and we need to combine with "targets"({ b: 4 }, { c: 3 }, { g: 10 }, { s: 0 }, { r: -1 }) that satisfy the "fn"(>2) condition, then the function should return "object"({ b: 4, c: 3, g: 10 })', () => {
                const result = assignWithFilter({ d: 19, l: 77 }, (v) => v > 2, { b: 4 }, { c: 3 }, { g: 10 }, { s: 0 }, { r: -1 });

                expect(result).toStrictEqual({ d: 19, l: 77, b: 4, c: 3, g: 10 });
            });
        });
    });
});
