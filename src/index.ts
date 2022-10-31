import { LinkedListDouble, LinkedListSingle, LinkedListSingleCircular } from "./linkedLists"
import { QueueDynamic, QueueFixed } from "./queues"
import { StackDynamic, StackFixed } from "./stacks"

export const app = () => {
    const q1 = new LinkedListSingleCircular<number>()

    q1.appendMany([1,2,3])
    q1.prependMany([0,-1,-2])
    q1.clear()
    const w  = q1.toArray()
    q1.removeHead()
    console.log(w)
}
app()
