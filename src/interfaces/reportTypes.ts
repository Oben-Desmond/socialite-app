
export interface reportInterface {
    
    category:string,
    description:string,
    author:string,
    timestamp:number,
    images:string[],
    location:{
        long:number,
        lat:number
    },
    sentTo:string[],
    seenBy:string[],
    country:string,
    photoUrl:string
}

export interface serviceProvider{
    code:string,
    name:string,
    country:string,
    allowed:string[],
    emergency__contact:string,
    rating:number 
}