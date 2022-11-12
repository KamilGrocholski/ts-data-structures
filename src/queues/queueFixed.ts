interface QueueFixedOperation<T> {
    enqueue(data: T): void
    dequeue(): T | undefined
    peek(): T | undefined
    isEmpty(): boolean
    isFull(): boolean
    toArray(): (T | undefined)[]
    toJSON(): string
    clear(): void
}

export class QueueFixed<T> implements QueueFixedOperation<T> {
    public capacity: number
    public size: number
    private _storage: (T | undefined)[]

    constructor(capacity: number) {
        this.capacity = capacity
        this._storage = new Array(capacity)
        this.size = 0
    }

    enqueue(data: T): void {
        if (this.isFull()) return 
        this._storage[this.size] = data    
        this.size++
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) return 
        this.size--
        const dequeued = this._storage[this.size] 
        this._storage[this.size] = undefined

        return dequeued
    }

    peek(): T | undefined {
        return this._storage[this.size - 1]
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    isFull(): boolean {
        return this.capacity === this.size
    }

    toArray(): (T | undefined)[] {
        const dataArr = new Array(this.size)

        for (let i = 0; i < this.size; i++) {
            dataArr[i] = this._storage[i]
        }

        return dataArr
    }

    toJSON(): string {
        return JSON.stringify(this._storage)
    }

    clear(): void {
        this._storage = this._storage.map(() => undefined)
        this.size = 0
    }
}
