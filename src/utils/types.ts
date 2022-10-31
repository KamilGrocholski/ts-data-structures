export type Comparator<T> = (d1: T, d2: T) => boolean

export type NonEmptyArray<T> = [T, ...T[]]