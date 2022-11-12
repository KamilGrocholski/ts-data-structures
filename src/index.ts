import { StackFixed } from './stacks'

export * from './arrays'
export * from './binaryTrees'
export * from './linkedLists'
export * from './queues'
export * from './stacks'

const fs = new StackFixed(1)

fs.push(1)
console.log(fs.toArray())