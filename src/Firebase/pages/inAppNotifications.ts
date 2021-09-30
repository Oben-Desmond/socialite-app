import { InAppNotification } from "../../interfaces/notifications";
import { db } from "../Firebase";



export const sendInAppNotification =async  (param:{notification:InAppNotification, reciever:string, country:string})=>{
   const {notification, reciever, country}=param;
   
   return db.ref('notification-channels').child(country).child(sanitizeDBId(reciever)).child(sanitizeDBId(notification.id)).set(notification)

}


export const getInAppNotifications =async  (param:{ user_email:string, country:string, callBack:(notifications:InAppNotification[])=>void})=>{
    const {user_email, country, callBack}=param;
    
    db.ref('notification-channels').child(country).child(sanitizeDBId(user_email)).once('value',(snapshot)=>{
          const value = snapshot.val()
          if(value){
              const temp:any[] = Object.values(value);
              console.log(temp,'get notifications')
              callBack(temp);
            }
          else{
              callBack([])
          }
    })
 
 }


 export const ListenForInAppNotifications =async  (param:{ user_email:string, country:string, callBack:(notifications:InAppNotification[])=>void})=>{
    const {user_email, country, callBack}=param;
    
    db.ref('notification-channels').child(country).child(sanitizeDBId(user_email)).once('child_added',(snapshot)=>{
          const value:any = snapshot.val()
          if(value){
               const notification:InAppNotification=value
               console.log(value)
            }
          else{
              callBack([])
          }
    })
 
 }
 

export function sanitizeDBId(id:string):string{
    id=id.replaceAll('.','').trim()
    return id
}