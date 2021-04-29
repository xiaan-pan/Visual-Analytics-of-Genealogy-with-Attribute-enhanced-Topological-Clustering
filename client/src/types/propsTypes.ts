/**
 * 散点图单个点的数据类型
 */
export interface ScatterType {
    type: number,
    coor: [number, number],
    label: number
}

export interface scatterViewType {
    scatterData: Array<ScatterType>,
    isLoading: boolean,
    isLoadingText: string,
}


export interface storeType {
    scatter: scatterViewType
}