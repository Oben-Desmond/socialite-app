 
import { IonHeader, IonToolbar, IonMenuButton, IonButton, IonTitle, IonButtons, IonLabel } from '@ionic/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { countryInfoInterface } from '../interfaces/country';
import { StoreStateInteface } from '../interfaces/redux';
import { WiDaySunny } from '../package/weather-icons-react';
import WeatherModal from './WeatherModal';

function PageHeader() {
    const [showWeather, setshowWeather] = React.useState(false)
    const root:any|StoreStateInteface= useSelector(state=>state)
     const countryInfo:countryInfoInterface|undefined =root.countryReducer
    return (
        <div>
               <div style={{height:`25px`,background:`var(--ion-color-primary)`}} className="status-bar"></div>
                <IonToolbar color={`primary`} >
                    <IonMenuButton slot={`start`}></IonMenuButton>
                    <IonButton fill={`outline`} size={`small`} slot={`end`} routerLink={`/report`} color={`danger`}>REPORT</IonButton>
                    <IonTitle> Socionet</IonTitle>
                    {/* <IonButtons className={`weather`} slot={`end`}>
                        <div onClick={() => setshowWeather(true)} style={{ textAlign: `center` }}>
                            <WiDaySunny size={24} color='#fbfb00' />
                            <IonLabel style={{ display: `block` }} >{ countryInfo?.country_3||`SA`}</IonLabel>
                        </div>
                    </IonButtons> */}
                    <WeatherModal onDidDismiss={() => setshowWeather(false)} isOpen={showWeather}></WeatherModal>
                </IonToolbar>
            </div>
    );
};

export default PageHeader;