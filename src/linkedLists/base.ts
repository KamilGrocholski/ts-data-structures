export type Comparator<T> = (d1: T, d2: T) => boolean;

export interface Config<T> {
    comparator?: Comparator<T>
}

abstract class NodeBase<T> {
    public data: T

    constructor(data: T) {
        this.data = data
    }
}

export class NodeNext<T> extends NodeBase<T> {
    public next: NodeNext<T> | null = null

    constructor(data: T) {
        super(data)

    }
}

export class NodePrevNext<T> extends NodeBase<T> {
    public next: NodePrevNext<T> | null = null
    public prev: NodePrevNext<T> | null = null

    
    constructor(data: T) {
        super(data)
    }
    
    static createNode = <W>(data: W) => new NodePrevNext(data)
}

export abstract class BaseLinkedList<T> {
    public length = 0
    private _defaultComparator: Comparator<T> = (d1: T, d2: T) => d1 === d2
    public comparator: Comparator<T>

    constructor(config: Config<T>) {
        this.comparator = config.comparator ?? this._defaultComparator
    }
}