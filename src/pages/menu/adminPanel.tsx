
import { Dialog } from '@capacitor/dialog';
import { TextareaChangeEventDetail } from '@ionic/core';
import { IonButton, IonCardContent, IonCardTitle, IonChip, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react'
import { geohashForLocation } from 'geofire-common';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { accountInterface, availableAccount } from '../../components/service/serviceTypes';
import { fstore } from '../../Firebase/Firebase';
import { selectLocation } from '../../states/reducers/location-reducer';
import "../style/admin.css";
const AdminPanel: React.FC = function () {
    const [generated, setgenerated] = useState(Math.floor(Math.random() * 1000000).toString());
    const [permitted, setpermitted] = useState<string[]>([]);
    const [type, settype] = useState('police');
    const [country, setcountry] = useState('South Africa');
    const [company, setcompany] = useState('');
    const [contact, setcontact] = useState('');
    const [code, setcode] = useState(Math.floor(Math.random() * 1000000).toString());
    const location: { long: number, lat: number } = useSelector(selectLocation)
    const [loading, setloading] = useState(false)

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

    async function addAccount(e: any) {
        e.preventDefault();
        const geohash= geohashForLocation([location.lat, location.long])

        const account: accountInterface = {
            code,
            country,
            location,
            name: company,
            tel: contact,
            timestamp: Date.now(),
            type,
            users: permitted,
            geohash
        }
        const available_entry: availableAccount = {
            name: company,
            emergency__contact: contact,
            code,
            emails: permitted,
            location,
            geohash
        }
        setloading(true)
        try {

            
            let query1 = fstore.collection('service-accounts').doc(account.country).collection(account.type).doc(account.code).set(available_entry);
            let query2 = fstore.collection('business').doc(account.country + '-' + account.code).set(account);

            await Promise.all([query1, query2]);
            Dialog.alert({ message: `Account with service code ${code} has been successfully created`, title: 'Successfully Created Account' });
            setcompany(``);
            setpermitted([]);
            setcontact(``);
        }
        catch (err) {
            Dialog.alert({ message: err.message || err || 'unexpected error occured', title: 'Error Creating Account' });
        }
        setloading(false)
    }
    return (
        <IonPage className='admin'>
            <IonHeader>
                <IonToolbar color='secondary' className='ion-padding-top'>
                    <IonTitle>Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={loading} onDidDismiss={() => setloading(false)} message='Creating Service Account'></IonLoading>
                <IonCardContent>
                    <form onSubmit={addAccount}
                    >
                        <IonCardTitle>Add a service account</IonCardTitle>
                        <div style={{ height: "27px" }}></div>
                        <IonItem  >

                            <IonLabel style={{ fontFamily: 'Comfortaa' }} >
                                Account Type
                                 </IonLabel>
                            <IonSelect value={type} onIonChange={(e) => settype(e.detail.value || '')} slot='end' interface='action-sheet' >
                                <IonSelectOption value='police'>
                                    Police
                                </IonSelectOption>
                                <IonSelectOption value='health'>
                                    Health Care
                                </IonSelectOption>
                                <IonSelectOption value='municipal'>
                                    Municipality
                                </IonSelectOption>
                                <IonSelectOption value='company'>
                                    Company
                                </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem  >

                            <IonLabel style={{ fontFamily: 'Comfortaa' }} >
                                Country   </IonLabel>
                            <IonSelect slot='end' interface='action-sheet' value={country} onIonChange={(e) => setcountry(e.detail.value || '')} >
                                <IonSelectOption value='South Africa'>
                                    South Africa  </IonSelectOption>
                                <IonSelectOption value='Cameroon'>
                                    Cameroon </IonSelectOption>
                                <IonSelectOption value='Nigeria'>
                                    Nigeria</IonSelectOption>
                                <IonSelectOption value='Ghana'>
                                    Ghana    </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'>Company Name</IonLabel>
                            <IonInput value={company} onIonChange={(e) => setcompany(e.detail.value || '')} onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }} ></IonInput>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'>Emergency Contact</IonLabel>
                            <IonInput value={contact} onIonChange={(e) => setcontact(e.detail.value || '')} onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }}></IonInput>
                        </IonItem>
                        <IonItem  >
                            <IonLabel style={{ fontFamily: 'Comfortaa' }} position='floating'> 6 Digit Code</IonLabel>
                            <IonInput value={code} onIonChange={(e) => setcode(e.detail.value || '')} onClick={(e: any) => { e.target.scrollIntoView({ behavior: 'smooth' }) }} ></IonInput>
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
