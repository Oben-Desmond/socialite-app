import { accountInterface } from "../../components/service/serviceTypes";


const initServiceAccount: accountInterface = {
    code: ``,
    country: ``,
    location: { long: 0, lat: 0 },
    tel: ``,
    timestamp: 0,
    type: `company`,
    users: []
}


const actions = {
    update_account: (payload: accountInterface) => {
        return ({
            type: `update_account`,
            payload
        })
    }
}


const reducers = {

}

export default function serviceReducer(state = initServiceAccount, action: { type: string, payload: any }) {

    switch (action.type) {
        case `update_account`: return action.payload;
        default: return state

    }
}

export const selectServiceAccount=(state:any)=>state.serviceReducer

export const {update_account} = actions


