// @flow strict

import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router';
import { Pictures } from '../images/images';
import {Toast} from '@capacitor/toast';
import "../style/notifications.css";
import { hideTabBar } from '../../App';


function Notifications() {
    const history = useHistory()
    function goBack() {
        history.goBack()
    }
    useIonViewDidLeave(()=>{
        hideTabBar(false)
    })
    useIonViewDidEnter(()=>{
        hideTabBar()
    })
    return (
        <IonPage className={`notifications`}>
            <IonHeader>
                <IonToolbar className='ion-padding-top' color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* <IonList>
                    <IonItemDivider>Stories</IonItemDivider>
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList>
                <IonList>
                    <IonItemDivider>Public notice</IonItemDivider>
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList>
                <IonList>
                    <IonItemDivider>Events</IonItemDivider>
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList> */}
            </IonContent>
        </IonPage>
    );
};

export default Notifications;


function NotificationItem() {

    function showToast(){
               Toast.show({text:`notification opened`}).then(console.log)
    }
    return (
        <IonItem button onClick={showToast}>
            <IonAvatar slot={`start`}>
                <IonImg src={Pictures.dp} />
            </IonAvatar>
            <IonNote>Rosabell replied to your comment this on Developing South Africa</IonNote>
            <IonNote className={`ion-margin-start`}>2:23 pm</IonNote>
        </IonItem>
    )
}