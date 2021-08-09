import { UPDATE_COUNTRY_INFO } from "../constants"



export const updateCountry= (payload:any)=>{

    return( {
        type:UPDATE_COUNTRY_INFO,
        payload
    })
}