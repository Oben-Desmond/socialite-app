import { Dialog } from "@capacitor/dialog";
import { accountInterface, availableAccount } from "../../components/service/serviceTypes";
import { reportInterface } from "../../interfaces/reportTypes";
import { UserInterface } from "../../interfaces/users";
import { fstore } from "../Firebase";
import axios from "axios";



export function getServicesNearBy(place: string, category: string) {
    return (new Promise((resolve, reject) => {
        console.log(`business/${place}/${category}`)

        fstore.collection(`service-accounts`).doc(place).collection(category).get().then(snapshot => {
            const docs = snapshot.docs.map(doc => doc.data());
            resolve(docs)
            if (docs.length <= 0) {
                Dialog.alert({ message: 'no avalaible service Providers near by', title: 'service providers in your country' });
            }
        }).catch(reject)
    }));
}

export async function ReportIncident(incident: reportInterface, nearByServices: availableAccount[], country: string,) {
    let emails:string[] = [], em = nearByServices.map(p => p.emails);
    em.map(eml => {
        emails=[...emails, ...eml];
    })
    const provider_queries = nearByServices.map(provider => {
        return fstore.collection('business').doc(`${country}-${provider.code}`).collection('reports').add(incident);
    })
    const reporter_query = fstore.collection('users').doc(`${incident.author}`).collection('reports').doc(incident.id).set(incident);
    axios.post('https://socialiteapp-backend.herokuapp.com/incident/report', { emails, incident })


    return (Promise.all([reporter_query, provider_queries]))
}


export async function markThisIncidentAsRead(report: reportInterface, serviceAccount: accountInterface, callback: () => void) {


    const seenByArr: availableAccount[] = [...report.seenBy, {
        code: serviceAccount.code,
        emergency__contact: serviceAccount.tel,
        location: serviceAccount.location,
        name: serviceAccount.name,
        emails: []
    }];
    const reporter_query = fstore.collection('users').doc(`${report.author}`).collection('reports').doc(report.id).update({ seenBy: seenByArr });

}