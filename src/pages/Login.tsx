// @flow strict
import { IonCard, IonCardHeader, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowForward, lockClosedOutline, personOutline } from 'ionicons/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { hideTabBar } from '../App';
import './style/Login.css';

const Login: React.FC = () => {
    useIonViewDidLeave(()=>{
        hideTabBar(false)
    })
    useIonViewDidEnter(()=>{
        hideTabBar()
    })
    return (
        <IonPage>
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle>Socionet</IonTitle>
                </IonToolbar>
            </IonHeader> */}
            <IonContent className={`login`}>
                <div className={`upper-decor`}>
                    <div className="bubble1"></div>
                    <div className="bubble2"></div>
                </div>
                <IonList className={`login-list`}>
                    <IonToolbar>
                        <IonTitle>Login</IonTitle>
                    </IonToolbar>
                    <IonCard>
                        <IonItem lines={`inset`}>
                            <IonIcon icon={personOutline}></IonIcon>
                            <IonInput></IonInput>
                        </IonItem>
                        <IonItem lines={`inset`}>
                            <IonIcon icon={lockClosedOutline}></IonIcon>
                            <IonInput type={`password`}></IonInput>
                        </IonItem>
                    </IonCard>
                    <IonFab className={`fab`} vertical={`bottom`} horizontal={`end`}>
                        <IonFabButton routerLink={`/Home`} color={`secondary`}>
                            <IonIcon icon={arrowForward}></IonIcon>
                        </IonFabButton>
                    </IonFab>
                </IonList>
                <IonToolbar className={`ion-padding-horizontal forgot`} style={{ textAlign: `end` }} color={`none`}>
                    <IonNote><a href="#">Forgot ?</a></IonNote>
                </IonToolbar>
                <IonToolbar className={`ion-padding-horizontal`} color={`none`}>
                    <IonNote><Link to="/signup">Register</Link></IonNote>
                </IonToolbar>
            </IonContent>
        </IonPage>
    );
};

export default Login;