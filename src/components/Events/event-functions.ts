import { Dialog } from "@capacitor/dialog";
import { fstore } from "../../Firebase/Firebase";
import { PostInterface } from "../../interfaces/posts";





export function fetchEventById(id: string, country: string, callBack: (val: PostInterface | any) => void, failed: (err: any) => void) {
    setTimeout(() => {
        fstore.collection(`posts`).doc(country).collection(`events`).doc(id)
            .get().then(snapshot => {
                if (snapshot.data()) {
                    callBack(snapshot.data());
                    return;
                }
                failed({ message: `no data` })
                Dialog.alert({ title: `Error getting Post`, message: `Post does not Exist. it may have been deleted` })
            }).catch((err) => {
                Dialog.alert({ title: `Error getting Post`, message: err.message || err || `` })
                failed(err)
            })
    }, 1000);


}