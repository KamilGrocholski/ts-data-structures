import { BaseLinkedList, Config, NodeNext } from './base';

interface SingleLinkedListOperations<T> {
    prependOne(data: T): void;
    prependMany(data: T[]): void;
    
    embedOneWhere(data: T, newNodeData: T): void;
    embedOneAt(position: number, newNodeData: T): void;
    embedManyWhere(data: T, newNodesData: T[]) : void;
    embedManyAt(position: number, newNodesData: T[]): void;

    appendOne(data: T): void;
    appendMany(data: T[]): void;

    updateOneWhere(data: T, newData: T): number | undefined;
    updateOneAt(position: number, newData: T): T | undefined;
    updateManyWhere(data: T, newData: T): number[] | undefined;

    findOneWhere(data: T): NodeNext<T> | undefined;
    findOneAt(position: number): NodeNext<T> | undefined;

    removeOneWhere(data: T): NodeNext<T> | undefined;

    findTail(): NodeNext<T> | undefined;

    traverse(callback: (node: NodeNext<T> | null) => void): void;
}

export class SingleLinkedList<T> extends BaseLinkedList<T> implements SingleLinkedListOperations<T> {
    public head: NodeNext<T> | null = null

    constructor(config: Config<T>) {
        super(config)
    }

    private _createOneNode(data: T): NodeNext<T> {
        return new NodeNext<T>(data)
    }

    private _createManyNodes(data: T[]): NodeNext<T>[] {
        return data.map(one => this._createOneNode(one))
    }

    private _createManyLinkedNodes(data: T[]): { subHead: NodeNext<T>, subTail: NodeNext<T> } {
        const subHead = this._createOneNode(data[0])
        let temp = subHead
        for (let i = 1; i < data.length; i++) {
            const n = this._createOneNode(data[i])
            temp.next = n
            temp = n
        }

        return {
            subHead,
            subTail: temp
        }
    }

    findTail(): NodeNext<T> | undefined {
        if (!this.head) return 
        let temp = this.head
        while (temp != null) {
            if (!temp.next) {
                return temp
            } else {
                temp = temp.next
            }
        }
    }

    /**
     * Goes through each node of the linked list and executes the `callback`
     * @param callback Gives a node in each iteration 
     */
    traverse(callback?: (node: NodeNext<T> | null) => void): void {
        let temp = this.head
        while (temp != null) {
            callback && callback(temp)
            temp = temp.next
        }
    }

    /**
     * Sets a node as a new `head` and points to the old `head`  
     * @param data 
     */
    prependOne(data: T): void {
        const newNode = this._createOneNode(data)
        newNode.next = this.head 
        this.head = newNode
        this.length++
    }

    /**
     * Sets the first node of the new chain as a new `head` and the last one points to the previous `head`
     * @param data 
     */
    prependMany(data: T[]): void {
        const newNodes = this._createManyLinkedNodes(data)
        if (!this.head) {
            this.head = newNodes.subHead
        } else {
            newNodes.subTail.next = this.head
            this.head = newNodes.subHead
        }
        this.length += data.length
    }

    embedOneWhere(data: T, newNodeData: T): void {
        if (!this.head) {
            return 
        } else {
            const found = this.findOneWhere(data)
            if (!found) return 
            const newNode = this._createOneNode(newNodeData)
            newNode.next = found.next
            found.next = newNode 
            this.length++
        }
    }

    embedOneAt(position: number, newNodeData: T): void {
        if (!this.head || position > this.length) {
            return 
        } else {
            const found = this.findOneAt(position)
            if (!found) return 
            const newNode = this._createOneNode(newNodeData)
            newNode.next = found.next
            found.next = newNode
            this.length++
        }
    }

    embedManyWhere(data: T, newNodesData: T[]): void {
        if (!this.head) {
            return 
        } else {
            const found = this.findOneWhere(data)
            if (!found) return
            const newLinkedNodes = this._createManyLinkedNodes(newNodesData)
            newLinkedNodes.subTail.next = found.next
            found.next = newLinkedNodes.subHead
            this.length += newNodesData.length
        }
    }
    
