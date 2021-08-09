// @flow strict

import { IonBackdrop, IonBadge, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonItem, IonList, IonModal, IonPage, IonSpinner, IonText, IonToolbar } from '@ionic/react';
import { close, mailOpen, mailOpenOutline, medkitOutline, pencilOutline, personOutline } from 'ionicons/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { StoreStateInteface } from '../interfaces/redux';
import { UserInterface } from '../interfaces/users';
import { Pictures } from '../pages/images/images';
import './styles/profileModal.css';

const ProfileModal: React.FC<{ profile: UserInterface | undefined, isOpen: boolean, onDidDismiss: () => void }> = ({ profile, isOpen, onDidDismiss, }) => {
    const root: StoreStateInteface | any = useSelector(state => state)

    return (
        <IonModal swipeToClose mode={`ios`} cssClass={`profile-modal`} isOpen={isOpen} onDidDismiss={onDidDismiss} >
            <IonHeader>
                <div className="dp-background">
                    <IonImg src={profile?.photoUrl} />
                </div>
            </IonHeader>
            <IonContent>
                <IonToolbar style={{ height: `70vh`, overFlow: `scroll` }} color={`primary`}>
                    {profile && <> <IonItem color={`none`} lines={`inset`}>
                        <IonIcon slot={`start`} icon={personOutline} />
                        <IonText>{profile?.name}</IonText>
                    </IonItem>
                        <IonItem color={`none`} lines={`inset`}>
                            <IonIcon slot={`start`} icon={pencilOutline} />
                            <small><i>
                                {profile?.bio || `user does not have a bio yet`}
                            </i></small>
                        </IonItem>
                        <IonItem color={`none`} lines={`inset`}>
                            <IonIcon slot={`start`} icon={mailOpenOutline} />
                            <IonText>{profile?.email}</IonText>
                        </IonItem>
                        {profile?.domain && <IonItem color={`none`} lines={`inset`}>
                            <IonIcon slot={`start`} icon={medkitOutline} />
                            <IonText className={`ion-margin-end`}>Business domain</IonText>
                            <IonBadge mode={`ios`} color={`secondary`}><IonText> {profile?.domain}</IonText> </IonBadge>

                        </IonItem>}</>}

                </IonToolbar>
            </IonContent>
            {!profile && <IonFab className={`profile-spinner`} horizontal={`center`} vertical={`center`}>

                <IonSpinner  color={`secondary`}></IonSpinner>
            </IonFab>}
            <IonFab vertical={`top`} horizontal={`end`}>
                <IonFabButton size={`small`} >
                    <IonIcon icon={close} />
                </IonFabButton>
                <IonBackdrop />
            </IonFab>
        </IonModal >
    );
};

export default ProfileModal;