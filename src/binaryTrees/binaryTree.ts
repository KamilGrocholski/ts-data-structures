import { NonEmptyArray } from "../utils/types"
import { BaseBinaryTree, Config, NodeBinaryTree } from "./base"

interface BinaryTreeOperations<T> {
    insertOne(data: T): NodeBinaryTree<T>
    insertMany(data: NonEmptyArray<T>): NodeBinaryTree<T>[]

    findOne(data: T, startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMin(startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMax(startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined 
    //TODO
    findParentOfNode(data: T, startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined 

    // remove(data: T)
    
    some(callback: (node: NodeBinaryTree<T>) => boolean | void, startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    traverseInOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null): void
    traversePreOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null): void
    traversePostOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null): void

    isEmpty(): boolean 

    toJSON(): string
}

export class BinaryTree<T> extends BaseBinaryTree<T> implements BinaryTreeOperations<T> {
    public root: NodeBinaryTree<T> | null = null

    constructor(config: Config<T> = {}) {
        super(config)
    }

    //TODO
    some(callback: (node: NodeBinaryTree<T>) => boolean | void, startNode: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!startNode) return 

        
    }

    /**
     * Left subtree > Root > Right subtree
     * @param startNode
     * @param callback 
     */
    traverseInOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null = this.root): void {
        if (startNode != null) {
            this.traverseInOrder(callback, startNode.left)
            callback(startNode)
            this.traverseInOrder(callback, startNode.right)
        }
    }

    /**
     * Root > Left subtree > Right subtree
     * @param startNode
     * @param callback 
     */
    traversePreOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null = this.root): void {
        if (startNode != null) {
            callback(startNode)
            this.traversePreOrder(callback, startNode.left)
            this.traversePreOrder(callback, startNode.right)
        }
    }

    /**
     * Left subtree > Right subtree > Root
     * @param startNode
     * @param callback 
     */
    traversePostOrder(callback: (node: NodeBinaryTree<T>) => void, startNode: NodeBinaryTree<T> | null = this.root): void {
        if (startNode != null) {
            this.traversePostOrder(callback, startNode.left)
            this.traversePostOrder(callback, startNode.right)
            callback(startNode)
        }
    }

    insertOne(data: T): NodeBinaryTree<T> {
        const newNode = NodeBinaryTree.createOne(data)

        if (this.root != null) {
            const traverse = (node: NodeBinaryTree<T>) => {
                if (this.isBigger(data, node.data)) {
                    if (node.right) {
                        traverse(node.right)
                    } else {
                        node.right = newNode
                    }
                } else {
                    if (node.left) {
                        traverse(node.left)
                    } else {
                        node.left = newNode
                    }
                }
            }

            traverse(this.root)

            return newNode
        } 

        this.root = newNode

        return newNode
    }

    insertMany(data: NonEmptyArray<T>): NodeBinaryTree<T>[] {
        const insertedNodes = new Array(data.length)

        data.forEach((d, n) => {
            insertedNodes[n] = this.insertOne(d)
        })

        return insertedNodes
    }

    findOne(data: T, startNode: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!startNode) return undefined

        if (this.isEqual(data, startNode.data)) {

          return startNode
        } else {
          if (this.isBigger(data, startNode.data)) return this.findOne(data, startNode.right)
          else return this.findOne(data, startNode.right)
        }
    }

    findMin(startNode: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!startNode) return

        if (startNode.left) return this.findMin(startNode.left)
        else return startNode
    }

    findMax(startNode: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined {
        if (!startNode) return

        if (startNode.right) return this.findMax(startNode.right)
        else return startNode
    }

    //TODO
    findParentOfNode(data: T, startNode: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!startNode) return 

        let parent = startNode

        if (this.isEqual(data, startNode.data)) {

            return startNode
        } else {
            if (this.isBigger(data, startNode.data)) return this.findOne(data, startNode.right)
            else return this.findOne(data, startNode.right)
        }
    }

    isEmpty(): boolean {
        return this.root === null
    }

    toJSON(): string {
        return JSON.stringify(this.root)
    }
}