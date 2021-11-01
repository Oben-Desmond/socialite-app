import { IonCard, IonImg, IonToolbar, IonCardSubtitle, IonButtons, IonButton, IonLabel, IonIcon, IonNote, IonItem } from "@ionic/react"
import { eye } from "ionicons/icons"
import React, { useState } from "react"
import { Pictures } from "../../pages/images/images" 
import EditAdvert from "./EditAdvert"

interface Advert {
    title: string,
    clicks: number,
    views: number
}

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
            <IonCard onClick={()=>seteditAd(true)}>
                <IonImg src={Pictures.event2}></IonImg>
                <IonItem >
                    <IonCardSubtitle>
                        {advert.title}
                    </IonCardSubtitle>
                    <IonButtons slot='end'>
                        <IonButton color='success'>
                            <IonLabel>clicks {advert.clicks}</IonLabel>
                        </IonButton>
                        <IonButton color='tertiary'>
                            <IonIcon icon={eye}></IonIcon>
                            <IonLabel className='' style={{ marginLeft: 2 }}>
                                {advert.views}
                            </IonLabel>
                        </IonButton>
                    </IonButtons>
                </IonItem>
                <IonNote>
                    <div className="ion-padding">

                        <small >
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, laboriosam dolorem iure quidem id hic architecto incidunt velit quisquam nulla veritatis similique, aliquid autem natus, itaque perspiciatis! Reprehenderit, nam accusantium?
                            <IonButton color='secondary' style={{ fontSize: '10px', }} fill='clear'>
                                Read more
                            </IonButton>
                        </small>
                    </div>
                </IonNote>
                <EditAdvert advert={{description:'',image:Pictures.event1, title:advert.title, video:''}} isOpen={editAd} onDidDismiss={() => seteditAd(false)}></EditAdvert>
            </IonCard>
        </>
    )
}



export default AdvertBusinessCard