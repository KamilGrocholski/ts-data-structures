import { SingleLinkedList } from "./linkedLists"

export const app = () => {
    const q1 = new SingleLinkedList<number>({
        comparator: (d1, d2) => d1 === d2 
    })
    q1.appendMany([0,1])
    q1.prependMany([-2,-1])
    q1.appendOne(2)
    q1.prependOne(-3)
    q1.traverse(node => console.log(node?.data))
    console.log(q1.findOneWhere(0))
    console.log(q1.findTail())
    console.log(q1.updateManyWhere(0, 100))
    console.log(q1.removeOneWhere(100))
    q1.traverse(node => {
        if (node) {
            node.data = 0
        }
    })
    q1.traverse(node => console.log(node?.data))
}

app()

