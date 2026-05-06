type T_Comparable = Record<string, unknown>;

const objectsAreEquals = (
    object1: T_Comparable,
    object2: T_Comparable,
    strictDataType = true,
): boolean => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !objectsAreEquals(val1, val2, strictDataType)) ||
            (!areObjects && (strictDataType ? val1 !== val2 : val1 != val2))
        ) {
            return false;
        }
    }
    return true;
}

function isObject(object: unknown): object is T_Comparable {
    return object != null && typeof object === 'object';
}

export default objectsAreEquals;
