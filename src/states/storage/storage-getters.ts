import { Storage } from "@capacitor/storage"
import { accountInterface } from "../../components/service/serviceTypes";
import { InAppNotification } from "../../interfaces/notifications";


 export const getCountry=async()=>{
    const str =  (await Storage.get({key:'country'})).value
    if(str){
        return JSON.parse(str);
    }
        return undefined
} 


export const getUser=async()=>{
    const str =  (await Storage.get({key:'user'})).value
    if(str){
        return JSON.parse(str);
    }

        return undefined
} 


export const getLocation=async()=>{
    const str =  (await Storage.get({key:'location'})).value
    if(str){
        return JSON.parse(str);
    }

        return undefined
} 


export const getServiceAccount =async ():Promise<accountInterface|undefined>=>{
    const value =  (await Storage.get({key:'service-code'})).value
    if(value){
        return (JSON.parse(value))
    }
    return undefined
} 


export const setServiceAccount =async (value:accountInterface)=>{
    const str= JSON.stringify(value)
    Storage.set({key:'service-code',value:str})
} 

export const getAppNotifications= async ():Promise<InAppNotification[]> =>{
    const val= (await Storage.get({key:'notifications'})).value
    if(val){
        return JSON.parse(val)
    }
    return []
}



export const setAppNotifications= async (values:InAppNotification[]) =>{
    Storage.set({key:'notifications', value:JSON.stringify(values)})
}