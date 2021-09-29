export interface accountInterface{
    name:string,
    country:string,
    code:string,
    users:string[],
    type:`defence`|`firefighter`|`company`|`health`|`municipal`|string,
    timestamp:number,
    tel:string,
    location:{
        lat:number,
        long:number
    };
    geohash:string


}


export interface accUser{
    name:string,
    photoUrl:string,
    email:string,
    last_signIn:number
}


export interface availableAccount{
    name:string,
    emergency__contact:string,
    location:{long:number, lat:number},
    code:string,
    emails:string[],
    geohash:string
}