import { IonContent, IonPage, useIonViewDidEnter } from '@ionic/react'
import image from './comofash.jpeg'
import React from 'react'
import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { useSelector } from 'react-redux'
import { ReportIncident } from '../Firebase/services/report'
import { UserInterface } from '../interfaces/users'
import { selectLocation } from '../states/reducers/location-reducer'
import { selectUser } from '../states/reducers/userReducers'
import { countryInfoInterface } from '../interfaces/country'
import { useHistory } from 'react-router'
import { availableAccount } from '../components/service/serviceTypes'

function Camoflash() {
    const user: UserInterface = useSelector(selectUser)
    const location: { long: number, lat: number } = useSelector(selectLocation)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const history= useHistory();
    const nearByServiceProvider:availableAccount[]|any=history.location.state

   useIonViewDidEnter(() => {
       sendDistress()
    }, [])

   async  function sendDistress(){
       
      try{
        await  ReportIncident({
            author: user.email,
            category: `police`,
            country: countryInfo.name,
            description: `distress signal`,
            id: Date.now() + `${user.name}`,
            images: [],
            location,
            photoUrl: user.photoUrl,
            seenBy: [],
            sentTo: [],
            timestamp: Date.now(),
            username: user.name
        }, nearByServiceProvider, countryInfo.name)
            
      }catch(err){
        Toast.show({ text: err.message||err, duration: 'short' }).then(() => {
            App.exitApp()
        })
        return;
      }
        Toast.show({ text: 'done', duration: 'short' }).then(() => {
               
                App.exitApp()
            })
    }
    return (
        <IonPage>
            <IonContent>
                <img style={{height:`100vh`, width:`100%`}} src={image}></img>
            </IonContent>
        </IonPage>
    )
}

export default Camoflash
function selectCountry(selectCountry: any): any {
    throw new Error('Function not implemented.')
}

function nearBYServiceProvider(arg0: { author: string; category: string; country: any; description: string; id: string; images: never[]; location: { long: number; lat: number }; photoUrl: string; seenBy: never[]; sentTo: never[]; timestamp: number; username: string }, nearBYServiceProvider: any, name: any) {
    throw new Error('Function not implemented.')
}

