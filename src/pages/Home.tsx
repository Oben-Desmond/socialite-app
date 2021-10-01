// @flow strict
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonMenuButton, IonPage, IonRange, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/react';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { WiDaySunny } from "../package/weather-icons-react";
import "./style/Home.css";
import StoriesCard from '../components/top stories/StoriesCard';
import { add } from 'ionicons/icons';
import WeatherModal from '../components/WeatherModal';
import Addmodal from '../components/top stories/addmodal';
import { db, fstore } from '../Firebase/Firebase';
import { PostInterface } from '../interfaces/posts';
import FlipMove from "react-flip-move";
import SkeletonHome from '../components/top stories/dummy';
import PageHeader from '../components/PageHeader';
import { Pictures } from './images/images';
import { initializePushNotification } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { selectCountry } from '../states/reducers/countryReducer';
import { countryInfoInterface } from '../interfaces/country';
import { Toast } from '@capacitor/toast';
import { Dialog } from '@capacitor/dialog';
import { useHistory, useParams } from 'react-router';
import { fetchPostById, getSyncedFeed } from '../Firebase/pages/top pages';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { UserInterface } from '../interfaces/users';
import { selectUser } from '../states/reducers/userReducers';
import axios from 'axios';
import { getCountry } from '../states/storage/storage-getters';
import GeoSyncModal from '../components/GeoSyncModal';
import { selectLocation } from '../states/reducers/location-reducer';
import { Capacitor } from '@capacitor/core';
import { NotificationRedux, selectNotification, update_notifications } from '../states/reducers/InAppNotifications';
import { getInAppNotifications } from '../Firebase/pages/inAppNotifications';
import { InAppNotification } from '../interfaces/notifications';



