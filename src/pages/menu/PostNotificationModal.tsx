import { IonCardContent, IonCardTitle, IonContent, IonModal } from '@ionic/react'
import React from 'react'

interface PostNotificationModal {
    isOpen:boolean,
    onDidDismiss:()=>void
} 

const PostNotificationModal:React.FC<PostNotificationModal> = function ({isOpen, onDidDismiss}) {
    return ( 
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} >
            <IonContent>
                <IonCardContent>
                    <IonCardTitle>Notification details page loading soon</IonCardTitle>
                </IonCardContent>
            </IonContent>
        </IonModal>
    )
}

export default PostNotificationModal
