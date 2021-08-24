// @flow strict
import { IonButton, IonCard, IonCardHeader, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonNote, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowForward, keyOutline, lockClosedOutline, mailOpenOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { hideTabBar } from '../App';
import { auth, fstore } from '../Firebase/Firebase';
import { UserInterface } from '../interfaces/users';
import { Storage } from '@capacitor/storage';
import { updateUser } from '../states/action-creators/users';
import './style/Login.css';
import { Dialog } from '@capacitor/dialog';

const Login: React.FC = () => {

    const dispatch = useDispatch()
    const history = useHistory()

    const [loading, setloading] = useState(false)

    function loginUser(event: any) {
        event.preventDefault()
        const email = event.target.email.value;
        const pass = event.target.pass.value;
       console.log(pass)
        if (email && pass) {
            setloading(true)
            auth.signInWithEmailAndPassword(email, pass).then(() => {
                fstore.collection(`users`).doc(email).get().then(res => {
                    const user: UserInterface | undefined | any = res.data()
                    if (user?.email) {
                        dispatch(updateUser(user))
                        Storage.set({ key: `user`, value: JSON.stringify(user) })
                       history.push(`/home`)
                    }
                }).catch(err => Dialog.alert({ message: `${err.message}`, title: `Authentication Error` }))
                    .finally(() => setloading(false))
            }).catch(err => Dialog.alert({ message: `${err.message}`, title: `Authentication Error` })).finally(() => setloading(false))

        }

    }
    return (
        <IonPage>
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle>Socionet</IonTitle>
                </IonToolbar>
            </IonHeader> */}
            <IonContent className={`login `}>
                <IonLoading message={`Signing you in`} onDidDismiss={() => setloading(false)} isOpen={loading}></IonLoading>
                <div className={`upper-decor`}>
                    <div className="bubble1"></div>
                    <div className="bubble2"></div>
                </div>
                <IonList className={`login-list`}>
                    <IonToolbar>
                        <IonTitle>Login | <span style={{ color: `var(--ion-color-secondary)` }}>Socialite</span></IonTitle>
                    </IonToolbar>
                    <form onSubmit={loginUser}>
                        <IonList className={`login-list`}>


                            <IonCard>

                                <IonItem key={`1`} lines={`inset`}>
                                    <IonIcon color={`primary`} icon={mailOpenOutline}></IonIcon>
                                    <IonInput name={`email`} required placeholder={`Enter your email`}></IonInput>
                                </IonItem>

                                <IonItem key={`2`} lines={`inset`}>
                                    <IonIcon icon={keyOutline}></IonIcon>
                                    <IonInput type={`password`} name={`pass`} placeholder={`enter password`} required></IonInput>
                                </IonItem>
                            </IonCard>
                            <IonToolbar className={`submit-button`}>
                                <IonButton type={`submit`}>Sign In</IonButton>
                            </IonToolbar>
                            <IonToolbar className={`ion-padding-horizontal forgot`} style={{ textAlign: `end` }} color={`none`}>
                                <IonNote><a href="#">Forgot ?</a></IonNote>
                            </IonToolbar>
                            <IonToolbar className={`ion-padding-horizontal`} color={`none`}>
                                <IonNote><Link to="/signup">Register</Link></IonNote>
                            </IonToolbar>
                        </IonList>

                    </form>
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default Login;