// @flow strict


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { StatusBar } from '@capacitor/status-bar';
import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonSkeletonText, IonSlide, IonSlides, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { add, arrowBack, cameraOutline, close, images, statsChart, statsChartOutline, trashOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { hideTabBar } from '../App';
import { Pictures } from './images/images';
import "./style/Home.css";
import "./style/incident.css";
import ImageSlide from '../components/image slides';
import ReportCard from '../components/service/reportCard';
import { fstore } from '../Firebase/Firebase';
import { reportInterface, serviceProvider } from '../interfaces/reportTypes';
import { UserInterface } from '../interfaces/users';
import { selectUser } from '../states/reducers/userReducers';
import { useSelector } from 'react-redux';


const IncidentReport: React.FC = () => {
    const [images, setimages] = useState<string[]>([])
    const [serviceReports, setserviceReports] = useState<reportInterface[]>([])
    const user: UserInterface = useSelector(selectUser);
    const [noData, setnoData] = useState(false)

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

    React.useEffect(() => {

        const id = Date.now() + (user.email || ``)

        setnoData(false)
        fstore.collection(`reports`).doc(`Cameroon-010001`).collection(`reports`).onSnapshot((snapshot) => {

            const docs: any[] = snapshot.docs.map(doc => doc.data());
            setserviceReports([...docs]);
            console.log(docs)
            if(docs.length<=0) setnoData(true)
        })

    }, [])

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
                <IonList>
                    {!noData && serviceReports.length<=0&& <div>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                    </div>}
                    {
                        serviceReports.map((report, index) => {
                            return (
                                <ReportCard report={report}></ReportCard>
                            )
                        })
                    }
                </IonList>
            </IonContent>
            <IonFab horizontal={`end`} vertical={`bottom`}>
                <IonFabButton>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <IonFab horizontal={`end`} vertical={`bottom`}>
                <IonFabButton color={`secondary`}>
                    <IonIcon icon={statsChart} />
                </IonFabButton>
                <div style={{ height: `10px` }}></div>
                <IonFabButton color={`primary`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    );
};

export default IncidentReport;


const ReportSkeleton: React.FC = () => {
    return (
        <IonItem>
            <IonGrid>
                <IonRow className={`ion-justify-content-center ion-align-items-center`} >
                    <IonCol size={`3`}>
                        <IonAvatar>
                            <IonSkeletonText animated></IonSkeletonText>
                        </IonAvatar>
                    </IonCol>
                    <IonCol>
                        <IonSkeletonText></IonSkeletonText>
                        <IonSkeletonText></IonSkeletonText>
                        <IonSkeletonText></IonSkeletonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonItem>
    )
}