import { fstore } from "../../Firebase/Firebase";
import { UserInterface } from "../../interfaces/users";

export function fetchMyItems(user:UserInterface){
    return ((new Promise((resolve,reject)=>{
        console.log(user.email)
        fstore.collection(`classified`).where(`item_contact.user_email`,`==`,`${user.email}`).get().then(snapshot=>{
            const items= snapshot.docs.map(item=>item.data());
            resolve(items)
        }).catch(reject)
    })))
}