// @flow strict


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { StatusBar } from '@capacitor/status-bar';
import { IonBackdrop, IonButton, IonButtons, IonCardContent, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSlide, IonSlides, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { add, arrowBack, cameraOutline, close, images, trashOutline } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { hideTabBar } from '../App';
import { Pictures } from './images/images';
import "./style/Home.css";
import "./style/incident.css";
import ImageSlide from '../components/image slides';
import ReportCard from '../components/service/reportCard';


const IncidentReport: React.FC = () => {
    const [images, setimages] = React.useState<string[]>([])
    const history = useHistory()
    function goBack() {
        history.goBack()
    }

    function getPhotos() {
        Camera.getPhoto({ resultType: CameraResultType.DataUrl, source: CameraSource.Photos }).then((res: any) => {
            setimages([...images, res.dataUrl]);
        })
    }
    function deleteItem(item: number) {
        const imgs = images
        imgs.splice(item, 1)
        setimages([...imgs])
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Incident</IonTitle>
                    <IonButton size={`small`} slot={`end`} fill={`outline`} color={`secondary`}>
                        <IonLabel>switch to personal</IonLabel>
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <ReportCard></ReportCard>
                <ReportCard></ReportCard>
                <ReportCard></ReportCard>
                <ReportCard></ReportCard>
                <ReportCard></ReportCard>

            </IonContent>
            <IonFab horizontal={`end`} vertical={`bottom`}>
                <IonFabButton>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    );
};

export default IncidentReport;

