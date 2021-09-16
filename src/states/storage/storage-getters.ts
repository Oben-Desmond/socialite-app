import { Storage } from "@capacitor/storage"


 const getCountry=async()=>{
    const str =  (await Storage.get({key:'country'})).value
    if(str){
        return JSON.parse(str);
    }
} 


const getUser=async()=>{
    const str =  (await Storage.get({key:'user'})).value
    if(str){
        return JSON.parse(str);
    }
} 


const getLocation=async()=>{
    const str =  (await Storage.get({key:'location'})).value
    if(str){
        return JSON.parse(str);
    }
} 