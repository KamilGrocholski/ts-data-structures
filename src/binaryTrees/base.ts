import { Comparator } from "../utils/types"

export interface Config<T> {
    /**
     * A function to compare other values than the primitives,
     * on default the comparison is made with `data1 >= data2` 
     * @param data1 `T`
     * @param data2 `T`
     * @returns `boolean`
     */
    isEqual?: Comparator<T>
    isBigger?: Comparator<T>
}

export class NodeBinaryTree<T> {
    public data: T
    public left: NodeBinaryTree<T> | null = null
    public right: NodeBinaryTree<T> | null = null

    constructor (data: T) {
        this.data = data
    }

    static createOne<D>(data: D): NodeBinaryTree<D> {
        return new NodeBinaryTree(data)
    }
}

export class BaseBinaryTree<T> {
    public size = 0
    private _defaultIsEqual: Comparator<T> = (d1: T, d2: T) => d1 === d2
    private _defaultIsBigger: Comparator<T> = (d1: T, d2: T) => d1 > d2
    public isEqual: Comparator<T>
    public isBigger: Comparator<T>

    constructor(config: Config<T>) {
        this.isEqual = config.isEqual ?? this._defaultIsEqual
        this.isBigger = config.isBigger ?? this._defaultIsBigger
    }
}