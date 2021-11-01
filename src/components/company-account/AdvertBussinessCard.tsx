import { IonCard, IonImg, IonToolbar, IonCardSubtitle, IonButtons, IonButton, IonLabel, IonIcon, IonNote, IonItem, IonChip } from "@ionic/react"
import { eye, pencil, people } from "ionicons/icons"
import React, { useState } from "react"
import { Advert } from "../../interfaces/adverts_interfaces"
import { Pictures } from "../../pages/images/images"
import EditAdvert from "./EditAdvert"
 

interface AdvertBusinessCard {
    advert: Advert
}
const AdvertBusinessCard: React.FC<AdvertBusinessCard> = ({ advert }) => {
    const [editAd, seteditAd] = useState(false)
    return (
        <>
            <IonNote style={{ marginLeft: 10, transform: 'translateY(10px)' }}>
                Ad
        </IonNote>
            <IonCard  >
                <IonImg src={Pictures.event2}></IonImg>
                <IonItem >
                    <IonCardSubtitle>
                        {advert.title}
                    </IonCardSubtitle>

                </IonItem>
                <IonItem lines={`none`}>
                   {!!advert.approve_timestamp? <><IonChip color='dark'>
                        <IonLabel>{advert.clicks} clicks  </IonLabel>
                    </IonChip>
                    <IonChip color='dark'>
                        <IonIcon icon={eye}></IonIcon>
                        <IonLabel className='' style={{ marginLeft: 2 }}>
                            {advert.views}
                        </IonLabel>
                    </IonChip></>:
                     <IonChip color='medium'>
                     <IonIcon icon={people}></IonIcon>
                     <IonLabel className='' style={{ marginLeft: 2 }}>
                         pending approval...
                     </IonLabel>
                 </IonChip>
                    }
                    
                    <IonButton onClick={() => seteditAd(true)} fill={`clear`} slot={`end`} color='secondary'>
                        <IonIcon icon={pencil}></IonIcon>
                        <IonLabel className='' style={{ marginLeft: 2 }}>
                            Edit
                        </IonLabel>
                    </IonButton>
                </IonItem>

                <EditAdvert advert={advert} isOpen={editAd} onDidDismiss={() => seteditAd(false)}></EditAdvert>
            </IonCard>
        </>
    )
}



export default AdvertBusinessCard