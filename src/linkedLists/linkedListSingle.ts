import { NonEmptyArray } from "../utils/types"
import { BaseLinkedList, Config, FoundNodeSingle, NodeSingle } from "./base"

interface LinkedListSingleOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void

    embedAfterPosition(position: number, data: T): void
    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void
    embedAfterGiven(node: NodeSingle<T>, data: T): void
    embedManyAfterGiven(node: NodeSingle<T>, data: NonEmptyArray<T>): void

    prependOne(data: T): void
    prependMany(data: NonEmptyArray<T>): void

    findOne(data: T): FoundNodeSingle<T> | undefined
    findMany(data: T): FoundNodeSingle<T>[] | undefined
    findAt(position: number): NodeSingle<T> | undefined

    removeHead(): T | undefined
    removeTail(): T | undefined
    removeAt(position: number): T | undefined
    removeGiven(node: NodeSingle<T>): void

    updateOne(data: T, newData: T): number | undefined
    updateMany(data: T, newData: T): number[]

    some(callback: (currentNode: NodeSingle<T>, currentPosition: number) => boolean | void): FoundNodeSingle<T> | undefined
    forEach(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => void): void

    toArray(): T[]
    toJSON(): string
    
    clear(): void
}

export class LinkedListSingle<T> extends BaseLinkedList<T> implements LinkedListSingleOperations<T> {
    public head: NodeSingle<T> | null = null
    public tail: NodeSingle<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }

    some(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => boolean | void): FoundNodeSingle<T> | undefined {
        if (this.size === 0) return 

        let prev: NodeSingle<T> | null = null
        let curr = this.head 
        let n = 0
        let found: NodeSingle<T> | undefined = undefined
        while (curr) {
            const is = callback(curr, n, prev) 

            if (is === true) {
                found = curr
                break
            }

            prev = curr
            curr = curr.next
            n++
        }

        return found ? { node: found, position: n } : undefined
    }

    forEach(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => void): void {
        let prev: NodeSingle<T> | null = null
        let curr = this.head 
        let n = 0
        while (curr) {
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
            this.head = this.tail = newNode

            return 
        }
        this.tail.next = newNode
        this.tail = newNode
    }

    appendMany(data: NonEmptyArray<T>): void {
        const { chainHead } = NodeSingle.createChain(data)
        this.size += data.length

        if (!this.tail) {
            this.head = this.tail = chainHead

            return 
        }

        this.tail.next = chainHead
        this.tail = chainHead
    }

    embedAfterPosition(position: number, data: T): void {
        if (this.size === 0) return 

        if (position >= this.size) return

        const newNode = NodeSingle.createOne(data)

        this.some((curr, n) => {
            if (n === position) { 
                newNode.next = curr.next
                curr.next = newNode
                
                if (this.size - 1 === n) {
                    this.tail = newNode
                }

                this.size++

                return true 
            }
        })
    }

    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void {
        if (this.size === 0) return 

        if (position >= this.size) return

        const { chainHead, chainTail } = NodeSingle.createChain(data)

        this.some((curr, n) => {
            if (n === position) {
                chainTail.next = curr.next
                curr.next = chainHead
                
                if (this.size - 1 === n) {
                    this.tail = chainTail
                }
                
                this.size += data.length

                return true
            }
        })
    }

    embedAfterGiven(node: NodeSingle<T>, data: T): void {
        if (this.size === 0) return 

        this.size++
        const newNode = NodeSingle.createOne(data)

        newNode.next = node.next
        node.next = newNode

        if (this.tail == node.next) {
            this.tail = newNode

            return
        }
    }

    embedManyAfterGiven(node: NodeSingle<T>, data: NonEmptyArray<T>): void {
        if (this.size === 0) return 

        if (this.tail == node) {
            this.appendMany(data)

            return 
        }

        this.size += data.length
        const { chainHead, chainTail } = NodeSingle.createChain(data)

        chainTail.next = node.next
        node.next = chainHead
    }

    prependOne(data: T): void {
        const newNode = NodeSingle.createOne(data)
        this.size++

        if (!this.head) {
            this.head = this.tail = newNode

            return
        }

        newNode.next = this.head.next
        this.head = newNode
    }

    prependMany(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeSingle.createChain(data)
        this.size += data.length

        if (!this.head) {
            this.head = this.tail = chainHead

            return 
        }

        chainTail.next = this.head
        this.head = chainHead
    }

    findOne(data: T): FoundNodeSingle<T> | undefined {
        return this.some((node) => this.compare(node.data, data))
    }

    findMany(data: T): FoundNodeSingle<T>[] | undefined {
        const foundNodes: FoundNodeSingle<T>[] = []

        this.forEach((curr, n) => {
            if (this.compare(curr.data, data)) {
                foundNodes.push({
                    node: curr,
                    position: n
                })
            }
        })

        return foundNodes.length > 0 ? foundNodes : undefined
    }

    findAt(position: number): NodeSingle<T> | undefined {
        return this.some((_, n) => n === position)?.node
    }

    updateOne(data: T, newData: T): number | undefined {
        return this.some(curr => {
            if (this.compare(curr.data, data)) {
                curr.data = newData

                return true
            }
        })?.position
    }

    updateMany(data: T, newData: T): number[] {
        const updatedPositions: number[] = []

        this.forEach(curr => {
            if (this.compare(curr.data, data)) {
                curr.data = newData
            }
        })

        return updatedPositions
    }

    removeAt(position: number): T | undefined {
        if (!this.head) return 

        let data: T | undefined = undefined
        this.some((curr, n, prev) => {
            if (n === position) {
                data = curr.data
                if (prev) {
                    this.size--
                    prev.next = curr.next
                }

                return true
            }
            
            return
        })

        return data
    }

    removeHead(): T | undefined {
        if (!this.head) return 

        this.size--
        this.head = this.head.next
    }

    removeGiven(node: NodeSingle<T>): void {
        if (!this.head) return 

        this.some((curr, n, prev) => {
            if (curr === node) {
                if (prev) {
                    this.size--
                    prev.next = node.next
                }

                return true
            }

            return
        })
    }

    removeTail(): T | undefined {
        if (!this.tail) return 

        const tailData = this.tail.data

        if (this.size === 1) {
            this.clear()
            
            return tailData
        }

        return this.some((curr, n) => {
            if (n === this.size - 2) {
                this.size--
                curr.next = null
                this.tail = curr

                return true
            }
        })?.node.data
    }

    toArray(): T[] {
        const accData = new Array<T>(this.size)

        this.forEach((node, n) => accData[n] = node.data)

        return accData
    }
    
    toJSON(): string {
        return JSON.stringify(this.head)
    }

    clear(): void {
        this.size = 0
        this.head = this.tail = null
    }
}