import { NonEmptyArray } from "../utils/types";
import { BaseLinkedList, Config, NodeDouble, FoundNodeDouble, Edge } from "./base";

interface LinkedListDoubleOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void

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

    some(callback: (currentNode: NodeDouble<T>, currentPosition: number) => boolean | void, startFrom: Edge): FoundNodeDouble<T> | undefined
    forEach(callback: (currentNode: NodeDouble<T>, currentPosition: number) => void): void

    toArray(): T[]
    toJSON(): string
    
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
        return JSON.stringify(this.head)
    }

    clear(): void {
        this.head = this.tail = null
        this.size = 0
    }
}