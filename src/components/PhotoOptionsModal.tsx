// @flow strict

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonContent, IonFabButton, IonHeader, IonIcon, IonModal } from '@ionic/react';
import { cameraOutline, imageOutline } from 'ionicons/icons';
import  React from 'react';
import"./styles/photo-options.css";

const  PhotoOptionsModal:React.FC<{onDidDismiss:()=>void, isOpen:boolean, fromCamera:()=>void, fromPhotos:()=>void}>= ({onDidDismiss,isOpen,fromCamera,fromPhotos})=> {
    return (
       <IonModal isOpen={ isOpen} onDidDismiss={onDidDismiss} cssClass={`photo-option-modal`}>
           
           <div className="option-container">
                <div>
                    <IonFabButton onClick={fromCamera} color={`success`} >
                        <IonIcon icon={cameraOutline}/>
                    </IonFabButton >
                </div>
                <div>
                    <IonFabButton onClick={fromPhotos} color={`danger`} >
                        <IonIcon icon={imageOutline}/>
                    </IonFabButton >
                </div>
           </div>
       </IonModal>
    );
};


export async function photosFromCamera(){
    return (new Promise((resolve, reject)=>{
       Camera.getPhoto({ resultType: CameraResultType.DataUrl,source:CameraSource.Camera , quality:60}).then(res=>{
           resolve(res.dataUrl+``)
       }).catch(reject)
    }))
}
export async function photosFromGallery(){
     return (new Promise((resolve, reject)=>{
        Camera.getPhoto({ resultType: CameraResultType.DataUrl,source:CameraSource.Photos, quality:70 }).then(res=>{
            resolve(res.dataUrl)
        }).catch(reject)
     }))
}

export default PhotoOptionsModal;