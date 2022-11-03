import { BinaryTree } from "./binaryTrees"

export const app = () => {

    const bt1 = new BinaryTree<number>()

    bt1.insert(5)
    bt1.insert(2)
    bt1.insert(7)
    bt1.insert(8)
    bt1.insert(3)
    bt1.insert(1)
    // bt1.insert(3)

    console.log(bt1.size)
    console.log(bt1.getHeight())
    console.log(bt1.isPerfect())
    console.log(bt1.isComplete())
    // bt1.remove(5)
    // console.log(bt1.size)
    // console.log(bt1.root)
    // bt1.traversePreOrder(node => console.log(node.data))
}

app()
