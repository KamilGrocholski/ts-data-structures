/* eslint-disable @typescript-eslint/ban-types */
import { DEFAULT_COMPARATOR } from "../utils/comparators"
import { CONSOLE_POINTERS } from "../utils/constants"
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
    // tree type checkers
    isFull(root: NodeBinaryTree<T> | null): boolean
    isPerfect(root: NodeBinaryTree<T> | null): boolean 
    isComplete(root: NodeBinaryTree<T> | null): boolean
    isDegenerate(root: NodeBinaryTree<T> | null): boolean
    isBalanced(root: NodeBinaryTree<T> | null): boolean
    isSkewedLeft(root: NodeBinaryTree<T> | null): boolean
    isSkewedRight(root: NodeBinaryTree<T> | null): boolean

    traverseInOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void
    traversePreOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void
    traversePostOrder(callback: (currentNode: NodeBinaryTree<T>) => void, root: NodeBinaryTree<T> | null): void

    getHeight(root: NodeBinaryTree<T> | null): number

    isEmpty(): boolean 

    // prettier
    toPretty(type: 1 | 2, root: NodeBinaryTree<T> | null): string | undefined
    toJSON(): string
    toArray(): T[]

    clear(): void
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
    /**
     * (a > b) => -1;
     * (a < b) => 1;
     * (a === b) => 0; 
     * @param a
     * @param b 
     * @returns `-1 | 1 | 0`
     */
    public compare: Comparator<T>

    constructor(config: Config<T>) {
        this.compare = config.comparator ?? DEFAULT_COMPARATOR
    }

    /**
     * Left subtree -> Root -> Right subtree
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
     * Root -> Left subtree -> Right subtree
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
     * Left subtree -> Right subtree -> Root
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
    
    isDegenerate(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return true

        if (root.left && root.right) return false

        if (!root.left || !root.right) return true

        return !this.isDegenerate(root.left) || !this.isDegenerate(root.right)
    }

    isBalanced(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return true

        if ((root.left?.left || root.left?.right) && !root.right) return false
        
        if ((root.right?.left || root.right?.right) && !root.left) return false

        return this.isBalanced(root.left) && this.isBalanced(root.right)
    }

    isSkewedLeft(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return true

        if (!root.left && root.right) return false

        return this.isSkewedLeft(root.left) && this.isSkewedLeft(root.right)
    }

    isSkewedRight(root: NodeBinaryTree<T> | null = this.root): boolean {
        if (!root) return true

        if (root.left && !root.right) return false

        return this.isSkewedRight(root.left) && this.isSkewedRight(root.right)
    }

    getHeight(root: NodeBinaryTree<T> | null = this.root): number {
        if (!root) return 0

        const leftHeight = this.getHeight(root.left)
        const rightHeight = this.getHeight(root.right)

        return Math.max(leftHeight, rightHeight) + 1
    }

    isEmpty(): boolean {
        return this.root === null
    }

    toPretty(type: 1 | 2 = 1, root: NodeBinaryTree<T> | null = this.root): string | undefined {
        if (type === 1) return this._toPretty1Helper('', true, { out: '' })?.out
        if (type === 2) return this._prettyPreOrder(root)
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

    private _toPretty1Helper(prefix: string, isTail: boolean, sb: { out: string }, root: NodeBinaryTree<T> | null = this.root) {
        if (!root) return

        if (root.right) {
            const sbPre = prefix + (isTail ? "│   " : "    ")
            this._toPretty1Helper(sbPre, false, sb, root.right)
        }
        sb.out += prefix + (isTail ? "└── " : "┌── ") + root.data + '\n'
        if (root.left) {
            const sbPre = prefix + (isTail ? "    " : "│   ")
            this._toPretty1Helper(sbPre, true, sb, root.left)
        }

        return sb
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

    // zerżnięte z https://www.baeldung.com/java-print-binary-tree-diagram
    private _prettyPreOrder(root: NodeBinaryTree<T> | null = this.root) {
        if (root == null) return ""
    
        const { TWO_CHILDREN, LAST_CHILDREN } = CONSOLE_POINTERS

        const sb = {
            output: ''
        }
        sb.output += root.data
    
        const pointerRight = LAST_CHILDREN
        const pointerLeft = root.right != null ? TWO_CHILDREN : LAST_CHILDREN
    
        this._prettyPreOrderHelper(sb, "", pointerLeft, root.left, root.right != null)
        this._prettyPreOrderHelper(sb, "", pointerRight, root.right, false)
    
        return sb.output
    }

    private _prettyPreOrderHelper(sb: { output: string }, padding: string, pointer: string, node: NodeBinaryTree<T> | null, hasRightSibling: boolean) {
        if (node) {
            const { VERITICAL, TWO_CHILDREN, LAST_CHILDREN } = CONSOLE_POINTERS

            sb.output += "\n"
            sb.output += padding
            sb.output += pointer
            sb.output += node.data
      
            let paddingBuilder = padding
            if (hasRightSibling) {
                paddingBuilder += VERITICAL + '  '
            } else {
                paddingBuilder += "   "
            }
      
            const paddingForBoth = paddingBuilder
            const pointerRight = LAST_CHILDREN
            const pointerLeft = node.right != null ? TWO_CHILDREN : LAST_CHILDREN
      
            this._prettyPreOrderHelper(sb, paddingForBoth, pointerLeft, node.left, node.right != null)
            this._prettyPreOrderHelper(sb, paddingForBoth, pointerRight, node.right, false)
        }
    }
}

