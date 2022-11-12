interface StackFixedOperations<T> {
    push(data: T): void
    pop(): T | undefined
    peek(): T | undefined
    isEmpty(): boolean
    isFull(): boolean
    from(data: T[]): void
    toArray(): T[]
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
        this._storage[this.size] = data
        this.size++
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

    from(data: T[]): void {
        if (data.length > this.capacity) throw new Error()

        this._storage = data
        this.size = data.length
    }

    toArray(): T[] {
        const dataArr = new Array(this.size)

        let n = 0
        for (let i = 0; i < this.size; i++) {
            dataArr[n] = this._storage[i]
            n++
        }

        return dataArr
    }

    clear(): void {
        this._storage = new Array(this.capacity)
        this.size = 0
    }
}