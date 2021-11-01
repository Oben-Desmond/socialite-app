import { IonButton, IonButtons, IonCard, IonCardSubtitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { add, eye, thumbsDown, thumbsUp } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import AdvertBusinessCard from '../components/company-account/AdvertBussinessCard'
import CreateAdvert from '../components/company-account/CreateAdvert'
import { accountInterface } from '../components/service/serviceTypes'
import { selectServiceAccount } from '../states/reducers/service-reducer'
import { Pictures } from './images/images'

const CompanyPage: React.FC = () => {
    const [createAd, setcreateAd] = useState(false)
    const serviceAccount:accountInterface = useSelector(selectServiceAccount)
    const history = useHistory()
    useEffect(() => {
        if(!serviceAccount.code){
               history.goBack();
        }
    }, [ ])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{serviceAccount.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               <IonToolbar color='light'>
               <IonGrid>
                    <IonRow>
                        <IonCol>
                            <AdvertBusinessCard advert={{clicks:30, title:'Football advert', views:400}} ></AdvertBusinessCard>
                        </IonCol>
                        <IonCol>
                            <AdvertBusinessCard advert={{clicks:30, title:'Football advert', views:400}} ></AdvertBusinessCard>
                        </IonCol>
                        <IonCol>
                            <AdvertBusinessCard advert={{clicks:30, title:'Football advert', views:400}} ></AdvertBusinessCard>
                        </IonCol>
                        <IonCol>
                            <AdvertBusinessCard advert={{clicks:30, title:'Football advert', views:400}} ></AdvertBusinessCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
               </IonToolbar>
            </IonContent>
            <CreateAdvert isOpen={createAd} onDidDismiss={()=>setcreateAd(false)} ></CreateAdvert>
            <IonFab vertical='bottom' horizontal='end' >
                <IonFabButton onClick={()=>{setcreateAd(true)}} color='secondary'>
                    <IonIcon icon={add}>
                    </IonIcon>
                </IonFabButton>
            </IonFab>
        </IonPage>
    )
}

export default CompanyPage
