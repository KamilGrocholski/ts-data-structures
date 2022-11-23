import { LinkedListSingle } from "../linkedLists";
import { BaseHashTable, BaseHashTableConfig, Entry } from "./base";

interface HashTableChainingOperations<K, V> {
    hashCode(key: K): number

    // put(key: K, value: V): boolean

    // get(key: K): V | undefined

    // // remove(key: K): V | undefined

    // // isEmpty(): boolean

    // readonly size: number

    // // clear(): void

    // // toJSON(): string
}

export class HashTableChaining<K, V> extends BaseHashTable<K, V> implements HashTableChainingOperations<K, V> {
    public buckets: Record<number, InstanceType<typeof LinkedListSingle<Entry<K, V>>>> = {}

    constructor(config: BaseHashTableConfig<K, V> = {}) {
        super(config)
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i] = new LinkedListSingle<Entry<K, V>>()
        }
    }

    hashCode(key: K): number {
        let hash = 0

        if (typeof key === 'number') return hash

        const keyString = this.toString(key)

        for (let i = 0; i < keyString.length; i++) {
            hash += keyString.charCodeAt(i)
        }

        return hash % this.capacity
    }

    // put(key: K, value: V): boolean {
    //     if (key !== null && value !== null) {
   
    //         const position = this.hashCode(key)

    //         this.buckets[position].appendOne(new Entry(key, value))
            
    //         return true
    //     }

    //     return false
    // }

    // get(key: K): V | undefined {
    //     const bucket = this.buckets[this.hashCode(key)]
        
    //     let current = bucket.head
    //     while (current) {
    //         if (current.data.key === key) {
    //             return current.data.value
    //         }
    //         current = current.next
    //     }

    //     return undefined
    // }

    // get size(): number {
    //     let size = 0

    //     Object.values(this.buckets).forEach(bucket => size += bucket.size)

    //     return size
    // }
}