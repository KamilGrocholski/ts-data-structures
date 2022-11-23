import { inspect } from 'util'
import { NonEmptyArray } from '../utils/types';
import { BaseLinkedList, Config, Edge, FoundNodeDouble, NodeDouble, NullableNodeDouble } from "./base";

interface LinkedListDoubleCircularOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void
    
    // embedAfterPosition(position: number, data: T): void
    // embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void
    // embedAfterGiven(node: NodeDouble<T>, data: T): number | undefined
    // embedManyAfterGiven(node: NodeDouble<T>, data: NonEmptyArray<T>): void

    prependOne(data: T): void
    prependMany(data: NonEmptyArray<T>): void

    findOne(data: T): FoundNodeDouble<T> | undefined
    findMany(data: T): FoundNodeDouble<T>[] | undefined
    findAt(position: T): NodeDouble<T> | undefined

    removeHead(): T | undefined
    removeTail(): T | undefined
    // removeGiven(node: NodeDouble<T>): number | undefined
    // removeAt(position: number): T | undefined
    removeDuplicates(): void

    updateOne(data: T, newData: T): number | undefined 
    updateMany(data: T, newData: T): number[]

    // reverse(): void
    swap(nodeA: NodeDouble<T>, nodeB: NodeDouble<T>): void

    some(callback: (currentNode: NodeDouble<T>, currentPosition: number) => boolean | void): FoundNodeDouble<T> | undefined
    forEach(callback: (currentNode: NodeDouble<T>, currentPosition: number) => void): void

    toArray(): T[]
    toJSON(): string

    from(data: NonEmptyArray<T>): void

    clear(): void
}

export class LinkedListDoubleCircular<T> extends BaseLinkedList<T> implements LinkedListDoubleCircularOperations<T> {
    public head: NodeDouble<T> | null = null
    public tail: NodeDouble<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }   

    private _closerTo(position: number): Edge {
        return position < (this.size / 2) ? 'HEAD' : 'TAIL'
    }

    removeDuplicates(): void {
        if (this.size < 2) return 

        const unique = [...new Set(this.toArray())]

        this.from(unique as NonEmptyArray<T>)
    }

    swap(nodeA: NodeDouble<T>, nodeB: NodeDouble<T>): void {
        const temp = nodeA.data
        nodeA.data = nodeB.data
        nodeB.data = temp
    }

    some(callback: (currentNode: NodeDouble<T>, currentPosition: number) => boolean | void): FoundNodeDouble<T> | undefined {
        let curr = this.head
        let n = 0

        while (curr && n < this.size) {
            const is = callback(curr, n)

            if (is) {
                break
            }

            curr = curr.next
            n++
        }

        return curr ? { node: curr, position: n } : undefined
    }

    forEach(callback: (currentNode: NodeDouble<T>, currentPosition: number) => void): void {
        if (!this.head) return 

        let curr:NullableNodeDouble<T> = this.head
        let n = 0
        
        while (curr && n < this.size) {
            callback(curr, n)
            
            curr = curr.next
            n++
        }
    }

    appendOne(data: T): void {
        const newNode = NodeDouble.createOne(data)

        this.size++

        if (!this.head) {
            this.head = this.tail = newNode

            return 
        }

        if (this.head === this.tail) {
            this.tail = newNode
            this.head.next = this.tail
            this.head.prev = this.tail
            this.tail.next = this.head
            this.tail.prev = this.head

            return 
        }   

        if (this.head && this.tail && this.head !== this.tail) {   
            this.tail.next = newNode
            newNode.prev = this.tail
            newNode.next = this.head
            this.tail = newNode
            this.head.prev = this.tail

            return
        }
    }

    appendMany(data: NonEmptyArray<T>): void {
        data.forEach((d) => {
            this.appendOne(d)
        })
    }

    prependOne(data: T): void {
        const newNode = NodeDouble.createOne(data)

        this.size++
        
        if (!this.tail && !this.head) {
            this.head = this.tail = newNode
        }

        if (this.tail === this.head) {
            this.tail = this.head = newNode

            return
        }

        if (this.tail && this.head && this.head !== this.tail) {
            newNode.next = this.head
            newNode.prev = this.tail
            this.head = newNode

            return 
        }
    }

    prependMany(data: NonEmptyArray<T>): void {
        data.forEach((d) => {
            this.prependOne(d)
        })
    }

    removeHead(): T | undefined {
        if (!this.head) return

        this.size--

        const headData = this.head.data
        
        if (this.head === this.tail) {
            this.head = this.tail = null

            return headData
        }

        if (this.head && this.tail && this.head !== this.tail) {
            this.tail.next = this.head.next
            this.head = this.head.next

            return headData
        }
    }

    removeTail(): T | undefined {
        if (!this.tail) return 

        this.size--

        const tailData = this.tail.data

        if (this.tail === this.head) {
            this.tail = this.head = null

            return tailData
        }

        if (this.head && this.tail && this.head !== this.tail) {
            if (this.head.next === this.tail) {
                this.head.next = null
                this.head.prev = null 
                this.tail = this.head

                return tailData
            }
            this.head.prev = this.tail.prev
            this.tail = this.tail.prev

            return tailData
        }
    }

    updateOne(data: T, newData: T): number | undefined {
        return this.some((node, i) => {
            if (this.compare(node.data, data)) {
                node.data = newData

                return true
            }
        })?.position
    }

    updateMany(data: T, newData: T): number[] {
        const updatedPositions: number[] = []
        
        this.forEach((node, i) => {
            if (this.compare(node.data, data)) {
                updatedPositions.push(i)
                node.data = newData
            }
        })

        return updatedPositions
    }

    findAt(position: T): NodeDouble<T> | undefined {
        return this.some((_, i) => i === position)?.node
    }

    findOne(data: T): FoundNodeDouble<T> | undefined {
        return this.some(node => this.compare(node.data, data))
    }

    findMany(data: T): FoundNodeDouble<T>[] | undefined {
        const foundNodes: FoundNodeDouble<T>[] = []
        
        this.forEach((node, i) => {
            if (this.compare(node.data, data)) {
                foundNodes.push({
                    node,
                    position: i
                })
            }
        })

        return foundNodes
    }

    from(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeDouble.createChain(data)
        
        this.size = data.length

        if (this.size > 1) {
            chainTail.next = chainHead
            chainHead.prev = chainTail
        }

        this.head = chainHead
        this.tail = chainTail
    }

    toArray(): T[] {
        const arrData = new Array<T>(this.size)

        this.forEach((node, i) => arrData[i] = node.data)

        return arrData
    }

    toJSON(): string {
        return inspect(this.head)
    }

    clear(): void {
        this.size = 0
        this.head = this.tail = null
    }
}