import { inspect } from 'util'
import { NonEmptyArray } from '../utils/types';
import { BaseLinkedList, Config, FoundNodeSingle, NodeSingle } from "./base";

interface LinkedListSingleCircularOperations<T> {
    appendOne(data: T): void
    appendMany(data: NonEmptyArray<T>): void
    
    embedAfterPosition(position: number, data: T): void
    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void
    embedAfterGiven(node: NodeSingle<T>, data: T): number | undefined
    embedManyAfterGiven(node: NodeSingle<T>, data: NonEmptyArray<T>): void

    prependOne(data: T): void
    prependMany(data: NonEmptyArray<T>): void

    findOne(data: T): FoundNodeSingle<T> | undefined
    findMany(data: T): FoundNodeSingle<T>[] | undefined
    findAt(position: T): NodeSingle<T> | undefined

    removeHead(): T | undefined
    removeTail(): T | undefined
    removeGiven(node: NodeSingle<T>): number | undefined
    removeAt(position: number): T | undefined

    updateOne(data: T, newData: T): number | undefined 
    updateMany(data: T, newData: T): number[] | undefined

    //TODO reverse(): void
    swap(nodeA: NodeSingle<T>, nodeB: NodeSingle<T>): void

    some(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => boolean | void): FoundNodeSingle<T> | undefined
    forEach(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => void): void

    toArray(): T[]
    toJSON(): string

    from(data: NonEmptyArray<T>): void

    clear(): void
}

export class LinkedListSingleCircular<T> extends BaseLinkedList<T> implements LinkedListSingleCircularOperations<T> {
    public head: NodeSingle<T> | null = null
    public tail: NodeSingle<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }
    
    // reverse(): void {
    //     if (!this.head) return

    //     const reverseRec = (current: NodeSingle<T> | null) => {
    //         if (current?.next !== this.head && current?.next?.next) {
    //             current.next.next = current    
    //         }
    //     }
    // }

    swap(nodeA: NodeSingle<T>, nodeB: NodeSingle<T>): void {
        const temp = nodeA.data
        nodeA.data = nodeB.data
        nodeB.data = temp
    }

    some(callback: (currentNode: NodeSingle<T>, currentPosition: number, previousNode: NodeSingle<T> | null) => boolean | void): FoundNodeSingle<T> | undefined {
        if (this.size === 0) return 

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

    embedAfterPosition(position: number, data: T): void {
        if (this.size === 0) return 

        if (position >= this.size) return

        const newNode = NodeSingle.createOne(data)

        this.some((curr, n) => {
            if(n === position) {
                this.size++
                newNode.next = curr.next
                curr.next = newNode

                return true
            }
        })
    }

    embedManyAfterPosition(position: number, data: NonEmptyArray<T>): void {
        if (this.size === 0) return 

        if (position >= this.size) return

        const { chainHead, chainTail } = NodeSingle.createChain(data)

        this.some((curr, n) => {
            if(n === position) {
                this.size += data.length
                chainTail.next = curr.next
                curr.next = chainHead

                return true
            }
        })
    }

    embedAfterGiven(node: NodeSingle<T>, data: T): number | undefined {
        if (this.size === 0) return 

        const newNode = NodeSingle.createOne(data)

        return this.some(curr => {
            if (curr == node) {
                this.size++
                newNode.next = curr.next
                curr.next = newNode

                return true
            }
        })?.position
    }

    embedManyAfterGiven(node: NodeSingle<T>, data: NonEmptyArray<T>): void {
        if (this.size === 0) return 

        const { chainHead, chainTail } = NodeSingle.createChain(data)

        this.some(curr => {
            if (curr == node) {
                this.size += data.length
                chainTail.next = curr.next
                curr.next = chainHead

                return true
            }
        })
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

    findOne(data: T): FoundNodeSingle<T> | undefined {
        return this.some(curr => this.compare(curr.data, data))
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

    findAt(position: T): NodeSingle<T> | undefined {
        return this.some((curr, n) => n === position)?.node
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
        if (!this.head) return

        if (this.size === 1) {
            const tailData = this.tail?.data
            this.clear()
            
            return tailData
        }
        
        this.some((curr, n, prev) => {
            if (prev?.next == this.tail) {
                this.size--
                (prev as NodeSingle<T>).next = this.head
                this.tail = prev

                return true
            }
        })?.node.next?.data
    }

    removeGiven(node: NodeSingle<T>): number | undefined {
        if (!this.tail) return 
        
        
        if (node == this.head) {
            this.removeHead()

            return 
        }
        
        if (node == this.tail) {
            this.removeTail()

            return
        }
        
        this.some((curr, n, prev) => {
            if (curr == node) {
                this.size--
                (prev as NodeSingle<T>).next = curr.next

                return true
            }
        })
    }

    removeAt(position: number): T | undefined {
        if (this.size === 0) return 

        if (position === 0) {
            this.removeHead()

            return
        }

        if (position === this.size - 1) {
            this.removeTail()

            return
        }

        this.some((curr, n, prev) => {
            if (position === n) {
                (prev as NodeSingle<T>).next = curr.next

                return true
            }
        })
    }

    updateOne(data: T, newData: T,): number | undefined {
        return this.some(curr => this.compare(curr.data, newData))?.position
    }

    updateMany(data: T, newData: T): number[] | undefined {
        const updatedPositions: number[] = []

        this.forEach((curr, n) => {
            if (this.compare(curr.data, data)) {
                curr.data = newData
                updatedPositions.push(n)
            }
        })

        return updatedPositions.length > 0 ? updatedPositions : undefined
    }

    toArray(): T[] {
        const accData = new Array(this.size)

        this.forEach((curr, n) => accData[n] = curr.data)

        return accData
    }

    toJSON(): string {
        return inspect(this.head)
    }

    from(data: NonEmptyArray<T>): void {
        const { chainHead, chainTail } = NodeSingle.createChain(data)

        this.size = data.length

        if (this.size > 1) {
            chainTail.next = chainHead
        }

        this.head = chainHead
        this.tail = chainTail
    }

    clear(): void {
        this.head = this.tail = null
        this.size = 0
    }
}