import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonModal, IonNote, IonPage, IonRange, IonToolbar } from '@ionic/react';
import { selectLocation } from '../states/reducers/location-reducer';
import { useSelector } from 'react-redux';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { crop, cropOutline, reload } from 'ionicons/icons';

export interface ImageEditModal {
    isOpen: boolean,
    onDidDismiss: (base64Image: string) => void,
    src: string
}


const ImageEditModal: React.FC<ImageEditModal> = ({ isOpen, onDidDismiss, src }) => {

    const [crop, setCrop] = useState<Partial<Crop> | any>({ width: 100, height: 100, unit: `%`, x: 50, y: 30, });
    const [image, setimage] = useState<HTMLImageElement>();
    const [rotate, setrotate] = useState(0);
    // const [srcImg, setSrcImg] = useState<HTMLImageElement>()
    const [edited, setedited] = useState(false)

    const [result, setResult] = useState<any>(src);


    const getCroppedImg = async () => {
        if (!image) return;
        if(!edited) {
            onDidDismiss(src)
            return;
        }
        try {
            const canvas: any = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            const base64Image = canvas.toDataURL("image/jpeg", 1);
            setResult(base64Image)
            onDidDismiss(base64Image)
            return;
            console.log(result);
        } catch (e) {
            console.log("crop the image");
            alert(e)
            onDidDismiss(src)
        }
    };

    function resetEdit(){
        setCrop({ width: 30, height: 30, unit: `%`, x: 50, y: 30, });
        setResult(src)
        setedited(false)
    }


    return (<IonModal onDidPresent={() => { setCrop({ width: 30, height: 30, unit: `%`, x: 50, y: 30, }) }} onDidDismiss={() => onDidDismiss(result)} isOpen={isOpen}>
        <IonHeader>
            <IonToolbar color={`dark`} >
                <IonButtons>
                    <IonButton color={crop.unit == `px` ? `tertiary` : `light`} onClick={() => {
                        setCrop({ ...crop, unit: crop.unit == `px` ? `%` : `px` })
                    }} >
                        <IonIcon icon={cropOutline}></IonIcon>
                    </IonButton>
                    <IonButton onClick={() => setrotate(rotate + 90)} >
                        <IonIcon icon={reload}></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonButtons onClick={getCroppedImg} slot={`end`}  >
                    <IonButton color={`secondary`}>Done</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonToolbar style={{ height: `100vh` }} color={`dark`}>
                <div style={{ marginTop: 30, padding:10, maxHeight:`60vh`}}> <ReactCrop keepSelection rotate={rotate} onImageLoaded={setimage} src={src} crop={crop} onChange={(newCrop: any) => {
                    setedited(true);
                    setCrop(newCrop);
                }} /></div>
                <IonToolbar color={`none`} className="ion-padding">
                    <IonNote>Edit Image</IonNote>
                    <IonButtons slot={`end`}>
                        <IonButton onClick={()=>{resetEdit()}} disabled={!edited} color={`danger`}>reset</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonToolbar>
        </IonContent>

    </IonModal>)


}


export default  ImageEditModal;