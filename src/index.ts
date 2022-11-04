import { BinaryTree } from "./binaryTrees"

export const app = () => {

    const bt1 = new BinaryTree<number>()

    bt1.insertMany([5,2,4,3]) 
    const f = bt1.find(3)
    if (f)
    console.log(bt1.findParent(f))

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
