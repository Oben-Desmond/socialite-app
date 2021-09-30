import { Dialog } from "@capacitor/dialog";
import { accountInterface, availableAccount } from "../../components/service/serviceTypes";
import { reportInterface } from "../../interfaces/reportTypes";
import { UserInterface } from "../../interfaces/users";
import { db, fstore, storage } from "../Firebase";
import axios from "axios";
import { scheduleNotif } from "../../components/notifications/notifcation";
import { CustomEmail } from "../../interfaces/emailtypes";
import { sendNotification } from "./notifications";



export function getServicesNearBy(place: string, category: string) {
    return (new Promise(async (resolve, reject) => {
        console.log(`business/${place}/${category}`)

        fstore.collection(`service-accounts`).doc(place).collection(category).get().then(snapshot => {
            const docs = snapshot.docs.map(doc => doc.data());
            resolve(docs)
            if (docs.length <= 0) {
                Dialog.alert({ message: 'no avalaible service Providers near by', title: 'No service providers in your country' });
            }
        }).catch(reject)
    }));
}

export async function ReportIncident(incident: reportInterface, nearByServices: availableAccount[], country: string,) {
    let emails: string[] = [], em;
    try {
        em = nearByServices.map(p => p.emails);
        em.map(eml => {
            emails = [...emails, ...eml];

        })
    } catch {
       emails=[]
    }
    const urls: any = await uploadImages(incident.images, incident.author, incident.country)
    incident = {
        ...incident, images: urls
    }
    const provider_queries = nearByServices.map(provider => {
        return fstore.collection('business').doc(`${country}-${provider.code}`).collection('reports').add(incident);
    })

    const reporter_query = fstore.collection('users').doc(`${incident.author}`).collection('reports').doc(incident.id).set(incident);
    emailIncident(emails, incident)

    // scheduleNotif();
    return (Promise.all([reporter_query, provider_queries]))
}


export async function markThisIncidentAsRead(report: reportInterface, serviceAccount: accountInterface, callback: () => void) {


    const seenByArr: availableAccount[] = [...report.seenBy, {
        code: serviceAccount.code,
        emergency__contact: serviceAccount.tel,
        location: serviceAccount.location,
        name: serviceAccount.name,
        emails: [],
        geohash: serviceAccount.geohash
    }];
    const reporter_query = fstore.collection('users').doc(`${report.author}`).collection('reports').doc(report.id).update({ seenBy: seenByArr });

}


function emailIncident(emails: string[], incident: reportInterface) {

    for (let i in emails) {
        let email: CustomEmail = {
            fromName: 'An Incident Just Occured',
            html: incidentEmailTemplate(incident),
            subject: incident.description.substr(0, 100) + '...',
            text: '',
            to: emails[i]
        }

        axios.post('https://socialiteapp-backend.herokuapp.com/email/custom', { email })
        sendNotification({
            data: {
                id: incident.id,
                type: 'report',
            },
            email: emails[i],
            notification: {
                body: incident.description,
                image: incident.images.length > 0 ? incident.images[0] : 'https://media.istockphoto.com/photos/closeup-of-kids-helmet-and-bike-on-a-pedestrian-lines-after-danger-picture-id1060880044?s=612x612',
                title: 'New Incident reported by ' + incident.username
            }
        })

    }
}


function uploadImages(images: string[], user: string, country: string) {

    if (images.length <= 0) return new Promise((resolve) => resolve([]));
    try {

        const queries = images.map(async (image) => {

            let blob = await (await fetch(image)).blob();
            let uploadTask = storage.ref('reports').child(country).child(user).child((new Date()).toDateString()).put(blob);
            return (await uploadTask).ref.getDownloadURL()

        })

        return Promise.all(queries)
    }
    catch (err) {
        Dialog.alert({ message: err.message || err, title: 'image upload error' });
    }
    return new Promise((resolve) => resolve([]));

}

function incidentEmailTemplate(incident: reportInterface) {
    return (
        `
        
        <body>
    <style>
        * {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
  

        div.chip:active {
            opacity: 0.1;
        }

        .intro {
            margin: 10px;
        }

        p {
            padding: 13px;
            color: rgb(69, 68, 68);
        }

        img {
            margin: 20px auto;
            max-height: 40vh;
        }
        
        button:active {
            opacity: 0.7;
        }
    </style>
    <div>
        <h2 style='font-size: 14px;
        color: grey;'>Socialite Incident Report</h2>
        <div class="chip" style='padding: 6px;
        max-width: max-content;
        border: 1px solid red;
        color: red;
        border-radius: 30px;
        font-size: 13px;'>
           ${incident.category}
        </div>
        <div class="intro">Incident Reported By <b>${incident.author}</b></div>
        <div style="text-align: center;">
            <img src="${incident.images.length > 0 ? incident.images[0] : ''}"
                alt="">
        </div>
        <p>
            ${incident.description
        }    
        </p>
        <a href="https://socionet.co.za/reports/${incident.id}">
        <button style='padding: 10px;
        border: none;
        background-color: rgb(189, 136, 36);
        color: white;
        margin: 10px 20px;
        outline: none;
        box-shadow: 1px 2px 10px rgba(135, 135, 135, 0.571);
 '>VIEW FULL REPORT IN APP</button>
    </a>
        <iframe src="http://maps.google.com/maps?q=${incident.location?.lat}, ${incident.location?.long}&z=15&output=embed" height="450"
            style="border: 0; width:100%" loading="lazy"></iframe>

    </div>
</body>
        
        
        `
    )
}