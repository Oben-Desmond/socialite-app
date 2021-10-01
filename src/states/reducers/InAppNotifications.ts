import { InAppNotification } from "../../interfaces/notifications";

const initialNotifications:NotificationRedux = { new: false, notifications: [] };

export interface NotificationRedux {
        notifications: InAppNotification[],
        new: boolean
}
interface ActionUpdate {
    type: 'update_notifications',
    payload: InAppNotification[] 
}

interface ActionNew {
    type: 'update_new',
    payload: boolean 
}
interface actions {
    'update_notifications': (payload: InAppNotification[]) => ActionUpdate;
    'update_new': (payload: boolean) => ActionNew;
}

const actions: actions = {
    update_notifications: (payload: InAppNotification[]): ActionUpdate => ({
        type: 'update_notifications',
        payload
    }),
    update_new: (payload: boolean): ActionNew => ({
        type: 'update_new',
        payload
    }),
}

const NotificationReducer = (state = initialNotifications, action: ActionUpdate|ActionNew):NotificationRedux => {

    switch (action.type) {
        case 'update_notifications': return ({...state, notifications:action.payload});
        case 'update_new': return ({...state, new:action.payload});

        default: return state;
    }
}


export const selectNotification = (state: any) => state.NotificationReducer

export const { update_notifications } = actions;

export default NotificationReducer