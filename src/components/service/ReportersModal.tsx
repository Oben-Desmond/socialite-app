import { Toast } from '@capacitor/toast'
import { IonModal, IonHeader, IonToolbar, IonButtons, IonBackdrop, IonButton, IonIcon, IonLabel, IonContent, IonCardContent, IonGrid, IonRow, IonCol, IonSlides, IonSlide, IonCardHeader, IonCardTitle, IonList, IonItemDivider, IonItem, IonSpinner, IonImg, IonAvatar } from '@ionic/react'
import { peopleOutline, close, checkmark, trash, trashOutline, share, shareSocial, starOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fstore } from '../../Firebase/Firebase'
import { markThisIncidentAsRead } from '../../Firebase/services/report'
import { countryInfoInterface } from '../../interfaces/country'
import { reportInterface } from '../../interfaces/reportTypes'
import { UserInterface } from '../../interfaces/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectServiceAccount } from '../../states/reducers/service-reducer'
import { selectUser } from '../../states/reducers/userReducers'
import { UserAvatar } from './reportCard'
import { accountInterface } from './serviceTypes'

const ReportersModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void, report: reportInterface }> = function ({ isOpen, onDidDismiss, report }) {
    const [maploaded, setmaploaded] = useState(true)
    const country: countryInfoInterface = useSelector(selectCountry);
    const user: UserInterface = useSelector(selectUser);
    const servAcc: accountInterface = useSelector(selectServiceAccount);
    console.log(servAcc)

    useEffect(() => {
        if (servAcc && servAcc.code) {
            if (user.email == report.author) return;
            if (report.seenBy.filter(serv => serv.code == servAcc.code).length > 0) return;
            markThisIncidentAsRead(report, servAcc, () => {

            });

        }
    }, [])
    async function deleteReport() {
        const reportData = {
            author: ``,
            category: ``,
            images: [],
            country: report.country,
            description: `Report id ${report.id} deleted  by ${user.name} | (${user.email}) from ${report.author}`,
            id: report.id,
            photoUrl: ``,
            seenBy: [],
            sentTo: [],
            timestamp: Date.now()

        }
        onDidDismiss()
        await fstore.collection(`users`).doc(`${user.email}`).collection(`reports`).doc(report.id).delete()
        Toast.show({ text: `deleted...` });
    }
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
                <IonToolbar color={`primary`} >
                    <IonButtons slot={`start`}>
                        <IonBackdrop></IonBackdrop>
                        <IonButton>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <div className={`ion-text-capitalize ion-text-capitalize`}>
                        <IonLabel style={{ textTransform: `capitalize` }} >
                            Report Info
               </IonLabel>
                    </div>
                    <IonButtons slot={`end`}>
                        <IonButton onClick={deleteReport}>
                            <IonIcon icon={trashOutline} />
                        </IonButton>
                        <IonButton >
                            <IonIcon icon={starOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <IonToolbar   >
                        <IonGrid>
                            <IonRow>
                                <IonCol className={`ion-align-self-start`}>
                                    {report.author && <>
                                        {(report.photoUrl || (user.photoUrl && user.email == report.author)) ? <IonAvatar style={{ width: '50px', height: '50px' }}>
                                            <IonImg src={report.photoUrl || user.photoUrl} />
                                        </IonAvatar> : <UserAvatar name={report.author} ></UserAvatar>}</>}
                                </IonCol>
                                <IonCol className={`ion-align-self-center `}>
                                    <IonLabel color={`secondary`}>
                                        Reported by <Link to={`#`}>@{report.author}</Link>
                                    </IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonToolbar>
                    {/* <IonToolbar> */}
                    <IonSlides options={{
                        speed: 400,
                        spaceBetween: 100,
                    }} pager>
                        {
                            report.images.map((img, index) => <IonSlide key={index}>
                                <IonImg src={img} />
                            </IonSlide>)
                        }
                    </IonSlides>
                    {/* </IonToolbar> */}
                    <IonToolbar className={`ion-padding-vertical`}>
                        <IonCardHeader>
                            <IonCardTitle className={`ion-text-capitalize`} >
                                {report.category}
                            </IonCardTitle>
                        </IonCardHeader>
                        <p >
                            {report.description}
                        </p>


                        <IonList className={`ion-padding-top ion-margin-top`}>
                            {report.sentTo.length > 0 && <IonItemDivider>
                                Sent To
                    </IonItemDivider>}
                            {
                                report.sentTo.map((sento, index) => {
                                    return (
                                        <IonItem key={index}>
                                            <IonIcon icon={peopleOutline} slot={`start`} />
                                            <IonLabel>
                                                {sento.name}
                                            </IonLabel>
                                        </IonItem>
                                    )
                                })
                            }
                            <div style={{ height: `30px` }}></div>
                            {report.seenBy.length > 0 && <IonItemDivider>
                                Viewed by
                    </IonItemDivider>}
                            {
                                report.seenBy.map((seenby, index) => {
                                    return (
                                        <IonItem key={index}>
                                            <IonIcon icon={peopleOutline} slot={`start`} />
                                            <IonLabel>
                                                {seenby.name}
                                            </IonLabel>
                                            <IonButton fill={`clear`} color={`success`}>
                                                <IonIcon icon={checkmark} />
                                            </IonButton>
                                        </IonItem>
                                    )
                                })
                            }

                            <div style={{ height: `50px` }}></div>
                            {maploaded && <div>
                                <IonLabel color={`secondary`}>Location of Incident</IonLabel>
                                {report?.location && <iframe onLoadStart={() => setmaploaded(false)} onLoadedData={() => setmaploaded(true)} onLoad={() => setmaploaded(true)} src={`http://maps.google.com/maps?q=${report.location.lat}, ${report.location}&z=11&output=embed`} height="450" style={{ border: "0", width: `100%` }} loading="lazy"></iframe>}
                            </div>}
                            {!maploaded && <IonGrid >
                                <IonRow>
                                    <IonCol></IonCol>
                                    <IonCol style={{ textAlign: `center`, padding: `30px` }}>
                                        <IonSpinner color={`secondary`}></IonSpinner>
                                    </IonCol>
                                    <IonCol></IonCol>
                                </IonRow>
                            </IonGrid>}
                        </IonList>
                    </IonToolbar>
                </IonCardContent>
            </IonContent>
        </IonModal>
    )
}


export default ReportersModal