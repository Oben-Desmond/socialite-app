
import { Dialog } from "@capacitor/dialog";
import firebase from "firebase";
import { Advert } from "../../interfaces/adverts_interfaces";
import { db, storage } from "../Firebase";



export async function uploadAd(advert: Advert) {

    try {
        await db.ref(`unapproved`).child(advert.id).set(advert);
        await db.ref(`company-ads`).child(advert.company_id).child(advert.id).set(advert);
    } catch (err) {
        Dialog.confirm({ message: err.message || err, title: `unable to upload advert` })
    }
}


export function uploadImageFile(blob: Blob, data: { name: string, company: string, id: string, country: string }, callBack: (progress: number) => void, onSuccess: (url: string) => void) {
    const { name, company, id, country } = data;
    const uploadTask = storage.ref(`adverts/${country}/${company}/${id}.png`).put(blob)
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        callBack(snapshot.bytesTransferred / snapshot.totalBytes)
    }, (err) => {
        Dialog.confirm({ message: err.message, title: `unable to upload advert` })
    }, async () => {
        const url =  await uploadTask.snapshot.ref.getDownloadURL()
        if(url){
            onSuccess(url)
        }

    })

}


export async function approveAd(advert: Advert) {

    try {
        db.ref(`unapproved`).child(advert.id).update({ approve_timestamp: Date.now() });
        await db.ref(`company-ads`).child(advert.company_id).child(advert.id).update({ approve_timestamp: Date.now() });
        await db.ref(`ads`).child(advert.country).child(advert.id).set(advert);
    } catch (err) {
        Dialog.confirm({ message: err.message || err, title: `Failed to approve` })
    }
}


export async function disApproveAd(advert: Advert, message: string) {


    try {
        await db.ref(`unapproved`).child(advert.country).child(advert.id).update({ disapproved_message: message });
        await db.ref(`company-ads`).child(advert.company_id).child(advert.id).update({ disapproved_message: message });
    } catch (err) {
        Dialog.confirm({ message: err.message || err, title: `Failed to disapprove` })
    }
}



export function getAds(country: string, callBack: (ads: Advert[]) => void) {
    try {
        db.ref(`ads`).child(country).limitToLast(20).on(`value`, (snapshot) => {
            const value = snapshot.val()
            if (value) {
                callBack(Object.values(value))
            }
            else {
                callBack([])
            }
        })
    } catch (err) {
        Dialog.confirm({ message: err.message || err, title: `Failed to disapprove` })
    }
}


export async function deleteAd(advert: Advert) {

    try {
        await db.ref(`unapproved`).child(advert.id).remove();
        await db.ref(`company-ads`).child(advert.company_id).child(advert.id).remove();
        await db.ref(`ads`).child(advert.country).child(advert.id).remove();
    } catch (err) {
        Dialog.confirm({ message: err.message || err, title: `unable to upload advert` })
    }
}




