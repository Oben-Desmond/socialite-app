
import { TextareaChangeEventDetail } from '@ionic/core';
import { IonButton, IonCardContent, IonCardTitle, IonChip, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import "../style/admin.css";
const AdminPanel: React.FC = function () {
    const [generated, setgenerated] = useState(Math.floor(Math.random() * 1000000).toString());
    const [permitted, setpermitted] = useState<string[]>([]);
    function PermittedChange(e: any) {
        let str = e.detail.value || '';
        if (str[str.length - 1] == ' ' || str[str.length - 1] == ',' || str[str.length - 1] == '\n') {
            str = str.substr(0, str.length - 1);
            setpermitted([...permitted, str]);
            e.target.value = '';

        }
    }

    function deletePermitted(index: number) {
        setpermitted([...permitted.filter((el, i) => (i !== index))]);

    }

    function addAccount() {

    }
    return (
        <IonPage className='admin'>
            <IonHeader>
                <IonToolbar color='secondary' className='ion-padding-top'>
                    <IonTitle>Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <form onSubmit={addAccount}
                    >
                        <IonCardTitle>Add a service account</IonCardTitle>
                        <div style={{ height: "27px" }}></div>
                        <IonItem  >

                            <IonLabel style={{ fontFamily: 'Comfortaa' }} >
                                Business Category
                                 </IonLabel>
                            <IonSelect slot='end' interface='action-sheet' >
                                <IonSelectOption>
                                    Police
                                </IonSelectOption>
                                <IonSelectOption>
                                    Health Care
                                </IonSelectOption>
                                <IonSelectOption>
                                    Municipality
                                </IonSelectOption>
                                <IonSelectOption>
                                    Company
                                </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem  >

                            <IonLabel style={{ fontFamily: 'Comfortaa' }} >
                                Country   </IonLabel>
                            <IonSelect slot='end' interface='action-sheet' >
                                <IonSelectOption>
                                    South Africa  </IonSelectOption>
                                <IonSelectOption>
                                    Cameroon </IonSelectOption>
                                <IonSelectOption>
                                    Nigeria</IonSelectOption>
                                <IonSelectOption>
                                    Ghana    </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'>Company Name</IonLabel>
                            <IonInput onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }} ></IonInput>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'>Emergency Contact</IonLabel>
                            <IonInput onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }}></IonInput>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'> 6 Digit Code</IonLabel>
                            <IonInput onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }} value={generated} onIonChange={(e) => setgenerated(e.detail.value || '')} ></IonInput>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'> permitted users</IonLabel>
                            <IonTextarea onIonChange={(e) => { PermittedChange(e) }} placeholder='add permitted emails and seperate with a comma (",")  ' onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }} >
                                {permitted.map((email, index) => (
                                    <IonChip onClick={() => { deletePermitted(index) }}>{email}</IonChip>
                                ))}
                            </IonTextarea>
                        </IonItem>
                        <div style={{ height: '30px' }}></div>
                        <div style={{ padding: '30px' }}>
                            <IonButton color='secondary' type='submit' style={{ width: '100%' }}>CREATE ACCOUNT</IonButton>
                        </div>
                        <div style={{ height: '50vh' }}></div>
                    </form>
                </IonCardContent>
            </IonContent>
        </IonPage>
    )
}

export default AdminPanel
