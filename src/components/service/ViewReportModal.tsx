import { IonModal, IonHeader, IonToolbar, IonButtons, IonBackdrop, IonButton, IonIcon, IonLabel, IonContent, IonCardContent, IonGrid, IonRow, IonCol, IonSlides, IonSlide, IonCardHeader, IonCardTitle, IonList, IonItemDivider, IonItem, IonSpinner } from '@ionic/react'
import { peopleOutline, close } from 'ionicons/icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserAvatar } from './reportCard'

  const ViewReportModal:React.FC<{isOpen:boolean, onDidDismiss:()=>void}> = function({isOpen, onDidDismiss}) {
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
                                <UserAvatar></UserAvatar>
                            </IonCol>
                            <IonCol className={`ion-align-self-center`}>
                                <IonLabel color={`secondary`}>
                                    Report by <Link to={`#`}>@Calvin Clein</Link>
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
                    <IonSlide>
                        <img src={`https://media.istockphoto.com/photos/traffic-accident-between-bicycle-and-a-car-picture-id1292290313?b=1&k=20&m=1292290313&s=170667a&w=0&h=kfYtovNVCK4jVDaGrdpV1yE0oBvQh6R3yVctWZHwPM0=`} />
                    </IonSlide>
                    <IonSlide>
                        <img src={`https://media.istockphoto.com/photos/traffic-accident-between-bicycle-and-a-car-picture-id1292290313?b=1&k=20&m=1292290313&s=170667a&w=0&h=kfYtovNVCK4jVDaGrdpV1yE0oBvQh6R3yVctWZHwPM0=`} />
                    </IonSlide>
                </IonSlides>
                {/* </IonToolbar> */}
                <IonToolbar className={`ion-padding-vertical`}>
                    <IonCardHeader>
                        <IonCardTitle >
                            Fire accident at kTown
                    </IonCardTitle>
                    </IonCardHeader>
                    <p >
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus, fugit explicabo! Excepturi neque provident iste atque ratione corrupti architecto alias.
                    </p>

                    <IonList className={`ion-padding-top ion-margin-top`}>
                        <IonItemDivider>
                            View by
                    </IonItemDivider>
                        <IonItem>
                            <IonIcon icon={peopleOutline} slot={`start`} />
                            <IonLabel>
                                Zinger Systems security Police
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon icon={peopleOutline} slot={`start`} />
                            <IonLabel>
                                Muea security Police
                            </IonLabel>
                        </IonItem>
                        <div style={{height:`50px`}}></div>
                       { maploaded&&<div>
                            <IonLabel color={`secondary`}>Location of Incident</IonLabel>
                            <iframe  onLoadStart={()=>setmaploaded(false)} onLoadedData={()=>setmaploaded(true)} onLoad={()=>setmaploaded(true)} src={`http://maps.google.com/maps?q=9.45, 9.5&z=11&output=embed`} height="450" style={{ border: "0", width: `100%` }} loading="lazy"></iframe>
                        </div>}
                       {!maploaded && <IonGrid >
                            <IonRow>
                                <IonCol></IonCol>
                                <IonCol style={{textAlign:`center`, padding:`30px`}}>
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