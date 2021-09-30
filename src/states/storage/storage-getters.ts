import { Storage } from "@capacitor/storage"
import { accountInterface } from "../../components/service/serviceTypes";


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