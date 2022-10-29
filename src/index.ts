import { DoubleLinkedList } from "./linkedLists/doubleLinkedList"


export const app = () => {
    const l1 = new DoubleLinkedList<number>()
    // l1.appendOne(0)
    // l1.appendOne(1)
    // l1.appendOne(1)
    l1.removeHead()
    console.log(l1.findOneAt(0)?.data)
    console.log(l1.length)
}
app()
