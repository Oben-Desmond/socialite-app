import { InAppNotification } from "../../interfaces/notifications";

const initialNotifications:InAppNotification[]= [];

interface Action{
    type:'update_notifications',
    payload:InAppNotification[]
}
interface actions{
    'update_notifications': (payload:InAppNotification[])=>Action;
}

const actions:actions={
    update_notifications: (payload:InAppNotification[]):Action=> ({
              type:'update_notifications',
              payload
            })
}

const NotificationReducer = (state=initialNotifications, action:Action)=>{
      
    switch (action.type) {
        case 'update_notifications': return [...state, ...action.payload];
            
        default:return state;
    }
}


export const selectNotification=(state:any)=>state.NotificationReducer

export const {update_notifications} = actions;

export default NotificationReducer