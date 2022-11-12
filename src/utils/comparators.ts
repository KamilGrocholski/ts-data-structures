/**
 * (a > b) => -1;
 * (a < b) => 1;
 * (a === b) => 0; 
 * @param a 
 * @param b 
 * @returns `-1 | 1 | 0`
 */
export const DEFAULT_COMPARATOR = <T>(a: T, b: T): -1 | 1 | 0 => {
    if (a > b) return - 1
    if (a < b) return 1
    return 0
}

export const DEFAULT_COMPARATOR_EQUALITY = <T>(a: T, b: T): boolean => a === b
