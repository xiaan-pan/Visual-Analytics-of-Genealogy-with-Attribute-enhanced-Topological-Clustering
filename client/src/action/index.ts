import { CHANGE_CLUSTER_NUMBER, CHANGE_SCATTER_LOADING } from "../types/actionTypes";
import { ScatterType } from "../types/propsTypes";


export const changeClusterNumber = (scatterData: ScatterType) => ({
    type: CHANGE_CLUSTER_NUMBER,
    scatterData
})

export const changeScatterLoading = (isLoading: boolean, isLoadingText: string) => ({
    type: CHANGE_SCATTER_LOADING,
    isLoading,
    isLoadingText
})