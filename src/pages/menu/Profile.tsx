import { IonAvatar, IonFab, IonHeader, IonImg, IonPage, IonToolbar } from '@ionic/react'
import React from 'react'
import { Pictures } from '../images/images'

const Profile: React.FC = function () {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonImg src={Pictures.bg} />
 
                </IonToolbar>
                <IonFab style={{background:'#000000ad',width:'200%', height:'190%', transform:'translate(-50%, -50%)'}} vertical='top' horizontal='start'>
                    <div style={{background:'#000000ad',width:'100%'}}></div>
                </IonFab>
                <IonFab vertical='center' horizontal='center'>
                    <IonAvatar>
                        <IonImg src={'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'} />
                    </IonAvatar>
                </IonFab>
            </IonHeader>
        </IonPage>
    )
}

export default Profile
