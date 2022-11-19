interface ArrayFixedOperations<T> {
    insertFree(value: T): void
    insertAt(index: number, value: T): void

    // removeOne(value: T): number
    // removeMany(value: T): number[]
    removeAt(index: number): T | undefined 

    at(index: number): T | undefined
    // findOne(value: T): number
    // findMany(value: T): number[]

    swap(indexA: number, indexB: number): void

    some(callback: (value: T | undefined, index: number, array: (T | undefined)[]) => boolean): number
    forEach(callback: (value: T | undefined, index: number, array: (T | undefined)[]) => void): void

    getFree(): number[]
    getOccupied(): number[]

    toArray(): T[]
    toJSON(): string

    clear(): void
}

export class ArrayFixed<T> implements ArrayFixedOperations<T> {
    private _storage: (T | undefined)[]
    public capacity: number
    public size = 0

    constructor(capacity: number) {
        this.capacity = capacity
        this._storage = new Array(capacity)
    }

    swap(indexA: number, indexB: number): void {
        if (indexA >= this.capacity || indexA < 0) throw new Error('INDEX A IS OUT OF BOUNDS')
        if (indexB >= this.capacity || indexB < 0) throw new Error('INDEX B IS OUT OF BOUNDS')

        const temp = this._storage[indexB]
        this._storage[indexB] = this._storage[indexA]
        this._storage[indexA] = temp 
    }

    some(callback: (value: T | undefined, index: number, array: (T | undefined)[]) => boolean): number {
        for (let i = 0; i < this.capacity; i++) {
            if (callback(this._storage[i], i, this._storage)) return i
        }

        return -1 
    }

    insertFree(value: T): void {
        const index = this.some(v => v === undefined)

        if (index != -1) {
            this._storage[index] = value
            this.size++
        }
    }

    insertAt(index: number, value: T): void {
        if (index >= this.capacity || index < 0) throw new Error('OUT OF BOUNDS')
        if (this._storage[index] === undefined) this.size++
        this._storage[index] = value
    }
    
    removeAt(index: number): T | undefined {
        if (index >= this.capacity || index < 0) throw new Error('OUT OF BOUNDS')
        const val = this._storage[index]
        if (val !== undefined) this.size--
        delete this._storage[index]

        return val
    }

    at(index: number): T | undefined {
        if (index >= this.capacity || index < 0) throw new Error('OUT OF BOUNDS')
        return this._storage[index]
    }

    forEach(callback: (value: T | undefined, index: number, array: (T | undefined)[]) => void): void {
        for (let i = 0; i < this.capacity; i++) callback(this._storage[i], i, this._storage)
    }

    getFree(): number[] {
        if (this.size === 0) return []

        const indexes = new Array(this.capacity - this.size)
        let n = 0
        for (let i = 0; i < this.capacity; i++) {
            if (!this._storage[i]) {
                indexes[n] = i
                n++
            }
        }

        return indexes
    }

    getOccupied(): number[] {
        if (this.size === 0) return []

        const indexes = new Array(this.size)
        let n = 0
        for (let i = 0; i < this.capacity; i++) {
            if (this._storage[i]) {
                indexes[n] = i
                n++
            }
        }

        return indexes
    }

    toArray(): T[] {
        if (this.size === 0) return []

        const arrData = new Array(this.size)
        let n = 0 
        for (let i = 0; i < this.capacity; i++) {
            if (this._storage[i]) {
                arrData[n] = this._storage[i]
                n++
            }
        }

        return arrData
    }

    toJSON(): string {
        return JSON.stringify(this._storage)
    }

    clear(): void {
        this._storage = new Array(this.capacity)
        this.size = 0
    }
}

