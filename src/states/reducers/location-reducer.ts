const initstate = {
    long: 0,
    lat: 0,
}

const reducers: any = {
    update_location: (payload: { long: number, lat: number }) => {
        return payload
    }
}
const actions: any = {
    update_location:(payload: { long: number, lat: number }) => {
        return ({type:`update_location`,payload})
    }
}
const locationReducer = (state = initstate, action: { type: string, payload: any }) => {
    switch (action.type) {
        case `update_location`:return reducers[action.type](action.payload);
        default:
           return state
    }
}




export const selectLocation = (state: any) => state.locationReducer


export const { update_location } = actions

export default locationReducer

export { }