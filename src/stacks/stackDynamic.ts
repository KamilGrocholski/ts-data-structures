interface StackDynamicOperations<T> {
    push(data: T): void
    pop(): T | undefined
    peek(): T | undefined
    isEmpty(): boolean
    from(data: T[]): void 
    toArray(): T[]
    clear(): void
}

export class StackDynamic<T> implements StackDynamicOperations<T> {
    private _storage: T[]
    public size = 0

    constructor(initialStorage?: T[]) {
        this._storage = initialStorage ?? []
    }

    push(data: T): void {
        this.size++
        this._storage.push(data)
    }

    pop(): T | undefined {
        if (this.isEmpty()) return
        this.size-- 
        return this._storage.pop()
    }

    peek(): T | undefined {
        return this._storage[this.size - 1]
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    from(data: T[]) {
        this._storage = data
        this.size = data.length
    }

    toArray(): T[] {
        return this._storage
    }

    clear(): void {
        this._storage = []
        this.size = 0
    }
}