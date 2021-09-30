// @flow strict


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { StatusBar } from '@capacitor/status-bar';
import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCardContent, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonPage, IonRow, IonSkeletonText, IonSlide, IonSlides, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { add, arrowBack, cameraOutline, close, images, statsChart, statsChartOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
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
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../components/PhotoOptionsModal';
import AddIncident from '../components/service/addIncident';
import { selectServiceAccount } from '../states/reducers/service-reducer';
import { accountInterface } from '../components/service/serviceTypes';
import { Dialog } from '@capacitor/dialog';


const IncidentReport: React.FC = () => {
    const [images, setimages] = useState<string[]>([])
    const [serviceReports, setserviceReports] = useState<reportInterface[]>([])
    const user: UserInterface = useSelector(selectUser);
    const [noData, setnoData] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [uploadIncident, setuploadIncident] = useState(false)
    const servAcc: accountInterface = useSelector(selectServiceAccount);
    const history = useHistory();

    console.log(servAcc)

    useEffect(() => {
        if (!servAcc.code) {
           Dialog.alert({message:'It seems you have not entered a service code', title:'No service code in History'})
            history.push(`/feed/default`)
        }
    }, [servAcc])
    function goBack() {
        history.goBack()
    }

    function getPhotos() {
        Camera.getPhoto({ resultType: CameraResultType.DataUrl, source: CameraSource.Photos }).then((res: any) => {
            setimages([...images, res.dataUrl]);
            setuploadIncident(true)
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
        fstore.collection(`business`).doc(`${servAcc.country}-${servAcc.code}`).collection(`reports`).onSnapshot((snapshot) => {

            const docs: any[] = snapshot.docs.map(doc => doc.data());
            setserviceReports([...docs]);
            console.log(docs)
            if (docs.length <= 0) setnoData(true)
        })
        

    }, [])
    function takePicture() {
        setPhotoOptions(false)
        photosFromCamera().then((data: any) => {
            if (data)
                setimages([...images, data])
            setuploadIncident(true)


        })
    }

    function galleryPhotos() {
        setPhotoOptions(false)
        photosFromGallery().then((data: any) => {
            if (data)
                setimages([...images, data])
            setuploadIncident(true)

        })
    }

    
    return (
        <IonPage>
            <IonHeader>
                <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
                <IonToolbar color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Incident</IonTitle>
                    {/* <IonButton size={`small`} slot={`end`} fill={`outline`} color={`secondary`}>
                        <IonLabel>switch to personal</IonLabel>
                    </IonButton> */}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {!noData && serviceReports.length <= 0 && <div>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                        <ReportSkeleton></ReportSkeleton>
                    </div>}
                    {
                        serviceReports.map((report, index) => {
                            if (serviceReports.length > 0 && index > 0) {
                                if ((Date.now() - report.timestamp) / (1000 * 60 * 60 * 24) > 1 && (Date.now() - serviceReports[index - 1].timestamp) / (1000 * 60 * 60 * 24) <= 1) {
                                    return (
                                        <>
                                            <IonItemDivider>
                                                <IonLabel>yesterday</IonLabel>
                                            </IonItemDivider>
                                            <ReportCard report={report}></ReportCard>
                                        </>
                                    )
                                }
                                if ((Date.now() - report.timestamp) / (1000 * 60 * 60 * 24) > 2 && (Date.now() - serviceReports[index - 1].timestamp) / (1000 * 60 * 60 * 24) <= 2) {
                                    return (
                                        <>
                                            <IonItemDivider>
                                                <IonLabel>Earlier</IonLabel>
                                            </IonItemDivider>
                                            <ReportCard report={report}></ReportCard>
                                        </>
                                    )
                                }
                            }
                            if (index == 0 && ((Date.now() - report.timestamp) / (1000 * 60 * 60 * 24)) < 1) {
                                return (<>
                                    <IonItemDivider>
                                        <IonLabel>
                                            Today
                                    </IonLabel>
                                    </IonItemDivider>
                                    <ReportCard report={report}></ReportCard>
                                </>)
                            }
                            return (
                                <ReportCard report={report}></ReportCard>
                            )
                        })
                    }
                </IonList>
                <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
            </IonContent>
            <AddIncident isOpen={uploadIncident} parentImages={images} onDidDismiss={() => { setuploadIncident(false) }} />
            <IonFab horizontal={`end`} vertical={`bottom`}>
                <IonFabButton color={`secondary`}>
                    <IonIcon icon={statsChart} />
                </IonFabButton>
                <div style={{ height: `10px` }}></div>
                <IonFabButton onClick={() => setPhotoOptions(true)} color={`primary`}>
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

