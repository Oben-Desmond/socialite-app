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
                title: 'socionet notification',
                body: 'curently working on the notification feature',
                id: new Date().getTime(),
                schedule: {
                    at: (new Date(Date.now() + 5000)), allowWhileIdle: true,
                }
            },{
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