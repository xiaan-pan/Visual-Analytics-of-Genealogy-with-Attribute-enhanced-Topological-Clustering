import { combineReducers } from 'redux'
import { CHANGE_CLUSTER_NUMBER, CHANGE_SCATTER_LOADING } from '../types/actionTypes'
import { scatterViewType, storeType } from '../types/propsTypes'


const initStore:storeType = {
    scatter: {
        scatterData: [],
        isLoading: false,
        isLoadingText: '降维中...',
    }
}

const scatterReducer = (state: scatterViewType = initStore.scatter, action: any) => {
    const { type } = action
    if (type === CHANGE_CLUSTER_NUMBER) {
        const { scatterData } = action
        // console.log('object', scatterData)
        return {
            ...state,
            scatterData
        }
    } else if (type === CHANGE_SCATTER_LOADING) {
        const { isLoading, isLoadingText } = action
        return {
            ...state,
            isLoading,
            isLoadingText
        }
    }
    return state
}

const combineReducer = combineReducers({
    scatter: scatterReducer
})
const reducer = (state:storeType = initStore, action:any) => {
    const store1:storeType = combineReducer(state, action)
    return store1
}
export default reducer

