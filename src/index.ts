import { BinaryTree } from "./binaryTrees"

export const app = () => {

    const bt1 = new BinaryTree<number>()

    bt1.insertOne(2)
    bt1.insertOne(2)
    bt1.insertOne(1)
    bt1.insertOne(1)
    // bt1.insertMany([1,2,3,4,5,6,7])

    bt1.traversePreOrder(node => console.log(node.data))
}

app()
