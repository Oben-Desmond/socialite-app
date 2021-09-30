import { LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications'
import { InAppNotification } from '../../interfaces/notifications';



export async function scheduleNotif() {
    try {
        // Request/ check permissions
        //   if (!(await LocalNotifications.requestPermission()).granted) return;

        // Clear old notifications in prep for refresh (OPTIONAL)
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0)
            await LocalNotifications.cancel(pending);
        console.log('notify me_______________--')
        await LocalNotifications.schedule({
            notifications: [{
                title: 'socionet notification',
                body: 'curently working on the notification feature',
                id: new Date().getTime(),
                schedule: {
                    at: (new Date(Date.now() + 5000)), allowWhileIdle: true,
                }
            }, {
                title: 'socionet',
                body: 'socionet notification loading...',
                id: 76545,
                schedule: {
                    at: (new Date(Date.now() + 5000)), allowWhileIdle: true,
                }
            }]
        });
    } catch (error) {
        console.error(error);
    }
}


export async function showInAppNotification(notification: InAppNotification) {
  
    try {
        // Request/ check permissions
        //   if (!(await LocalNotifications.requestPermission()).granted) return;

        // Clear old notifications in prep for refresh (OPTIONAL)
        const pending = await LocalNotifications.getPending();
        // if (pending.notifications.length > 0)
        //     await LocalNotifications.cancel(pending);
        const obj:any={}
        pending.notifications.map(info=>{
            obj[info.title]=info;
        })
        const notifs:PendingLocalNotificationSchema[]|any[]= Object.values(obj);
 
        await LocalNotifications.schedule({
            notifications: [
                ...notifs
                ,
                commentNotification(notification)
            ]
        });
    } catch (error) {
        console.error(error);
    }
}


const commentNotification = (notification: InAppNotification) => ({
    title: notification.sender_name||notification.sender||'Someone' + ' commented on your post',
    body: notification.message,
    id: new Date().getTime(),
    schedule: {
        at: (new Date(Date.now() + 3000)), allowWhileIdle: true,
    }
})