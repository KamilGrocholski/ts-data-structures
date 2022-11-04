import { BinaryTree } from "./binaryTrees"

export const app = () => {

    const bt1 = new BinaryTree<number>()

    bt1.insertMany([4,3,7,3,8,1,9,10]) 

    console.log(bt1.hasDuplicates())

    console.log(bt1.toPretty())

    // console.log(bt1.size)
    // console.log(bt1.getHeight())
    // console.log(bt1.isFull())
    // console.log(bt1.isPerfect())
    // console.log(bt1.isComplete())
    // // bt1.remove(5)
    // console.log(bt1.isValid())
    // console.log(bt1.isDegenerate())
    // console.log(bt1.toArray())

    // console.log(bt1.size)
    // console.log(bt1.root)
    // bt1.traversePreOrder(node => console.log(node.data))
}

app()
