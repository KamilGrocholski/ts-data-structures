import { DEFAULT_COMPARATOR_EQUALITY } from "../utils/comparators";
import { NonEmptyArray, ComparatorEquality } from "../utils/types";

export interface Config<T> {
    /**
     * A function to compare other values than the primitives,
     * on default the comparison is made with `===` 
     * @param data1 `T`
     * @param data2 `T`
     * @returns `boolean`
     */
    comparator?: ComparatorEquality<T>
}


export type Pointer = 'NEXT' | 'PREV'
export type Edge = 'HEAD' | 'TAIL'
export type FoundNodeSingle<T> = { node: NodeSingle<T>, position: number }
export type FoundNodeDouble<T> = { node: NodeDouble<T>, position: number }
export type NullableNodeDouble<T> = NodeDouble<T> | null

export class NodeSingle<T> {
    public data: T
    public next: NodeSingle<T> | null = null

    constructor(data: T) {
        this.data = data
    }

    static createOne = <D>(data: D) => new NodeSingle(data)
    static createChain = <D>(data: NonEmptyArray<D>) => {
        const length = data.length
        const chainHead = new NodeSingle<D>(data[0])
        let current = chainHead

        for (let d = 1; d < length; d++) {
            const next = new NodeSingle<D>(data[d])
            current.next = next
            current = current.next
        }

        return {
            chainHead,
            chainTail: current
        }
    }
}

export class NodeDouble<T> {
    public data: T
    public next: NodeDouble<T> | null = null
    public prev: NodeDouble<T> | null = null

    constructor(data: T) {
        this.data = data
    }

    static createOne = <D>(data: D) => new NodeDouble(data)
    static createChain = <D>(data: NonEmptyArray<D>) => {
        const length = data.length
        const chainHead = new NodeDouble<D>(data[0])

        if (data[1]) {
            let current = new NodeDouble<D>(data[1])
            chainHead.next = current
            current.prev = chainHead
            
            for (let d = 2; d < length; d++) {
                const newNode = new NodeDouble(data[d]) as NodeDouble<D>
                current.next = newNode
                newNode.prev = current

                current = current.next
            }
            
            return {
                chainHead,
                chainTail: current
            }
        } else {
            
            return {
                chainHead,
                chainTail: chainHead
            }
        }
    }
}

export abstract class BaseLinkedList<T> {
    public size = 0
    public compare: ComparatorEquality<T>

    constructor(config: Config<T>) {
        this.compare = config.comparator ?? DEFAULT_COMPARATOR_EQUALITY
    }
}