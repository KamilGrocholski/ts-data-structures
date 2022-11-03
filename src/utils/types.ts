export type Comparator<T> = (a: T, b: T) => -1 | 1 | 0 

export type NonEmptyArray<T> = [T, ...T[]]