import { combineReducers } from 'redux'
import { CHANGE_CLUSTER_NUMBER, CHANGE_SCATTER_LOADING, SELECT_TREE } from '../types/actionTypes'
import { LinesViewType, scatterViewType, storeType, treesViewType } from '../types/propsTypes'


const initStore:storeType = {
    scatter: {
        scatterData: [],
        isLoading: false,
        isLoadingText: '降维中...',
        selectList: {}
    },
    lines: {
        scatterData: [],
        isLoading: false,
        isLoadingText: '降维中...',
        attrs: [],
        selectList: {}
    },
    trees: {
        selectList: {}
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
    } else if (type === SELECT_TREE) {
        const {selectList} = action
        return {
            ...state,
            selectList
        }
    }
    return state
}

const linesReducer = (state: LinesViewType = initStore.lines, action: any) => {
    const { type } = action
    if (type === CHANGE_CLUSTER_NUMBER) {
        const { scatterData, attrs } = action
        // console.log('object', scatterData)
        return {
            ...state,
            scatterData,
            attrs
        }
    } else if (type === CHANGE_SCATTER_LOADING) {
        const { isLoading, isLoadingText } = action
        return {
            ...state,
            isLoading,
            isLoadingText
        }
    } else if (type === SELECT_TREE) {
        const {selectList} = action
        return {
            ...state,
            selectList
        }
    }
    return state
}

const treesReducer = (state: treesViewType = initStore.trees, action: any) => {
    const { type } = action

    if (type === SELECT_TREE) {
        const {selectList} = action
        return {
            ...state,
            selectList
        }
    }
    return state
}

const combineReducer = combineReducers({
    scatter: scatterReducer,
    lines: linesReducer,
    trees: treesReducer
})
const reducer = (state:storeType = initStore, action:any) => {
    const store1:storeType = combineReducer(state, action)
    return store1
}
export default reducer

