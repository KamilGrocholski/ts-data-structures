/* eslint-disable @typescript-eslint/ban-types */
import { BaseBinaryTree, Config, NodeBinaryTree } from "./base"

interface BinaryTreeOperations<T> {
    insert(data: T): NodeBinaryTree<T>
    insertMany(data: T[]): void

    find(data: T, root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMin(root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMax(root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined 
    findParent(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined

    remove(data: T, root: NodeBinaryTree<T> | null): void
    // removeGiven(node: NodeBinaryTree<T> | null)
    
    traverseInOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void
    traversePreOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void
    traversePostOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void

    isEmpty(): boolean 

    toJSON(): string
    toArray(): T[]

    clear(): void
}

export class BinaryTree<T> extends BaseBinaryTree<T> implements BinaryTreeOperations<T> {

    constructor(config: Config<T> = {}) {
        super(config)
    }

    /**
     * Left subtree > Root > Right subtree
     * @param root
     * @param callback 
     */
    traverseInOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null = this.root): void {
        if (root != null) {
            this.traverseInOrder(callback, root.left)
            callback(root)
            this.traverseInOrder(callback, root.right)
        }
    }

    /**
     * Root > Left subtree > Right subtree
     * @param root
     * @param callback 
     */
    traversePreOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null = this.root): void {
        if (root != null) {
            callback(root)
            this.traversePreOrder(callback, root.left)
            this.traversePreOrder(callback, root.right)
        }
    }

    /**
     * Left subtree > Right subtree > Root
     * @param root
     * @param callback 
     */
    traversePostOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null = this.root): void {
        if (root != null) {
            this.traversePostOrder(callback, root.left)
            this.traversePostOrder(callback, root.right)
            callback(root)
        }
    }

    insert(data: T): NodeBinaryTree<T> {
        const newNode = NodeBinaryTree.createOne(data)

        this.size++ 

        if (this.root === null) {
            this.root = newNode

            return newNode
        }

        const insertTraversal = (root: NodeBinaryTree<T>) => {
            // Case 1
            // It is smaller
            if (this.compare(data, root.data) === 1) {
                if (root.left) insertTraversal(root.left)
                else root.left = newNode
            }
            // Case 2
            // It is bigger or equal
            else {
                if (root.right) insertTraversal(root.right)
                else root.right = newNode
            }
        }

        insertTraversal(this.root)

        return newNode
    }

    insertMany(data: T[]): void {
        data.forEach(d => this.insert(d))
    }

    remove(data: T, root: NodeBinaryTree<T> | null = this.root) {
        if (root) {
            // recursively call the function until found
            if (data > root.data) root.right = this.remove(data, root.right)
            else if (data < root.data) root.left = this.remove(data, root.left)
            else {
                // Case 1
                // no child
                if (!root.left && !root.right) {
                    this.size--

                    return null
                }
                // Case 2
                // replace current root with it's child
                if (!root.left || !root.right) {
                    this.size--

                    return root.left ? root.left : root.right
                }
                // Case 3
                // find max node and recursively call until deleted
                else {
                    this.size--
                    let temp = root.left
                    while (temp.right) temp = temp.right
                    root.data = temp.data
                    root.left = this.remove(temp.data, temp.left)
                }
            }
        }

        return root
    }

    find(data: T, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return undefined

        if (this.compare(data, root.data) === 0) {

          return root
        } else {
          if (this.compare(data, root.data) === -1) return this.find(data, root.right)
          else return this.find(data, root.left)
        }
    }

    findMin(root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return

        if (root.left) return this.findMin(root.left)

        else return root
    }

    findMax(root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return

        if (root.right) return this.findMax(root.right)

        else return root
    }

    findParent(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return 
        if (node === root) return 
        if (node === root.left) return root
        if (node === root.right) return root
        if (this.compare(node.data, root.data) === -1 || 0) return this.findParent(node, root.left)
        return this.findParent(node, root.right)
    }

    isValid(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return true

        if (root.left && root.right) return this.isValid(root.left) && this.isValid(root.right)

        if (root.left) {
            if (this.compare(root.data, root.left.data) === 1) return false
            return this.isValid(root.left)
        }

        if (root.right) {
            if (this.compare(root.data, root.right.data) === -1 || 0) return false
            return this.isValid(root.right)
        }

        return true
    }

    isEmpty(): boolean {
        return this.root === null
    }

    toJSON(): string {
        return JSON.stringify(this.root)
    }

    toArray(): T[] {
        const arrData = new Array(this.size)

        let n = 0

        this.traverseInOrder(node => {
            arrData[n] = node.data
            n++
        })

        return arrData
    }

    clear(): void {
        this.root = null
        this.size = 0
    }
}
