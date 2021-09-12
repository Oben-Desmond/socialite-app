import { LocalNotifications } from '@capacitor/local-notifications'



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
                title: 'Triumph30',
                body: 'my notifcation',
                id: new Date().getTime(),
                schedule: {
                    at: (new Date(Date.now() + 5000)), allowWhileIdle: true,
                }
            },{
                title: 'notification sent',
                body: 'my notifcation',
                id: new Date().getTime(),
                schedule: {
                    at: (new Date(Date.now() + 5000)), allowWhileIdle: true,
                }
            }]
        });
    } catch (error) {
        console.error(error);
    }
}