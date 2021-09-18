export interface accountInterface{
    name:string,
    country:string,
    code:string,
    users:accUser[],
    type:`defence`|`firefighter`|`company`|`health`|`municipal`|string,
    timestamp:number,
    tel:string,
    location:{
        lat:number,
        long:number
    }

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
    emails:string[]
}