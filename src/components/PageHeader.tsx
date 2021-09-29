
import { App } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { IonHeader, IonToolbar, IonMenuButton, IonButton, IonTitle, IonButtons, IonLabel, IonBadge, IonProgressBar, createGesture } from '@ionic/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getServicesNearBy, ReportIncident } from '../Firebase/services/report';
import { countryInfoInterface } from '../interfaces/country';
import { StoreStateInteface } from '../interfaces/redux';
import { UserInterface } from '../interfaces/users';
import { WiDaySunny } from '../package/weather-icons-react';
import { selectCountry } from '../states/reducers/countryReducer';
import { selectLocation } from '../states/reducers/location-reducer';
import { selectUser } from '../states/reducers/userReducers';
import { availableAccount } from './service/serviceTypes';
import WeatherModal from './WeatherModal';

function PageHeader() {
    const [showWeather, setshowWeather] = React.useState(false)
    const [progress, setprogress] = useState(0)
    const [nearBYServiceProvider, setnearBYServiceProvider] = useState<availableAccount[]>([]);
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const user: UserInterface = useSelector(selectUser)
    const location: {long:number, lat:number} = useSelector(selectLocation)

    useEffect(() => {
        initGesture()
    }, [])



    async function initGesture() {

        const DOUBLE_CLICK_THRESHOLD = 500;
        const button = document.querySelector('.report-btn');
        if (!button) return;

        const gesture: any = createGesture({
            el: button,
            threshold: 0,
            onStart: () => {
                getNearBy()
                onStart();
            },
            onEnd: () => {
                onEnded()
            },
            gestureName: 'hold'
        });

        gesture.enable();

        let lastOnStart = Date.now();
        let t: any;
        const onStart = async () => {
            const lastOnStart = Date.now();

            for (let i = 1; i <= 5; i += 1) {

                await (new Promise((resolve) => {
                    t = setTimeout(() => {

                        resolve(i / 5)
                        setprogress(i / 5)
                    }, 1000)
                }))
            }

            Toast.show({ text: 'done', duration: 'short' }).then(() => {
                ReportIncident({
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
                }, nearBYServiceProvider, countryInfo.name)
                App.exitApp()
            })
            setprogress(0)

        }
        function onEnded() {
            <IonProgressBar color='success' value={progress}></IonProgressBar>
            const now = Date.now();
            if (Math.abs(now - lastOnStart) > 4500) {

            }

            lastOnStart = now;
            setprogress(0)

            if (t) {
                window.clearTimeout(t);
            }
        }
    }

    async function getNearBy() {
        if (nearBYServiceProvider.length <= 0)
            try {
                const serAcc: any = await getServicesNearBy(countryInfo.name, `police`);
                setnearBYServiceProvider([...serAcc]);
            } catch (err) {
                Dialog.alert({ message: err.message || err || 'Unexpected error occured', title: 'Error getting nearby police stations' })
            }
    }

    return (
        <div>
            <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
            <IonToolbar color={`primary`} >
                <IonMenuButton slot={`start`}>
                </IonMenuButton>
                <IonBadge style={{ transform: 'translate(-14px,0)', borderRadius: '50%', }} slot='start' color='danger'>
                    <div style={{ width: '1px', height: '3px' }}></div>
                </IonBadge>
                <IonButton className='report-btn' fill={`outline`} size={`small`} slot={`end`} routerLink={`/report`} color={`danger`}>REPORT</IonButton>
                <IonTitle> Socionet</IonTitle>
                {/* <IonButtons className={`weather`} slot={`end`}>
                        <div onClick={() => setshowWeather(true)} style={{ textAlign: `center` }}>
                            <WiDaySunny size={24} color='#fbfb00' />
                            <IonLabel style={{ display: `block` }} >{ countryInfo?.country_3||`SA`}</IonLabel>
                        </div>
                    </IonButtons> */}
                <WeatherModal onDidDismiss={() => setshowWeather(false)} isOpen={showWeather}></WeatherModal>
            </IonToolbar>
            {progress != 0 && <IonProgressBar color='danger' value={progress}></IonProgressBar>}
        </div>
    );
};

export default PageHeader;