// @flow strict
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
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


const Home: React.FC = function () {
    const [addStory, setaddStory] = useState(false)
    const [showWeather, setshowWeather] = useState(false)
    const [stories, setstories] = useState<PostInterface[]>([])

    useEffect(() => {
        fstore.collection(`posts`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            });
            setstories([...data])
        })

    }, [])

    return (
        <IonPage className={`home`}>
            <PageHeader></PageHeader>
            <IonContent className={`home`}>
                {
                    stories.length <= 0 && <SkeletonHome></SkeletonHome>
                }
                <FlipMove>
                    {stories.length > 0 &&

                        stories.map((post, index) => {
                            console.log(post.description)
                            return (
                                <StoriesCard key={post.id} post={post}></StoriesCard>
                            )
                        })
                    }
                </FlipMove>
                <FlipMove>
                    {
                        stories.length <= 0 && <IonToolbar style={{ textAlign: `center`, paddingTop: `10vh` }}><IonImg src={Pictures.notfound} />
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
            <Addmodal isOpen={addStory} onDidDismiss={() => setaddStory(false)}></Addmodal>
        </IonPage>
    );
};

export default Home;

