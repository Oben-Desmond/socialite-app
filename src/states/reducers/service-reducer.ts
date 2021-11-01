import { accountInterface } from "../../components/service/serviceTypes";
import { Storage } from "@capacitor/storage";


export const kServiceAccount = `service_account`



const initServiceAccount: accountInterface =  {
    name: ``,
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
        saveServiceAccount(payload)
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

export const selectServiceAccount = (state: any) => state.serviceReducer

export const { update_account } = actions


async function saveServiceAccount(payload: accountInterface) {
    try {
        await Storage.set({ key: kServiceAccount, value: JSON.stringify(payload) });
        return true
    } catch {
        return false
    }
}

export async function getServiceAccount() :Promise<accountInterface|undefined> {
    try {
        const value = (await Storage.get({ key: kServiceAccount })).value;
        if(value){
            return JSON.parse(value)
        }
         
    }catch {
    }
    return undefined;
}