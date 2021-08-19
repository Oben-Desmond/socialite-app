import { ReviewItemInterface } from "../../interfaces/classifiedItems"

const initstate: ReviewItemInterface[] = [
    { id: `1jhbghshjdh`, photoUrl: ``, rating: 3, text: ` zx zznxbnzbjhz zbxnbz nzbxn  jabjsba aijashbdvb abashasghsgahJ ABSGHASB NAVSGHAHB ABSNBHAJHJA ` ,timestamp:Date.now(),username:`Agata Moses`,email:`obend678@gmail.com`}]

const reducers: any = {
    update_reviews: (state:ReviewItemInterface[] ,payload: ReviewItemInterface) => {
        return [...state,payload]
    },
    group_update_reviews:(state:ReviewItemInterface[] ,payload: ReviewItemInterface[]) => {
        return ([...state, ...payload])
    }
}
const actions: any = {
    update_reviews: (payload: ReviewItemInterface) => {
        return ({ type: `update_reviews`, payload })
    },
    group_update_reviews: (payload: ReviewItemInterface) => {
        return ({ type: `group_update_reviews`, payload })
    }
}
const ClassifiedReviewsReducer = (state = initstate, action: { type: string, payload: any }) => {
    console.log(action.type)
    switch (action.type) {
        case `update_reviews`: return reducers[action.type](action.payload);
        case ` group_update_reviews`: return reducers[action.type](action.payload);
        default:
            return state
    }
}




export const selectClassifiedReviews = (state: any) => state.ClassifiedReviewsReducer


export const { update_reviews ,group_update_reviews} = actions

export default ClassifiedReviewsReducer

export { }