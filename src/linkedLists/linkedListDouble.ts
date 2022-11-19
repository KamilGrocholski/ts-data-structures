import { inspect } from "util";
import { NonEmptyArray } from "../utils/types";
import { BaseLinkedList, Config, NodeDouble, FoundNodeDouble, Edge } from "./base";

interface LinkedListDoubleOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void

    embedAfterPosition(position: number, data: T): void
    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void
    //TODO embedAfterGiven(node: NodeDouble<T>, data: T): void
    //TODO embedManyAfterGiven(node: NodeDouble<T>, data: NonEmptyArray<T>): void

    prependOne(data: T): void
    prependMany(data: NonEmptyArray<T>): void

    findOne(data: T, startFrom: Edge): FoundNodeDouble<T> | undefined
    findMany(data: T): FoundNodeDouble<T>[] | undefined
    findAt(position: number): NodeDouble<T> | undefined

    removeHead(): T | undefined
    removeTail(): T | undefined
    removeAt(position: number): T | undefined
    //TODO removeGiven(node: FoundNodeDouble<T>): void

    updateOne(data: T, newData: T, startFrom: Edge): number | undefined
    updateMany(data: T, newData: T): number[]

    reverse(): void
    swap(nodeA: NodeDouble<T>, nodeB: NodeDouble<T>): void

    some(callback: (currentNode: NodeDouble<T>, currentPosition: number) => boolean | void, startFrom: Edge): FoundNodeDouble<T> | undefined
    forEach(callback: (currentNode: NodeDouble<T>, currentPosition: number) => void): void

    toArray(): T[]
    toJSON(): string
    
    from(data: NonEmptyArray<T>): void

    clear(): void
}

