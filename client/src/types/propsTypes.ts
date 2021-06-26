/**
 * 散点图单个点的数据类型
 */
export interface ScatterType {
    type: number,
    coor: [number, number],
    label: number,
    attr: {
        [p:string]: number
    }
}

export interface scatterViewType {
    scatterData: Array<ScatterType>,
    isLoading: boolean,
    isLoadingText: string,
    selectList: {[id: string]: boolean}
}

export interface LinesViewType extends scatterViewType {
    attrs: Array<string>
}

export interface treesViewType {
    selectList: {[id: string]: boolean}
}

export interface storeType {
    scatter: scatterViewType,
    lines: LinesViewType,
    trees: treesViewType
}