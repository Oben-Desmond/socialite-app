import { IonModal, IonHeader, IonToolbar, IonButtons, IonBackdrop, IonButton, IonIcon, IonLabel, IonContent, IonCardContent, IonGrid, IonRow, IonCol, IonSlides, IonSlide, IonCardHeader, IonCardTitle, IonList, IonItemDivider, IonItem, IonSpinner, IonImg } from '@ionic/react'
import { peopleOutline, close } from 'ionicons/icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { reportInterface } from '../../interfaces/reportTypes'
import { UserAvatar } from './reportCard'

const ViewReportModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void, report: reportInterface }> = function ({ isOpen, onDidDismiss, report }) {
    const [maploaded, setmaploaded] = useState(true)
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonHeader>
                <IonToolbar color={`primary`} >
                    <IonButtons slot={`start`}>
                        <IonBackdrop></IonBackdrop>
                        <IonButton>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonLabel>
                        Report Info
               </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <IonToolbar   >
                        <IonGrid>
                            <IonRow>
                                <IonCol className={`ion-align-self-start`}>
                                    <UserAvatar name={`oBEN`}></UserAvatar>
                                </IonCol>
                                <IonCol className={`ion-align-self-center`}>
                                    <IonLabel color={`secondary`}>
                                        Report by <Link to={`#`}>@{report.author}</Link>
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
                            <IonCardTitle >
                                {report.category}
                            </IonCardTitle>
                        </IonCardHeader>
                        <p >
                            {report.description}
                        </p>

                        <IonList className={`ion-padding-top ion-margin-top`}>
                            {report.seenBy.length > 0 && <IonItemDivider>
                                View by
                    </IonItemDivider>}
                            {
                                report.seenBy.map((seenby, index) => {
                                    return (
                                        <IonItem key={index}>
                                            <IonIcon icon={peopleOutline} slot={`start`} />
                                            <IonLabel>
                                                {seenby}
                                            </IonLabel>
                                        </IonItem>
                                    )
                                })
                            }

                            <div style={{ height: `50px` }}></div>
                            {maploaded && <div>
                                <IonLabel color={`secondary`}>Location of Incident</IonLabel>
                                <iframe onLoadStart={() => setmaploaded(false)} onLoadedData={() => setmaploaded(true)} onLoad={() => setmaploaded(true)} src={`http://maps.google.com/maps?q=9.45, 9.5&z=11&output=embed`} height="450" style={{ border: "0", width: `100%` }} loading="lazy"></iframe>
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


export default ViewReportModal