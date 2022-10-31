import { Storage } from "./base";

interface QueueDynamicOperations<T> {
    enqueue(data: T): void
    dequeue(): T | undefined
    peek(): T | undefined
    isEmpty(): boolean
    toArray(): T[]
    toJSON(): string
    clear(): void
}

export class QueueDynamic<T> extends Storage<T> implements QueueDynamicOperations<T> {
    
    enqueue(data: T): void {
        this.storage.push(data)    
    }

    dequeue(): T | undefined {
        return this.storage.pop()
    }

    peek(): T | undefined {
        return this.storage[this.size - 1]
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    toArray(): T[] {
        return this.storage
    }

    toJSON(): string {
        return JSON.stringify(this.storage)
    }

    clear(): void {
        this.storage = []
    }
}