
import { IonToolbar, IonMenuButton, IonButton, IonTitle, IonBadge, IonProgressBar, createGesture } from '@ionic/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { NotificationRedux, selectNotification } from '../states/reducers/InAppNotifications';

function PageHeader() {
    const [showWeather, setshowWeather] = React.useState(false)
    const [progress, setprogress] = useState(0)
    const notifState: NotificationRedux = useSelector(selectNotification)

    const history = useHistory()
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

            history.push(`/camoflash`)
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


    return (
        <div>
            <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
            <IonToolbar color={`primary`} >
                <IonMenuButton slot={`start`}>
                </IonMenuButton>
                {notifState?.new && <IonBadge style={{ transform: 'translate(-14px,0)', borderRadius: '50%', }} slot='start' color='danger'>
                    <div style={{ width: '1px', height: '3px' }}></div>
                </IonBadge>}
                <IonButton className='report-btn' fill={`outline`} size={`small`} slot={`end`} routerLink={`/report`} color={`danger`}>REPORT</IonButton>
                <IonTitle> Socionet</IonTitle>
            </IonToolbar>
            {progress != 0 && <IonProgressBar color='danger' value={progress}></IonProgressBar>}
        </div>
    );
};

export default PageHeader;


export { }