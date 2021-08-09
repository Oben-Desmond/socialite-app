// @flow strict

import { IonAvatar, IonButton, IonButtons, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, IonPage, IonRow, IonSegment, IonSegmentButton, IonThumbnail, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowBack, locationOutline, person, personOutline } from 'ionicons/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { hideTabBar } from '../../App';
import { UserInterface } from '../../interfaces/users';
import { Pictures } from '../images/images';


function Settings() {
    const history = useHistory()
    const [segchanged, setsegchanged] = React.useState(false)
    function goBack() {
        history.goBack()
    }
    useIonViewDidLeave(()=>{
        hideTabBar(false)
    })
    useIonViewDidEnter(()=>{
        hideTabBar()
    })
    const rootState:any= useSelector(state=>state)
    const user:UserInterface= rootState.userReducer;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="header" style={{ position: `relative`, textAlign: `center`, background: `black`, }}>
                    <IonToolbar color={`none`}>
                        <IonImg src={user.photoUrl} style={{ opacity: `0.2`, filter: `blur(8px)`, maxHeight: `50vh` }}></IonImg>
                    </IonToolbar>

                    <div style={{ textAlign: `center`, position: `absolute`, top: `30px`, left: `30%`, margin: `auto`, width: `40%` }}>
                        <IonAvatar style={{ margin: `auto` }}>
                            <IonImg src={user.photoUrl}></IonImg>
                        </IonAvatar>
                        <IonCardTitle color={`light`}>{user.name}</IonCardTitle>
                        <div>
                            <IonIcon color={`light`} icon={locationOutline}></IonIcon>
                            <IonCardSubtitle color={`light`}>{user.location}</IonCardSubtitle>
                        </div>
                    </div>

                </div>
                <IonHeader>
                    <IonToolbar>
                        <IonSegment >
                            <IonSegmentButton onClick={() => setsegchanged(true)} >
                                <div>359</div>
                                <IonNote>Posts</IonNote>
                            </IonSegmentButton>
                            <IonSegmentButton onClick={() => setsegchanged(!true)}>
                                <div>35k</div>
                                <IonNote>Followers</IonNote>
                            </IonSegmentButton>
                            <IonSegmentButton onClick={() => setsegchanged(!true)}>
                                <div>30</div>
                                <IonNote>Following</IonNote>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                </IonHeader>

                {segchanged ? <IonList>
                    <IonItem>
                        <IonThumbnail className={`ion-margin-end`}>
                            <IonImg src={Pictures.elon}></IonImg>
                        </IonThumbnail>
                        <IonLabel> elon musk did this and that for last 2 months</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonThumbnail className={`ion-margin-end`}>
                            <IonImg src={Pictures.SA}></IonImg>
                        </IonThumbnail>
                        <IonLabel> elon musk did this and that for last 2 months</IonLabel>
                    </IonItem>
                </IonList> :
                    <IonList>
                        <IonItem>
                            <IonButtons slot={`start`}>
                                <IonButton>
                                    <IonIcon icon={personOutline} />
                                </IonButton>
                            </IonButtons>
                            <IonLabel>Les Brown</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonButtons slot={`start`}>
                                <IonButton>
                                    <IonIcon icon={personOutline} />
                                </IonButton>
                            </IonButtons>
                            <IonLabel>Bill Clinton</IonLabel>
                        </IonItem>
                    </IonList>
                }
            </IonContent>
        </IonPage>
    );
};

export default Settings;