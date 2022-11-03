import { DEFAULT_COMPARATOR } from "../utils/comparators"
import { Comparator } from "../utils/types"

export interface Config<T> {
    /**
     * (a > b) => -1;
     * (a < b) => 1;
     * (a === b) => 0; 
     * @param a
     * @param b 
     * @returns `-1 | 1 | 0`
     */
    comparator?: Comparator<T>
}

interface BaseBinaryTreeOperations<T> {
    isFull(root: NodeBinaryTree<T> | null): boolean
    isPerfect(root: NodeBinaryTree<T> | null): boolean 
    isComplete(root: NodeBinaryTree<T> | null): boolean
    getHeight(root: NodeBinaryTree<T> | null): number
}

export class NodeBinaryTree<T> {
    public data: T
    public left: NodeBinaryTree<T> | null = null
    public right: NodeBinaryTree<T> | null = null

    constructor (data: T) {
        this.data = data
    }

    static createOne<D>(data: D): NodeBinaryTree<D> {
        return new NodeBinaryTree(data)
    }
}

export class BaseBinaryTree<T> implements BaseBinaryTreeOperations<T> {
    public root: NodeBinaryTree<T> | null = null
    public size = 0
    public compare: Comparator<T>

    constructor(config: Config<T>) {
        this.compare = config.comparator ?? DEFAULT_COMPARATOR
    }

    isFull(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return false 

        if (!root.left && !root.right) return true

        if (root.left && root.right) {
            return this.isFull(root.left) && this.isFull(root.right)
        }

        return false
    }

    isPerfect(root: NodeBinaryTree<T> | null = this.root): boolean {
        return this._isPerfectRec(root, this.getHeight())
    }

    isComplete(root: NodeBinaryTree<T> | null = this.root): boolean {
        return this._isCompleteRec(root, 0)
    }
    
    getHeight(root: NodeBinaryTree<T> | null = this.root): number {
        if (!root) return 0

        const leftHeight = this.getHeight(root.left)
        const rightHeight = this.getHeight(root.right)

        return Math.max(leftHeight, rightHeight) + 1
    }

    private _isPerfectRec(root: NodeBinaryTree<T> | null, height: number, level = 0): boolean {
        if (!root) return false

        if (!root.left && !root.right) return (height === level + 1)

        if (!root.left || !root.right) return false

        return this._isPerfectRec(root.left, height, level + 1) && this._isPerfectRec(root.right, height, level + 1)
    }

    private _isCompleteRec(root: NodeBinaryTree<T> | null = this.root, index: number): boolean {
        if (!root) return true

        if (index >= this.size) return false

        return this._isCompleteRec(root.left, 2 * index + 1) && this._isCompleteRec(root.right, 2 * index + 2)  
    }
}