import { availableAccount } from "../components/service/serviceTypes";

export interface reportInterface {
    
    category:string,
    description:string,
    author:string,
    timestamp:number,
    images:string[],
    location:{
        long:number,
        lat:number
    }|undefined,
    sentTo:availableAccount[],
    seenBy:availableAccount[],
    country:string,
    photoUrl:string,
    id:string,
    username:string
}

export interface serviceProvider{
    code:string,
    name:string,
    country:string,
    allowed:string[],
    emergency__contact:string,
    rating:number 
}