// @flow strict
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/react';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { WiDaySunny } from "../package/weather-icons-react";
import "./style/Home.css";
import StoriesCard from '../components/top stories/StoriesCard';
import { add } from 'ionicons/icons';
import WeatherModal from '../components/WeatherModal';
import Addmodal from '../components/top stories/addmodal';
import { fstore } from '../Firebase/Firebase';
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



const Home: React.FC = function () {
    const [addStory, setaddStory] = useState(false)
    const [noData, setnoData] = useState(false)
    const [stories, setstories] = useState<PostInterface[]>([])
    const countryinfo: countryInfoInterface = useSelector(selectCountry)
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const params: { postid: string } = useParams()

    useEffect(() => {
        if (params.postid == `default` || !params.postid) return;
        getPost(params.postid)

    }, [params])

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
    function getPost(postid: string) {
        setstories([])
        fetchPostById(postid, countryinfo.name, (post: PostInterface) => {
            setstories([post, ...stories])
            if([post, ...stories].length<=0){
                setnoData(true)
            }
        }, ()=>{
            setnoData(true)
        })
    }
    return (
        <IonPage className={`home`}>
            <PageHeader></PageHeader>
            <IonContent className={`home`}>
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