    embedManyAt(position: number, newNodesData: T[]): void {
        if (!this.head || position > this.length) {
            return 
        } else {
            const found = this.findOneAt(position)
            if (!found) return
            const newLinkedNodes = this._createManyLinkedNodes(newNodesData)
            newLinkedNodes.subTail.next = found.next
            found.next = newLinkedNodes.subHead
            this.length += newNodesData.length
        }
    }

    /**
    * Adds one node at the end of the list
    * @param data
    */
    appendOne(data: T): void {
        const newNode = this._createOneNode(data)
        if (!this.head) {
            this.head = newNode
        } else {
            const tail = this.findTail() as NodeNext<T>
            tail.next = newNode
        }
        this.length++
    }
    
    /**
    * Links a new chain of nodes to the list's last node 
    * or creates, if `head` doesn't exist
    * @param data 
    */
    appendMany(data: T[]): void {
        const newNodes = this._createManyLinkedNodes(data)
        if (!this.head) {
            this.head = newNodes.subHead
        } else {
            const tail = this.findTail() as NodeNext<T>
            tail.next = newNodes.subHead
        }
        this.length += data.length
    }

    /**
     * Updates the first node that meets the terms and returns `position` or `undefined` when not found
     * @param data 
     * @param newData 
     * @returns `position` | `undefined`
     */
    updateOneWhere(data: T, newData: T): number | undefined {
        if (!this.head) return 
        let temp = this.head
        let n = 0
        while (temp != null) {
            if (this.comparator(temp.data, data)) {
                temp.data = newData
                return n
            } else {
                if (temp.next) {
                    temp = temp.next
                    n++
                }
            }
        }
    }

    /**
     * Updates data of a node at nth position or return `undefined` when not found
     * ane returns data
     * @param position 
     * @param newData 
     * @returns `<T>` | `undefined`
     */
    updateOneAt(position: number, newData: T): T | undefined {
        if (!this.head) return
        if (position > length) return  
        let temp = this.head
        const n = 0
        while (temp != null) {
            if (n === position) {
                temp.data = newData
            } else {
                if (temp.next) {
                    temp = temp.next
                }
            }
        }
    }

    /**
     * Goes through every node comparing with default or declared `comparator` and updates if true.
     * @param data 
     * @param newData 
     * @returns `position[] | undefined`
     */
    updateManyWhere(data: T, newData: T): number[] | undefined {
        if (!this.head) return 
        let n = 0
        const positions: number[] = []
        this.traverse((node) => {
            if (node) {
                if (this.comparator(node.data, data)) {
                    node.data = newData
                    positions.push(n)
                }
            }
            n++
        })
        return positions
    }

    /**
     * Returns the first `node` that meets the term or `undefined` when not found
     * @param data 
     */
    findOneWhere(data: T): NodeNext<T> | undefined {
        if (!this.head) return 
        let temp = this.head
        while (temp != null) {
            if (this.comparator(temp.data, data)) {
                return temp
            } else {
                if(temp.next) {
                    temp = temp.next
                }
            } 
        }
    }

    findOneAt(position: number): NodeNext<T> | undefined {
        if (!this.head) return 
        if (position > length) return 
        let temp = this.head
        let n = 0
        while (temp.next != null) {
            if (n === position) { 
                return temp
            } else {
                temp = temp.next
                n++
            } 
        }
    }

    //TODO tak nie może tak być
    removeOneWhere(data: T): NodeNext<T> | undefined {
        if (!this.head) return
        let prev: NodeNext<T> | undefined
        let current = this.head
        while (current != null) {
            if (this.comparator(current.data, data)) {
                if (prev) {
                    prev.next = current.next
                    return current
                } else {
                    throw new Error('During `removeOneWhere`: no `prev` value')
                }
            }
            if (current.next) {
                prev = current
                current = current.next
            }
        }
        return
    }
}