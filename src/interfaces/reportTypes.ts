
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
    country:string
}

export interface serviceProvider{
    code:number,
    name:string,
    country:string,
}