// @flow strict
import { IonButton, IonCard, IonCardHeader, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonLoading, IonNote, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowForward, bagOutline, lockClosedOutline, logoWhatsapp, mailOpenOutline, peopleOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { hideTabBar } from '../App';
import FlipMove from 'react-flip-move';
import './style/Login.css';
import { UserInterface } from '../interfaces/users';
import { useDispatch } from 'react-redux';
import { updateUser } from '../states/action-creators/users';
import { auth, fstore } from '../Firebase/Firebase';
import { Dialog } from "@capacitor/dialog";
import { Storage } from "@capacitor/storage";

const SignUp: React.FC = () => {

    const [businessAcc, setbusinessAcc] = useState(false)
    const [acctype, setacctype] = useState(`0`)
    const [loading, setloading]  = useState(false)
    function modifyAccountType(value: string) {
        setacctype(value)
        setbusinessAcc(value === `1` ? true : false)


    }
    const dispatch = useDispatch()
    const location = useHistory()

    
    function signIn(e: any) {
        e.preventDefault()
        const { name, pass, email, domain ,tel} = e.target
        let data: any = { name, pass, email, domain,tel }
        Object.keys(data).map(key => {
            if (data[key] ) {
                return data[key] = data[key].value
            }
        })
        console.log(data)
        if(!(data.email && data.name && data.tel &&data.pass)) {
            Dialog.alert({message:`you have some missen fields`,title:`Authentication error`});
        }
        const user: UserInterface = {
            name: data.name,
            bio: ``,
            domain: data.domain||``,
            email: data.email,
            location: ``,
            photoUrl: ``,
            tel:data.tel
        }
        setloading(true)
        
        auth.createUserWithEmailAndPassword(data.email,data.pass).then(()=>{
       
           fstore.collection(`users`).doc(data.email).set(user).catch(err=>Dialog.alert({message:`${err.message}`,title:`Authentication Error`}))
           location.push(`/home`)
           Dialog.alert({message:`Account has been successfully created`,title:`Successful`})
           Storage.set({key:`user`,value:JSON.stringify(user)});
        }).catch(async(err)=>{
         
            await Dialog.alert({message:`${err.message}`,title:`Unable to Create Account`,buttonTitle:`ok`})
        }).finally(()=>{
            setloading(false)
        })
        dispatch(updateUser(user))

    }
    return (
        <IonPage>
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle>Socionet</IonTitle>
                </IonToolbar>
            </IonHeader> */}

            <IonContent className={`login signup`}>
                <IonLoading  message={`creating user`} onDidDismiss={()=>setloading(false)} isOpen={loading}></IonLoading>
                <div className={`upper-decor`}>
                    <div className="bubble1"></div>
                    <div className="bubble2"></div>
                </div>
                <form onSubmit={signIn} action="">
                    <IonList className={`login-list`}>
                        <IonToolbar>
                            <IonTitle>Sign up | <span style={{color:`var(--ion-color-secondary)`}}>Socialite</span></IonTitle>
                        </IonToolbar>

                        <IonCard>
                            <FlipMove>
                                <IonItem key={`1`} lines={`inset`}>
                                    <IonIcon icon={personOutline}></IonIcon>
                                    <IonInput name={`name`} required placeholder={`Enter names`}></IonInput>
                                </IonItem>

                                <IonItem key={`2`} lines={`inset`}>
                                    <IonIcon icon={mailOpenOutline}></IonIcon>
                                    <IonInput name={`email`} placeholder={`Enter email`} required></IonInput>
                                </IonItem>
                                <IonItem key={`3`} lines={`inset`}>
                                    <IonIcon icon={logoWhatsapp}></IonIcon>
                                    <IonInput name={`tel`} placeholder={`Enter phone number`} required></IonInput>
                                </IonItem>
                                <IonItem key={`8`} lines={`inset`}>
                                    <IonIcon icon={lockClosedOutline}></IonIcon>
                                    <IonInput name={`pass`} required placeholder={`enter password`} type={`password`}></IonInput>
                                </IonItem>
                                <IonToolbar key={`4`} className={`ion-padding-top`}>
                                    <IonLabel>Type of Account</IonLabel>
                                    <IonRadioGroup value={acctype} onIonChange={(e) => modifyAccountType(e.detail.value)}>
                                        <IonItem>
                                            <IonRadio value={`0`} ></IonRadio>
                                            <IonLabel>Personal</IonLabel>
                                        </IonItem>
                                        <IonItem>
                                            <IonRadio value={`1`}></IonRadio>
                                            <IonLabel>Business</IonLabel>
                                        </IonItem>
                                    </IonRadioGroup>
                                </IonToolbar>
                                {businessAcc && <div key={`5`} className="ion-padding-start">
                                    <IonItem className={`domain`} lines={`inset`}>
                                        <IonIcon icon={peopleOutline}></IonIcon>
                                        <IonLabel >domain</IonLabel>
                                        <IonSelect name={`domain`}>
                                            <IonSelectOption>Medic</IonSelectOption>
                                            <IonSelectOption>Fire fighter</IonSelectOption>
                                            <IonSelectOption>Police</IonSelectOption>
                                            <IonSelectOption>Company</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </div>

                                }
                            </FlipMove>
                        </IonCard>
                        <IonToolbar className={`submit-button`}>
                            <IonButton type={`submit`}>sign up</IonButton>
                        </IonToolbar>

                    </IonList>
                </form>

                <IonToolbar className={`ion-padding-horizontal`} color={`none`}>
                    <IonNote><Link to="/Login">Login</Link></IonNote>
                </IonToolbar>
            </IonContent>
        </IonPage>
    );
};

export default SignUp;