import { ObjectFilterFunction } from "../types/helpers/object";

// validation
export function isObject(target: unknown): boolean {
    return target !== null && typeof target === 'object' && !Array.isArray(target);
}

export function isNonEmptyObject(target: unknown): boolean {
    return isObject(target) && Object.keys(target).length > 0;
}

// manipulators
export function find<T extends Object>(source: T, findFn: ObjectFilterFunction): [string, unknown] | undefined {
    if (!isObject(source) || typeof findFn !== 'function') {
        return null;
    }

    const result = Object.entries(source).find(v => findFn(v[1]));
    return result;
}

export function filter<T extends Object>(source: T, filterFn: ObjectFilterFunction): Partial<T> {
    if (!isObject(source) || typeof filterFn !== 'function') {
        return null;
    }

    const sourceEntries = Object.entries(source);
    const filtered = sourceEntries.reduce((result, currentValue) => {
        const [key, value] = currentValue;

        if (filterFn(value)) {
            result[key] = value;
        }

        return result;
    }, {} as Partial<T>);

    return filtered;
}

export function assignWithFilter<T extends Object>(source: T, filterFn: ObjectFilterFunction, ...targets: Object[]) {
    if (!isObject(source) || typeof filterFn !== 'function') {
        return null;
    }

    const targetsValues = Object.values(targets);
    const cloned = targetsValues.reduce((result, currentValue) => {
        if (!isObject(currentValue)) {
            return result;
        }

        const filtered = filter(currentValue, filterFn);
        if (filtered) {
            result = { ...result, ...filtered };
        }

        return result;
    }, source);

    return cloned;
}
