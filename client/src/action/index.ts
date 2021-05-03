import { CHANGE_CLUSTER_NUMBER, CHANGE_SCATTER_LOADING, SELECT_TREE } from "../types/actionTypes";
import { ScatterType } from "../types/propsTypes";


export const changeClusterNumber = (scatterData: ScatterType, attrs:Array<string>) => ({
    type: CHANGE_CLUSTER_NUMBER,
    scatterData,
    attrs
})

export const changeScatterLoading = (isLoading: boolean, isLoadingText: string) => ({
    type: CHANGE_SCATTER_LOADING,
    isLoading,
    isLoadingText
})

export const selectTree = (selectList: {[id: string]: boolean}) => ({
    type: SELECT_TREE,
    selectList
})