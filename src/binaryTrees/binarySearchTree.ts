import { BaseBinaryTree, Config, NodeBinaryTree } from "./base";

interface BinarySearchTreeOperations<T> {
    insert(data: T): NodeBinaryTree<T>
    insertMany(data: T[]): void

    find(data: T, root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMin(root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findMax(root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findParent(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | undefined
    findPath(data: T, root: NodeBinaryTree<T> | null): T[] | undefined
    findPathGiven(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null): T[] | undefined

    remove(data: T, root: NodeBinaryTree<T> | null): NodeBinaryTree<T> | null
    removeGiven(node: NodeBinaryTree<T>): NodeBinaryTree<T> | null
}

export class BinarySearchTree<T> extends BaseBinaryTree<T> implements BinarySearchTreeOperations<T> {

    constructor(config: Config<T> = {}) {
        super(config)
    }

    insert(data: T): NodeBinaryTree<T> {
        const newNode = NodeBinaryTree.createOne(data)
        this.size++

        if (!this.root) return this.root = newNode

        const insertRec = (data: T, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | null => {
            if (!root) return null

            if (this.compare(data, root.data) === -1) {
                if (root.right) return insertRec(data, root.right)
                return root.right = newNode
            }
            if (this.compare(data, root.data) === 1) {
                if (root.left) return insertRec(data, root.left)
                return root.left = newNode
            }

            return null
        }

        insertRec(data)

        return newNode
    }

    insertMany(data: T[]): void {
        data.forEach(d => this.insert(d))
    }

    find(data: T, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return 

        const comparison = this.compare(data, root.data)

        if (comparison === 0) return root

        if (comparison === -1) return this.find(data, root.right)

        return this.find(data, root.left)
    }

    findMin(root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return

        if (root.left) return this.findMax(root.left)

        else return root
    }

    findMax(root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return

        if (root.right) return this.findMax(root.right)

        else return root
    }

    findParent(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | undefined {
        if (!root) return 
        if (node === root) return node
        if (!root.left && !root.right) return 
        if (root.left) return this.findParent(node, root.left)
        if (root.right) return this.findParent(node, root.right)
        if (this.compare(node.data, root.data) === -1) return this.findParent(node, root.right)
        return this.findParent(node, root.left)
    }

    findPath(data: T, root: NodeBinaryTree<T> | null = this.root): T[] | undefined {
        const path: T[] = []

        if (!root) return 

        const findPathRec = (root: NodeBinaryTree<T> | null) => {
            if (!root) return 

            const comparison = this.compare(data, root.data)

            if (comparison === -1) {
                path.push(root.data)
                findPathRec(root.right)
            }
            else if (comparison === 1) {
                path.push(root.data)
                findPathRec(root.left) 
            }
            else {
                path.push(root.data)
            } 
        }

        findPathRec(root)

        return (path.length > 0 && this.compare(path[path.length - 1], data) === 0) ? path : undefined 
    }

    findPathGiven(node: NodeBinaryTree<T>, root: NodeBinaryTree<T> | null = this.root): T[] | undefined {
        if (!root) return 

        const path: T[] = []

        const findPathGivenRec = (root: NodeBinaryTree<T> | null) => {
            if (!root) return 

            const comparison = this.compare(node.data, root.data)

            if (node === root) {
                path.push(root.data)
                return 
            } 
            if (comparison === -1) {
                path.push(root.data)
                findPathGivenRec(root.right)
            } 
            else if (comparison === 1) {
                path.push(root.data)
                findPathGivenRec(root.left)
            }
        }

        findPathGivenRec(root)

        return (path.length > 0 && this.compare(path[path.length - 1], node.data) === 0) ? path : undefined 
    }

    remove(data: T, root: NodeBinaryTree<T> | null = this.root): NodeBinaryTree<T> | null {
        if (!root) return null

        const comparison = this.compare(data, root.data)
        // Case 1 a > b
        if (comparison === -1) root.right = this.remove(data, root.right)

        // Case 2 a < b 
        else if (comparison === 1) root.left = this.remove(data, root.left)

        // Case 3 a === b
        else {
            // Sub Case 1  
            if (!root.left && !root.right) {
                this.size--
            return null
            }
            
            // Sub Case 2 & 3
            if (!root.left || !root.right) {
                this.size--

                return root.left ? root.left : root.right
            }

            // Sub Case 4
            this.size--
            let temp = root.left
            while (temp.right) temp = temp.right
            root.data = temp.data
            root.left = this.remove(temp.data, temp.left)
        }
        return root
    }

    removeGiven(node: NodeBinaryTree<T>): NodeBinaryTree<T> | null {
        const foundParent = this.findParent(node)

        return this.remove(node.data, foundParent)
    }
}