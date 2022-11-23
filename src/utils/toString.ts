export type ToString<T> = (thing: T) => string

export const defaultToString: ToString<any> = (thing) => {
    return `${thing}`
}