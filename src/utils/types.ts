export type Comparator<T> = (a: T, b: T) => -1 | 1 | 0 
export type ComparatorEquality<T> = (a: T, b: T) => boolean

export type NonEmptyArray<T> = [T, ...T[]]