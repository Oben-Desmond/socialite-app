import { UPDATE_USER } from "../constants";



 export function updateUser(payload:any){

       return ({
           type: UPDATE_USER,
           payload
       })

   }