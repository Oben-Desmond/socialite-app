export interface accountInterface{
    country:string,
    code:string,
    users:accUser[],
    type:`defence`|`firefighter`|`company`|`health`|`municipal`,
    timestamp:number,
    tel:string

}


export interface accUser{
    name:string,
    photoUrl:string,
    email:string,
    last_signIn:string
}