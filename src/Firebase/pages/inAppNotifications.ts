import { InAppNotification } from "../../interfaces/notifications";
import { db } from "../Firebase";



export const sendInAppNotification = async (param: { notification: InAppNotification, reciever: string, country: string }) => {
    const { notification, reciever, country } = param;

    return db.ref('notification-channels').child(country).child(sanitizeDBId(reciever)).child(sanitizeDBId(notification.id)).set(notification)

}


export const getInAppNotifications = async (param: { user_email: string, country: string, callBack: (notifications: InAppNotification[]) => void }) => {
    const { user_email, country, callBack } = param;

    db.ref('notification-channels').child(country)
        .child(sanitizeDBId(user_email))
        .on('value', (snapshot) => {
            const value = snapshot.val()
            if (value) {
                const temp: any[] = Object.values(value);
                console.log(temp, 'get notifications')
                callBack(temp);
                // db.ref('notification-channels').remove()
            }
            else {
                callBack([])
            }
        })

}


export const ListenForInAppNotifications = async (param: { user_email: string, country: string, callBack: (notifications: InAppNotification) => void }) => {
    const { user_email, country, callBack } = param;
    let initial = true;
    db.ref('notification-channels').child(country).child(sanitizeDBId(user_email)).limitToLast(1).on('child_added', (snapshot) => {
        const value: any = snapshot.val()
        if (value) {
            const notification: InAppNotification = value
            if (initial) {
                initial = false;
            }
            else {
                console.log(value)
                // alert(JSON.stringify(value))
               callBack(notification)
            }
        }
        else {
             
        }
    })

}


export function sanitizeDBId(id: string): string {
    id = id.replaceAll('.', '').trim()
    return id
}