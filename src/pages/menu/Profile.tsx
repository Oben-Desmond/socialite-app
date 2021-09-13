import { Dialog } from '@capacitor/dialog'
import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonFab, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, IonPage, IonProgressBar, IonRow, IonToolbar } from '@ionic/react'
import { callOutline, cameraOutline, flagOutline, locate, mailOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../../components/PhotoOptionsModal'
import { fstore, storage } from '../../Firebase/Firebase'
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
    const [getPhoto, setgetPhoto] = useState(false)
    const [image, setimage] = useState(user.photoUrl);
    const [loading, setloading] = useState(0)
    const dispatch = useDispatch()

    function EditProfile(formValue: string) {
        const newUser: UserInterface = { ...user, ...{ tel: formValue[1], name: formValue[0] } };
        fstore.collection('users').doc(user.email).update({ tel: formValue[1], name: formValue[0] })
        dispatch(updateUser(newUser));
    }
    function takePicture() {

        photosFromCamera().then((data: any) => {
            if (data)
                uploadImage(data)
        })
    }


    function galleryPhotos() {
        photosFromGallery().then((data: any) => {
            if (data)
                uploadImage(data)
        })
    }

    async function uploadImage(data: string) {
        try {
            const blob = await fetch(data).then(res => res.blob());
            const uploadTask = storage.ref(`profiles/${country.name || 'South Africa'}/${user.email}/profile.png`).put(blob)

            uploadTask
                .on('state_changed', (snapshot) => {
                    setloading(Math.floor(snapshot.bytesTransferred / snapshot.totalBytes))
                }, (err) => {
                    Dialog.alert({ message: err.message || 'unexpected error occured', title: 'unable to set profile image' })
                }, () => {
                    setloading(0)
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(url => {
                            fstore.collection('users').doc(user.email).update({ photoUrl: url });
                            dispatch(updateUser({...user,photoUrl:url}))
                        })
                })

        } catch (err) {
            Dialog.alert({ message: err.message || err || 'unexpected error occured', title: 'unable to set profile image' })
        }
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
                        <IonButton disabled={loading != 0} onClick={() => setgetPhoto(true)} style={{ transform: 'translate(-50%, -50%)' }} size='small' color='light' fill='clear'>
                            {loading == 0 ? <IonIcon icon={cameraOutline} /> : <IonLabel>{loading * 100}%</IonLabel>}
                        </IonButton>
                    </IonAvatar>
                </IonFab>
            </IonHeader>
            <IonContent>
                {loading > 0 && <IonProgressBar color='danger' type={'indeterminate'} ></IonProgressBar>}
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
            <PhotoOptionsModal isOpen={getPhoto} onDidDismiss={() => { setgetPhoto(false) }} fromPhotos={photosFromGallery} fromCamera={photosFromCamera} ></PhotoOptionsModal>
        </IonPage>
    )
}

export default Profile