const Home: React.FC = function () {
    const [addStory, setaddStory] = useState(false)
    const [noData, setnoData] = useState(false)
    const [distance, setdistance] = useState(0)
    const [stories, setstories] = useState<PostInterface[]>([])
    const [openSinkMap, setopenSinkMap] = useState(false)
    const [loaded, setloaded] = useState(false)
    const dispatch = useDispatch()

    const countryinfo: countryInfoInterface = useSelector(selectCountry)
    const locationInfo: { long: number, lat: number } = useSelector(selectLocation)
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const params: { postid: string } = useParams()
    const user: UserInterface = useSelector(selectUser)
    const history = useHistory();
    const notifState:NotificationRedux=useSelector(selectNotification)
    const {notifications}=notifState;
    
    useEffect(() => {

        if (params.postid == `default` || !params.postid) {
            if (countryinfo && !loaded) {
                getFeed(() => { })
                setloaded(true);
            }
            return;
        }
        setTimeout(() => {
            getPost(params.postid)

        }, 1400);

    }, [params])
    async function getPost(postid: string) {
        setstories([])

        let country = countryinfo.name || (await getCountry())?.name || 'South Africa';
        fetchPostById(postid, country, (post: PostInterface) => {
            setstories([])
            setstories([post])
            if ([post].length <= 0) {
                setnoData(true)
            }
        }, () => {
            setnoData(true)
        })
    }

 
    function updateNotificationList(values: InAppNotification[]) {
        if (notifications.length < values.length) {
            dispatch(update_new(true))
        }
        dispatch(update_notifications(values))
    }

    useEffect(() => {
        console.log(`fetching...`)
        let unsub = () => { }
        if (!loaded && countryinfo) {
            setloaded(true)
            return
        }
        if (countryinfo) {
            unsub = getFeed(() => { })
            getInAppNotifications({ user_email: user.email, country: countryinfo.name, callBack: updateNotificationList })
        }

        return (() => unsub())

    }, [countryinfo])

    function getFeed(callBack: () => void) {
        const country_name = countryinfo.name || `South Africa`
        setnoData(false)
        setstories([])
        setdistance(0)
        const unsub = fstore.collection(`posts/${country_name}/feed`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            })
            callBack()
            setstories([...data])
            if (data.length <= 0) {
                setnoData(true)
            }
        })
        return unsub
    }

    function getFeedForAnyCountry() {
        fstore.collection(`posts`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            });
            setstories([...data])
        })
    }
    async function schedule() {
        await LocalNotifications.checkPermissions()
            .then(res => console.log(res, 'then------------'))
            .catch(res => console.log(res, 'catch------------'))

        LocalNotifications.schedule({
            notifications: [{
                title: "Title",
                body: "Body",
                id: 1,
                schedule: { at: new Date(Date.now() + 1000 * 5) },
                sound: undefined,
                attachments: undefined,
                actionTypeId: "",
                extra: {
                    data: 'welcome home'
                }

            }
            ]
        }).then(res => {
            console.log(res);

        }).catch(err => {
            console.log(err)
        })
        LocalNotifications.addListener('localNotificationActionPerformed', () => {
            console.log('performedHistor')
        })
        LocalNotifications.addListener('localNotificationReceived', () => {
            console.log('recieved')
        })
    }


    useEffect(() => {

        if (Capacitor.isNative)
            PushNotif(user, history);
    }, [])
    async function SyncFeedWithDistance(radius: number) {
        setnoData(false)
        setstories([])
        const feed: any[] = await getSyncedFeed(radius, countryinfo.name, locationInfo);
        if (feed.length <= 0) {
            setnoData(true)
        }
        setstories([...feed])
        console.log(feed)
        setopenSinkMap(false)
        setdistance(radius)
    }



    return (
        <IonPage className={`home`}>
            <PageHeader></PageHeader>
            <IonContent className={`home`}>
                <GeoSyncModal displayText={`Sync feed to`} isOpen={openSinkMap} onDidDismiss={radius => { if (radius) SyncFeedWithDistance(radius) }}></GeoSyncModal>
                <IonToolbar>
                    <IonItem lines={`none`}>
                        {distance <= 0 && <IonCardSubtitle>Sync feed to your location</IonCardSubtitle>}
                        <IonCardSubtitle  >
                            {distance > 0 && <small>sync currently at radius {distance}km</small>}
                        </IonCardSubtitle>
                        <IonButton fill={`outline`} color={`secondary`} onClick={() => setopenSinkMap(true)} slot={`end`} >{distance == 0 ? <>Sync</> : <>change</>}</IonButton>
                    </IonItem>
                    {/* <IonRange step={10} ticks onIonChange={(e: any) => setdistance(e.target.value || 100)} value={distance} min={100} max={5000}></IonRange> */}
                </IonToolbar>
                <IonRefresher ref={refresherRef} onIonRefresh={() => getFeed(() => refresherRef.current?.complete())} slot={`fixed`}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {
                    stories.length <= 0 && !noData && <SkeletonHome></SkeletonHome>
                }

                {stories.length > 0 && !noData &&

                    stories.map((post, index) => {
                        return (
                            <StoriesCard key={post.id} post={post}></StoriesCard>
                        )
                    })
                }

                <FlipMove>
                    {
                        noData && stories.length <= 0 && <IonToolbar style={{ textAlign: `center`, paddingTop: `10vh` }}><IonImg src={Pictures.notfound} />
                            <IonCardSubtitle>NO FEED YET </IonCardSubtitle>
                        </IonToolbar>
                    }
                </FlipMove>
            </IonContent>

            <IonFab vertical={`bottom`} horizontal={`end`} >
                <IonFabButton onClick={() => setaddStory(true)} color={`secondary`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <Addmodal isOpen={addStory} onDidDismiss={() => { setaddStory(false) }}></Addmodal>
        </IonPage>
    );
};

export default Home;


function PushNotif(user: any, history: any) {

    PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
        } else {
            // Show some error
        }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
        (token: Token) => {
            // alert('Push registration success, token: ' + token.value);
            console.log(token.value);
            const formatEmail = user.email.replaceAll('.', '');
            db.ref('tokens').child(formatEmail).set(token.value)
        }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
        (error: any) => {
            // alert('Error on registration: ' + JSON.stringify(error));
        }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
            // alert('Push received: ' + JSON.stringify(notification));
        }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: any) => {
            //    alert('Pussssh action performed: ' + JSON.stringify(notification));
            // alert('Push performed: ' + JSON.stringify(Object.keys(notification)));
            // alert('Push performed: ' + JSON.stringify((notification)));
            const { type, id } = notification.notification.data
            history.push(`/${type}/${id}`);
        }
    );

}

function update_new(arg0: boolean): any {
    throw new Error('Function not implemented.');
}
