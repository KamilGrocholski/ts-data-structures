import { defaultToString, ToString } from "../utils/toString"

export interface BaseHashTableConfig<K, V> {
    capacity?: number
    toStringConverter?: ToString<K>
}

export abstract class BaseHashTable<K, V> {
    public capacity: number
    public toString: ToString<K>

    constructor(config: BaseHashTableConfig<K, V> = {}) {
        this.capacity = config.capacity ?? 10
        this.toString = config.toStringConverter ?? defaultToString
    }
}

export class Entry<K, V> {
    constructor(
        public key: K, 
        public value: V
    ) {}

    toString(): string {
        return `[#${this.key}: ${this.value}]`
    }
}