import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonFab, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, IonPage, IonRow, IonToolbar } from '@ionic/react'
import { callOutline, cameraOutline, flagOutline, locate, mailOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fstore } from '../../Firebase/Firebase'
import { countryInfoInterface } from '../../interfaces/country'
import { UserInterface } from '../../interfaces/users'
import { updateUser } from '../../states/action-creators/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectUser } from '../../states/reducers/userReducers'
import { Pictures } from '../images/images'

const Profile: React.FC = function () {
    const user: UserInterface = useSelector(selectUser);
    const [edit, setedit] = useState(false)
    const country: countryInfoInterface = useSelector(selectCountry);
    const dispatch = useDispatch()

    function EditProfile(formValue: string) {
        const newUser: UserInterface = { ...user, ...{ tel: formValue[1], name: formValue[0] } };
        fstore.collection('users').doc(user.email).update({ tel: formValue[1], name: formValue[0] })
        dispatch(updateUser(newUser));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonImg src={Pictures.bg} />

                </IonToolbar>
                <IonFab style={{ background: '#000000ad', width: '200%', height: '190%', transform: 'translate(-50%, -50%)' }} vertical='top' horizontal='start'>
                    <div style={{ background: '#000000ad', width: '100%' }}></div>
                </IonFab>
                <IonFab vertical='center' horizontal='center'>
                    <IonAvatar>
                        <IonImg src={'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'} />
                        <IonButton style={{transform:'translate(-50%, -50%)'}} size='small' color='light' fill='clear'>
                            <IonIcon icon={cameraOutline} />
                        </IonButton>
                    </IonAvatar>
                </IonFab>
            </IonHeader>
            <IonContent>
                <IonAlert cssClass='comfortaa' inputs={[{ label: 'user name', value: user.name, placeholder: user.name || 'your user name' }, { label: 'phone number', value: user.tel, placeholder: user.tel || 'phone number' }]} onDidDismiss={() => setedit(false)} buttons={[{ text: 'edit', handler: EditProfile }, { text: 'cancel' }]} header='Edit Profile' message='please edit Profile' isOpen={edit} />

                <div className=" text-align-center ion-padding">
                    <IonLabel className='comfortaa' >
                        {user.name}
                    </IonLabel>
                </div>
                <IonList>
                    <IonItem>
                        <IonIcon slot='start' icon={mailOutline} />
                        <label className='comfortaa grey' >
                            {user.email}
                        </label>
                    </IonItem>

                    <IonItem>
                        <IonIcon slot='start' icon={callOutline} />
                        <label className='comfortaa grey' >
                            {user.tel}
                        </label>
                    </IonItem>
                    <IonItem>
                        <IonIcon slot='start' icon={flagOutline} />
                        <label className='comfortaa grey' >
                            {country.name}
                        </label>
                    </IonItem>
                </IonList>
            </IonContent>
            <IonToolbar>
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol className='text-align-center' >
                            <IonButton onClick={() => setedit(true)} size='small' color='secondary' fill='outline'>
                                Edit
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonPage>
    )
}

export default Profile
