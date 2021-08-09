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


const IncidentReport: React.FC = () => {
    const [images,setimages]= React.useState<string[]>([])
    const history = useHistory()
    function goBack() {
        history.goBack()
    }
    StatusBar.setBackgroundColor({color:`#1b2630`})
    useIonViewDidLeave(()=>{
        hideTabBar(false)
    })
    useIonViewDidEnter(()=>{
        hideTabBar()
    })
    function report(){
        Toast.show({text:`message reported`});
        goBack()
    }
    useIonViewDidEnter(()=>{
        getPhotos()
    })
    function getPhotos(){
        Camera.getPhoto({resultType:CameraResultType.DataUrl, source:CameraSource.Photos}).then((res:any)=>{
            setimages([...images, res.dataUrl]);
        })
    }
    function deleteItem(item:number){
        const imgs= images
        imgs.splice(item,1)
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
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <div className="add-modal incident-inputs">
                    <div className="input">
                            <IonItem onClick={getPhotos} lines={`none`} color={`none`} >
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-margin-start`}>
                                 Add Photos
                                </IonLabel>
                            </IonItem>
                        </div>
                        <div className="input">
                            <IonInput placeholder={`what type of incident is this?`}></IonInput>
                        </div>
                        <div className="input">
                            <IonTextarea placeholder={`Write a short description`}></IonTextarea>
                        </div>
                           {/* <IonItem lines={`none`}>
                               <IonThumbnail>
                                   <IonImg src={Pictures.event1}/>
                               </IonThumbnail>
                               <IonThumbnail>
                                   <IonImg src={Pictures.event2}/>
                               </IonThumbnail>
                                 </IonItem> */}
                                 <IonSlides style={{paddingBottom:`25px`}} pager options={{slidesPerView:2}}>
                                     
                                    {images.map((img, index)=>{
                                        return(
                                           <ImageSlide deleteItem={()=>deleteItem(index)} img={img}></ImageSlide>
                                        )
                                    })}
                                 </IonSlides>
                    </div>
                    <div style={{textAlign:`center`}}>
                        <IonButton color={`primary`} shape={`round`} onClick={()=>report()}> REPORT </IonButton>
                    </div>
                </IonCardContent>
            </IonContent>
        </IonPage>
    );
};

export default IncidentReport;

