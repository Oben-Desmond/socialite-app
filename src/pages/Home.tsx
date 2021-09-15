// @flow strict
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/react';
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
import { useSelector } from 'react-redux';
import { selectCountry } from '../states/reducers/countryReducer';
import { countryInfoInterface } from '../interfaces/country';
import { Toast } from '@capacitor/toast';
import { Dialog } from '@capacitor/dialog';
import { useParams } from 'react-router';
import { fetchPostById } from '../Firebase/pages/top pages';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { UserInterface } from '../interfaces/users';
import { selectUser } from '../states/reducers/userReducers';
import axios from 'axios';



const Home: React.FC = function () {
    const [addStory, setaddStory] = useState(false)
    const [noData, setnoData] = useState(false)
    const [stories, setstories] = useState<PostInterface[]>([])
    const countryinfo: countryInfoInterface = useSelector(selectCountry)
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const params: { postid: string } = useParams()
    const user: UserInterface = useSelector(selectUser)

    useEffect(() => {
        if (params.postid == `default` || !params.postid) return;
        getPost(params.postid)

    }, [params])
    function getPost(postid: string) {
        setstories([])
        fetchPostById(postid, countryinfo.name, (post: PostInterface) => {
            setstories([])
            setstories([post])
            if ([post].length <= 0) {
                setnoData(true)
            }
        }, () => {
            setnoData(true)
        })
    }

    useEffect(() => {
        console.log(`fetching...`)
        let unsub = () => { }
        if (countryinfo) {
            unsub = getFeed(() => { })
        }

        return (() => unsub())

    }, [countryinfo])

    function getFeed(callBack: () => void) {
        const country_name = countryinfo.name || `South Africa`
        setnoData(false)
        setstories([])
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
            console.log('performed')
        })
        LocalNotifications.addListener('localNotificationReceived', () => {
            console.log('recieved')
        })
    }

    function PushNotif() {

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
                alert('Push received: ' + JSON.stringify(notification));
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: any) => {
                alert('Pussssh action performed: ' + JSON.stringify(notification));
            }
        );

    }
    useEffect(() => {
        PushNotif();
    }, [])

    async function sendNotification() {
        db.ref('tokens').child('obend678@gmailcom').once('value', (snapshot) => {
            const token = snapshot.val()
            if (token) {
                axios.post('https://socialiteapp-backend.herokuapp.com/message/single', { token }).catch(alert).then(alert)
            }
        })//

    }

    return (
        <IonPage className={`home`}>
            <PageHeader></PageHeader>
            <IonContent className={`home`}>
                <IonRefresher ref={refresherRef} onIonRefresh={() => getFeed(() => refresherRef.current?.complete())} slot={`fixed`}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {/* <IonButton onClick={() => schedule()} >notify</IonButton>
                <IonButton color={`success`} onClick={() =>PushNotif()} >push notify</IonButton> */}
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

