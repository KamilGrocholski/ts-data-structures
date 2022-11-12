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
    removeGiven(node: NodeBinaryTree<T>): void

    hasDuplicates(root: NodeBinaryTree<T> | null): boolean
}

/**
 * insert(data) -> data >= root.data ? -> root.right : -> root.left
 */
export class BinaryTree<T> extends BaseBinaryTree<T> implements BinaryTreeOperations<T> {

    constructor(config: Config<T> = {}) {
        super(config)
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

    remove(data: T, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | null {
        if (root) {
            // recursively call the function until found
            const comparison = this.compare(data, root.data)
            if (comparison === -1) root.right = this.remove(data, root.right)
            else if (comparison === 1) root.left = this.remove(data, root.left)
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
                // find max node on the left side, and recursively call until deleted
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

    removeGiven(node: NodeBinaryTree<T>): void {
        const foundParent = this.findParent(node)

        this.remove(node.data, foundParent)
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

    hasDuplicates(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return false

        const arrData = this.toArray()

        if (new Set(arrData).size !== arrData.length) return true

        return false
    }
}
