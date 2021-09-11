import { Dialog } from "@capacitor/dialog";
import { reportInterface } from "../../interfaces/reportTypes";
import { fstore } from "../Firebase";



export function getServicesNearBy(place:string,category:string){
    return (new Promise((resolve, reject)=>{
        fstore.collection(`business`).doc(place).collection(category).get().then(snapshot=>{
             const docs = snapshot.docs.map(doc=> doc.data());
             resolve(docs)
             if(docs.length<=0){
                 Dialog.alert({message:'no avalaible service Providers near by',title:'service providers in your country'});
             }
        }).catch(reject)
    }));
}

export async function  ReportIncident (incident:reportInterface){

}