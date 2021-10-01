import { IonBackdrop, IonButton, IonButtons, IonCardContent, IonCardTitle, IonContent, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react'
import { close } from 'ionicons/icons'
import React from 'react'

interface PostNotificationModal {
    isOpen: boolean,
    onDidDismiss: () => void
}

const PostNotificationModal: React.FC<PostNotificationModal> = function ({ isOpen, onDidDismiss }) {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} >
            <IonHeader>
                <IonToolbar color='primary' className='ion-padding-top'>
                    <IonButtons slot='start'>
                        <IonBackdrop></IonBackdrop>
                        <IonButton>
                            <IonIcon icon={close}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <IonCardTitle>still need to work on this page</IonCardTitle>
                </IonCardContent>
            </IonContent>
        </IonModal>
    )
}

export default PostNotificationModal