export class LinkedListDouble<T> extends BaseLinkedList<T> implements LinkedListDoubleOperations<T> {
    public head: NodeDouble<T> | null = null
    public tail: NodeDouble<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }

    private _closerTo(position: number): Edge {
        return position < (this.size / 2) ? 'HEAD' : 'TAIL'
    }

    reverse(): void {
        if (!this.head) return 

        this.tail = this.head
        let curr: null | NodeDouble<T> = this.tail
        let temp: null | NodeDouble<T> = null
        
        
        while (curr != null) {
            temp = curr.prev
            curr.prev = curr.next
            curr.next = temp
            curr = curr.prev
        }

        if (temp != null) {
            this.head = temp.prev
        }
    }

    swap(nodeA: NodeDouble<T>, nodeB: NodeDouble<T>): void {
        const temp = nodeA.data
        nodeA.data = nodeB.data
        nodeB.data = temp
    }

    some(callback: (currentNode: NodeDouble<T>, currentPosition: number) => boolean | void, startFrom: Edge = 'HEAD'): FoundNodeDouble<T> | undefined {
        if (this.size === 0) return 

        if (startFrom === 'HEAD') {
            let curr = this.head
            let n = 0
            let found: NodeDouble<T> | undefined = undefined
            
            while (curr) {
                const is = callback(curr, n)

                if (is) {
                    found = curr 
                    break
                }
                
                curr = curr.next
                n++
            }

            return found ? { node: found, position: n } : undefined
        }
        
        if (startFrom === 'TAIL') {
            let curr = this.tail
            let n = this.size - 1
            let found: NodeDouble<T> | undefined = undefined
            
            while (curr) {
                const is = callback(curr, n)

                if (is) {
                    found = curr 
                    break
                }
                
                curr = curr.prev
                n--
            }

            return found ? { node: found, position: n } : undefined
        }
    }

    forEach(callback: (currentNode: NodeDouble<T>, currentPosition: number) => void): void {
        if (this.size === 0) return 

        let curr = this.head
        let n = 0
        
        while (curr) {
            callback(curr, n)
            
            curr = curr.next
            n++
        }
    }

    appendOne(data: T): void {
        const newNode = NodeDouble.createOne(data)
        this.size++

        if (!this.tail) {
            this.head = this.tail = newNode

            return 
        } 

        this.tail.next = newNode
        newNode.prev = this.tail 
        this.tail = newNode
    }

    appendMany(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeDouble.createChain(data)
        this.size += data.length

        if(!this.tail) {
            this.head = chainHead
            this.tail = chainTail

            return 
        }

        this.tail.next = chainHead
        this.tail = chainTail
    }

    embedAfterPosition(position: number, data: T): void {
        if (this.size === 0 || position >= this.size) return 

        if (this.size === 1 || position === this.size - 1) {
            this.appendOne(data)

            return 
        }

        this.size++
        const newNode = NodeDouble.createOne(data)

        this.some((curr, n) => {
            if (n === position) {
                newNode.next = curr.next
                newNode.prev = curr
                if (curr.next?.prev) {
                    curr.next.prev = newNode
                }
                curr.next = newNode

                return true
            }
        }, this._closerTo(position))
    }

    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void {
        if (this.size === 0 || position >= this.size) return 

        if (this.size === 1 || position === this.size - 1) {
            this.appendMany(data)

            return 
        }

        this.size += data.length
        const { chainHead, chainTail } = NodeDouble.createChain(data)
        
        this.some((curr, n) => {
            if (n === position) {
                chainTail.next = curr.next
                if (curr.next?.prev) {
                    curr.next.prev = chainTail
                }
                curr.next = chainHead

                return true
            }
        }, this._closerTo(position))
    }

    prependOne(data: T): void {
        const newNode = NodeDouble.createOne(data)
        this.size++

        if (!this.head) {
            this.head = this.tail = newNode

            return 
        }

        this.head.prev = newNode
        newNode.next = this.head
        this.head = newNode
    }

    prependMany(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeDouble.createChain(data)
        this.size += data.length

        if (!this.head) {
            this.head = chainHead
            this.tail = chainTail

            return 
        }

        this.head.prev = chainTail
        chainTail.next = this.head
        this.head = chainHead
    }

    removeTail(): T | undefined {
        if (!this.tail) return 

        if (!this.tail.prev) {
            this.clear()
            
            return 
        }
        
        this.size--
        this.tail = this.tail.prev
        this.tail.next = null
    }

    removeHead(): T | undefined {
        if (!this.head) return 

        if (!this.head.next) {
            this.clear()
            
            return 
        }
        
        this.size--
        this.head = this.head.next
        this.head.prev = null
    }

    removeAt(position: number): T | undefined {
        if (this.size === 0) return 
        if (position >= this.size) return 

        this.size-- 
        return this.some((_, n) => n === position, this._closerTo(position))?.node.data
    }

    updateOne(data: T, newData: T, startFrom: Edge = 'HEAD'): number | undefined {
        return this.some(curr => {
            if (this.compare(curr.data, data)) {
                curr.data = newData

                return true
            }
        }, startFrom)?.position
    }

    updateMany(data: T, newData: T): number[] {
        const updatedPositions: number[] = []

        this.forEach((curr, n) => {
            if (this.compare(curr.data, data)) {
                updatedPositions.push(n)
                curr.data = newData
            }
        })

        return updatedPositions
    }

    findOne(data: T, startFrom: Edge = 'HEAD'): FoundNodeDouble<T> | undefined {
        return this.some(curr => this.compare(curr.data, data), startFrom)
    }
    
    findMany(data: T): FoundNodeDouble<T>[] | undefined {
        const foundNodes: FoundNodeDouble<T>[] = []

        this.forEach((curr, n) => {
            if (this.compare(curr.data, data)) {
                foundNodes.push({
                    node: curr,
                    position: n
                })
            }
        })

        return foundNodes
    }

    findAt(position: number): NodeDouble<T> | undefined {
        return this.some((_, n) => n === position, this._closerTo(position))?.node
    }

    toArray(): T[] {
        const accData = new Array(this.size)

        this.forEach((curr, n) => accData[n] = curr.data)

        return accData
    }

    toJSON(): string {
        // return JSON.stringify(this.head)
        return inspect(this.head)
    }

    from(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeDouble.createChain(data)

        this.size = data.length

        this.head = chainHead
        this.tail = chainTail
    }

    clear(): void {
        this.head = this.tail = null
        this.size = 0
    }
}