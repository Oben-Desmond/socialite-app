import { fstore } from "../Firebase";



export function getNearByServiceAccounts(args:any[]){
    fstore.collection(`business`).doc(`cameroon`).collection(`defence`)
}