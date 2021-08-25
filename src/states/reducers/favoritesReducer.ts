import { classifiedItemInterface } from "../../interfaces/classifiedItems"

const initstate:classifiedItemInterface[] = []

const reducers: any = {
    update_favorites: (state:classifiedItemInterface[],payload: classifiedItemInterface) => {
        return [...state,payload]
    },
    remove_from_favorites:(state:classifiedItemInterface[],payload: classifiedItemInterface) => {
        
        return [...state.filter(item=>item.item_id!=payload.item_id)]
    },
    init_favorites:(state:classifiedItemInterface[],payload: classifiedItemInterface[]) => {
        
        return (payload || state)
    }
}
const actions: any = {
    update_favorites:(payload: classifiedItemInterface) => {
        return ({type:`update_favorites`,payload})
    },
    remove_from_favorites:(payload: classifiedItemInterface) => {
        return ({type:`remove_from_favorites`,payload})
    },
     init_favorites:(payload: classifiedItemInterface[]) => {
        return ({type:` init_favorites`,payload})
    }
}
const favoritesReducer = (state = initstate, action: { type: string, payload: any }) => {
    console.log(action.type)
    switch (action.type) {
        case `update_favorites`:return reducers[action.type](state,action.payload); break;
        case `remove_from_favorites`:return reducers[action.type](state,action.payload);break;
        case `init_favorites`:return reducers[action.type](state,action.payload);break;
        default:
           return state
    }
}




export const selectFavorites = (state: any) => state.favoritesReducer


export const {update_favorites, remove_from_favorites ,init_favorites} = actions

export default favoritesReducer

export { }