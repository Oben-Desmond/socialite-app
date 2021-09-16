import { Storage } from "@capacitor/storage"


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