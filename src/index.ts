import { LinkedListSingle, LinkedListSingleCircular } from "./linkedLists"


export const app = () => {
    const l1 = new LinkedListSingle<number>()

    l1.appendOne(1)
    l1.appendOne(2)
    l1.appendOne(3)


    l1.removeTail()

    console.log(l1.toArray())
}

app()
