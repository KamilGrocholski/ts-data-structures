interface StackFixedOperations<T> {
    push(data: T): void
    pop(): T | undefined
    peek(): T | undefined
    isEmpty(): boolean
    isFull(): boolean
    clear(): void
}

export class StackFixed<T> implements StackFixedOperations<T> {
    private _storage: (T | undefined)[]
    public size: number
    public capacity: number

    constructor(capacity: number) {
        this._storage = new Array(capacity)
        this.size = 0
        this.capacity = capacity
    }

    push(data: T): void {
        if (this.isFull()) return 
        this.size++
        this._storage[this.size] = data
    }

    pop(): T | undefined {
        if (this.isEmpty()) return
        this.size-- 
        const popped = this._storage[this.size]
        this._storage[this.size] = undefined 

        return popped
    }

    peek(): T | undefined {
        return this._storage[this.size - 1]
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    isFull(): boolean {
        return this.size === this.capacity
    }

    clear(): void {
        this._storage = new Array(this.capacity)
        this.size = 0
    }
}