import { inspect } from 'util'
import { NonEmptyArray } from '../utils/types';
import { BaseLinkedList, Config, Edge, FoundNodeSingle, NodeSingle } from "./base";

interface LinkedListSingleCircularOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void
    
    prependOne(data: T): void
    prependMany(data: NonEmptyArray<T>): void

    removeHead(): T | undefined
    removeTail(): T | undefined
    // removeAt(position: number): T | undefined

    some(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => boolean | void, startFrom: Edge): FoundNodeSingle<T> | undefined
    forEach(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => void): void

    toArray(): T[]
    toJSON(): string

    clear(): void
}

export class LinkedListSingleCircular<T> extends BaseLinkedList<T> implements LinkedListSingleCircularOperations<T> {
    public head: NodeSingle<T> | null = null
    public tail: NodeSingle<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }

    private _closerTo(position: number): Edge {
        return position < (this.size / 2) ? 'HEAD' : 'TAIL'
    }

    //TODO dodać startFrom z wybranego `node`
    some(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => boolean | void, startFrom: Edge = 'HEAD'): FoundNodeSingle<T> | undefined {
        if (this.size === 0) return 

        if (startFrom === 'HEAD') {
            let prev: NodeSingle<T> | null = null
            let curr = this.head
            let n = 0
            let found: NodeSingle<T> | undefined = undefined

            while (curr && n < this.size) {
                const is = callback(curr, n, prev)

                if (is) {
                    found = curr
                    break
                }

                prev = curr
                curr = curr.next
                n++
            }

            return found ? { node: found, position: n } : undefined
        }
    }

    forEach(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => void): void {
        if (this.size === 0) return 

        let prev: NodeSingle<T> | null = null
        let curr = this.head
        let n = 0

        while (curr && n < this.size) {
            callback(curr, n, prev)
            prev = curr
            curr = curr.next
            n++
        }
    }

    appendOne(data: T): void {
        const newNode = NodeSingle.createOne(data)
        this.size++

        if (!this.tail) {
            this.tail = this.head = newNode

            return 
        }

        this.tail.next = newNode
        newNode.next = this.head 
        this.tail = newNode
    }

    appendMany(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeSingle.createChain(data)
        this.size += data.length

        if (!this.tail) {
            this.head = chainHead 
            this.tail = chainTail
            this.tail.next = this.head

            return 
        }

        chainHead.next = this.head
        this.tail.next = chainHead
        this.tail = chainTail
    }

    prependOne(data: T): void {
        const newNode = NodeSingle.createOne(data)
        this.size++

        if (!this.head) {
            this.tail = this.head = newNode

            return
        }

        newNode.next = this.head
        this.head = newNode
    }

    prependMany(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeSingle.createChain(data)
        this.size += data.length

        if (!this.head) {
            chainTail.next = chainHead
            this.head = chainHead
            this.tail = chainTail

            return 
        }

        chainTail.next = this.head
        this.head = chainHead
    }

    removeHead(): T | undefined {
        if (!this.head) return 
        
        const headData = this.head.data
        this.size--

        this.head = this.head.next;
        (this.tail as NodeSingle<T>).next = this.head

        return headData
    }

    removeTail(): T | undefined {
        if (!this.tail) return 

        const tailData = this.tail.data
        this.size--

        this.tail 

        return tailData
    }

    toArray(): T[] {
        const accData = new Array(this.size)

        this.forEach((curr, n) => accData[n] = curr.data)

        return accData
    }

    toJSON(): string {
        return inspect(this.head)
    }

    clear(): void {
        this.head = this.tail = null
        this.size = 0
    }
}