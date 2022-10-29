import { BaseLinkedList, Config, NodePrevNext } from "./base";

interface DoubleLinkedListOperations<T> {
    removeHead(): NodePrevNext<T> | undefined;

    removeTail(): NodePrevNext<T> | undefined;

    appendOne(data: T): NodePrevNext<T> | undefined;

    prependOne(data: T): NodePrevNext<T> | undefined;

    findOneAt(position: number): NodePrevNext<T> | undefined;

    findOneWhere(data: T, from: 'head' | 'tail'): NodePrevNext<T> | undefined;

    clear(): void;
}

export class DoubleLinkedList<T> extends BaseLinkedList<T> implements DoubleLinkedListOperations<T>  {
    public head: NodePrevNext<T> | null = null
    public tail: NodePrevNext<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }

    private _loop(callback: (node: NodePrevNext<T>, n: number, stopWork: () => void) => void) {
        let work = true
        let n = 0
        let current = this.head
        while (current) {
            callback(current, n, () => {
                work = false
            })
            if (work) {
                current = current.next
                n++
            } else {
                break
            }
        }
    }

    clear(): void {
        this.head = this.tail = null
        this.length = 0
    }

    removeHead(): NodePrevNext<T> | undefined {
        if (this.length === 0) return
        this.length--
        const removedHead = this.head ?? undefined
        if (this.head?.next) {
            this.head.next.prev = null
            this.head = this.head.next

            return removedHead
        }
        this.head = this.tail = null

        return removedHead
    }

    removeTail(): NodePrevNext<T> | undefined {
        if (this.length === 0) return
        this.length--
        const removedTail = this.tail ?? undefined
        if (this.tail?.prev) {
            this.tail = this.tail.prev

            return removedTail
        }
        this.tail = this.head = null

        return removedTail
    }

    appendOne(data: T): NodePrevNext<T> | undefined {
        this.length++
        const newNode = NodePrevNext.createNode(data)
      
        if (this.tail) {
          this.tail.next = newNode
          newNode.prev = this.tail
          this.tail = newNode

          return newNode
        }
      
        this.head = this.tail = newNode

        return newNode
    }

    prependOne(data: T): NodePrevNext<T> | undefined {
        this.length++
        const newNode = NodePrevNext.createNode(data)

        if (this.head) {
            this.head.prev = newNode
            newNode.next = this.head
            this.head = newNode

            return newNode
        }

        this.head = this.tail = newNode

        return newNode
    }

    findOneAt(position: number): NodePrevNext<T> | undefined {
        if (this.length === 0 || position > this.length) return
        const isHeadCloser = position < ((this.length) / 2)
        if (isHeadCloser) {
            let n = 0
            let current = this.head
            while (current) {
                if (n === position) return current
                current = current.next
                n++
            }
        } else {
            let n = this.length - 1
            let current = this.tail
            while (current) {
                if (n === position) return current
                current = current.prev
                n--
            }
        }
    }

    findOneWhere(data: T, from: 'head' | 'tail' = 'head'): NodePrevNext<T> | undefined {
        if (this.length === 0) return 
        if (from === 'head') {
            let current = this.head
            while (current) {
                if (this.comparator(current.data, data)) return current
                current = current.next
            }
        } else {
            let current = this.tail
            while (current) {
                if (this.comparator(current.data, data)) return current
                current = current.prev
            }
        }
    }
} 
