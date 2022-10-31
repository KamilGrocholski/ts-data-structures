export abstract class Storage<T> {
    protected storage: T[] = []

    get size(): number {
        return this.storage.length
    }

    abstract isEmpty(): boolean
}
