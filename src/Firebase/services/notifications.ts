import { Dialog } from "@capacitor/dialog";
import axios from "axios"
import { db } from "../Firebase"

export interface NotificationPayload {
    body: string,
    title: string,
    image: string
}


export interface NotificationData {
    type: string,
    id: string
}
 

export async  function sendNotification(param: { notification: NotificationPayload, data: NotificationData, email: string }) {
    const { data, notification, email } = param;

    db.ref('tokens').child(email.replaceAll('.','')).once('value', (snapshot) => {
        const token = snapshot.val()
        if (token) {
            axios.post('https://socialiteapp-backend.herokuapp.com/message/single', { token, data, notification }).catch((err)=>Dialog.alert({message:err.message||err,title:'notifiaction error'}))
        }
    })//

}



export async  function sendManyNotifications(param: { notification: NotificationPayload, data: NotificationData, emails: string[] }) {
    const { data, notification, emails } = param;

    const tokens = await getTokens(emails)
    if (tokens.length > 0) {
        axios.post('https://socialiteapp-backend.herokuapp.com/message/multiple', { tokens, data, notification }).catch((err)=>Dialog.alert({message:err.message||err,title:'notifiaction error'}))
    }

}


async function getTokens(emails: string[]) {

    try {
        const queryTokens = emails.map((email) => {
            return (new Promise((resolve, reject) => {
                db.ref('tokens').child(email.replaceAll('.','')).once('value', (snapshot) => {
                    const token = snapshot.val()
                    if (token) {
                        resolve(token)
                    }
                    else {
                        resolve('')
                    }
                })
            }))
        })
        return Promise.all(queryTokens).then((res) => {
            return res.filter(token => (token && token != ''));
        })
    } catch (err) {
        alert(err.message || err)
    }

    return [];

}