import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonFab, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, IonPage, IonRow, IonToolbar } from '@ionic/react'
import { callOutline, flagOutline, locate, mailOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { countryInfoInterface } from '../../interfaces/country'
import { UserInterface } from '../../interfaces/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectUser } from '../../states/reducers/userReducers'
import { Pictures } from '../images/images'

const Profile: React.FC = function () {
    const user: UserInterface = useSelector(selectUser);
    const [edit, setedit] = useState(false)
    const country: countryInfoInterface = useSelector(selectCountry);
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
                    </IonAvatar>
                </IonFab>
            </IonHeader>
            <IonContent>
                <IonAlert cssClass='comfortaa' inputs={[{label:'user name',value:user.name,placeholder:user.name||'your user name'},{label:'phone number',value:user.tel, placeholder:user.tel||'phone number'}]} onDidDismiss={()=>setedit(false)} buttons={[{text:'edit'},{text:'cancel'}]} header='Edit Profile' message='please edit Profile' isOpen={edit}/>

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
                            <IonButton onClick={()=>setedit(true)} size='small' color='secondary' fill='outline'>
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
