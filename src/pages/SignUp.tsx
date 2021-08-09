// @flow strict
import { IonButton, IonCard, IonCardHeader, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowForward, bagOutline, lockClosedOutline, mailOpenOutline, peopleOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { hideTabBar } from '../App';
import FlipMove from 'react-flip-move';
import './style/Login.css';
import { UserInterface } from '../interfaces/users';
import { useDispatch } from 'react-redux';
import { updateUser } from '../states/action-creators/users';

const SignUp: React.FC = () => {

    const [businessAcc, setbusinessAcc] = useState(false)
    const [acctype, setacctype] = useState(`0`)
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
        const user: UserInterface = {
            name: data.name,
            bio: ``,
            domain: data.domain,
            email: data.email,
            location: `pitsburg`,
            photoUrl: ``,
            tel:data.tel
        }
        dispatch(updateUser(user))
        location.push(`/home`)




    }
    return (
        <IonPage>
            {/* <IonHeader>
                <IonToolbar>
                    <IonTitle>Socionet</IonTitle>
                </IonToolbar>
            </IonHeader> */}

            <IonContent className={`login signup`}>

                <div className={`upper-decor`}>
                    <div className="bubble1"></div>
                    <div className="bubble2"></div>
                </div>
                <form onSubmit={signIn} action="">
                    <IonList className={`login-list`}>
                        <IonToolbar>
                            <IonTitle>Sign up</IonTitle>
                        </IonToolbar>

                        <IonCard>
                            <FlipMove>
                                <IonItem key={`1`} lines={`inset`}>
                                    <IonIcon icon={personOutline}></IonIcon>
                                    <IonInput name={`name`} required placeholder={`Enter user name`}></IonInput>
                                </IonItem>

                                <IonItem key={`2`} lines={`inset`}>
                                    <IonIcon icon={mailOpenOutline}></IonIcon>
                                    <IonInput name={`email`} placeholder={`Enter email`} required></IonInput>
                                </IonItem>
                                <IonItem key={`3`} lines={`inset`}>
                                    <IonIcon icon={mailOpenOutline}></IonIcon>
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
                            <IonButton type={`submit`}>submit</IonButton>
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