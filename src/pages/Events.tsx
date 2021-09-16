import { IonCardSubtitle, IonContent, IonFab, IonFabButton, IonIcon, IonImg, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import AddEventModal from '../components/Events/addEventModal';
import { fetchEventById } from '../components/Events/event-functions';
import EventsModal from '../components/Events/EventsModal';
import PageHeader from '../components/PageHeader';
import SkeletonHome from '../components/top stories/dummy';
import { GetHoursAgo } from '../components/top stories/StoriesCard';
import { fstore } from '../Firebase/Firebase';
import { countryInfoInterface } from '../interfaces/country';
import { PostInterface } from '../interfaces/posts';
import { selectCountry } from '../states/reducers/countryReducer';
import { getCountry } from '../states/storage/storage-getters';
import { Pictures } from './images/images';


const Events: React.FC = function () {
    const [addEvent, setaddEvent] = useState(false)
    const [noData, setnoData] = useState(false)
    const [events, setevents] = useState<PostInterface[]>([])
    const countryinfo: countryInfoInterface = useSelector(selectCountry)
    const params: { postid: string } = useParams()
    const refresherRef = useRef<HTMLIonRefresherElement>(null)

    useEffect(() => {
        if (params.postid == `default` || !params.postid) return;
        getPost(params.postid)

    }, [params])
    async function getPost(postid: string) {
        setevents([])
        let country = countryinfo.name || (await getCountry())?.name || 'South Africa';

        fetchEventById(postid, country, (post: PostInterface) => {
            setevents([])
            setevents([post])
            if ([post].length <= 0) {
                setnoData(true)
            }
        }, () => {
            setnoData(true)
        })
    }

    useEffect(() => {
        console.log(`fetching...`)
        if (countryinfo) {
            getEvent(() => { })
        }

    }, [countryinfo])

    function getEvent(callback: () => void) {
        setnoData(false)
        setevents([])
        const country_name = countryinfo.name || `South Africa`
        fstore.collection(`posts/${country_name}/events`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            })
            if (data.length <= 0) setnoData(true)
            setevents([...data])
            callback()
        })
    }
    return (
        <IonPage>
            <PageHeader></PageHeader>
            <IonContent>
                <IonRefresher ref={refresherRef} onIonRefresh={() => getEvent(() => refresherRef.current?.complete())} slot={`fixed`}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {events.length <= 0 && !noData && <SkeletonHome></SkeletonHome>}
                <>{
                    events.map((post, index) => {
                        return (
                            <EventCard key={post.id} post={post}></EventCard>
                        )
                    })
                }</>
                {
                    events.length <= 0 && noData && <IonToolbar style={{ textAlign: `center`, paddingTop: `10vh` }}><IonImg src={Pictures.notfound} />
                        <IonCardSubtitle>NO EVENTS YET </IonCardSubtitle>
                    </IonToolbar>
                }
            </IonContent>
            <IonFab vertical={`bottom`} horizontal={`end`} >
                <IonFabButton onClick={() => setaddEvent(true)} color={`secondary`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <AddEventModal isOpen={addEvent} onDidDismiss={() => setaddEvent(false)}></AddEventModal>
        </IonPage>
    );
};

export default Events;


const EventCard: React.FC<{ post: PostInterface }> = function ({ post }) {
    const [openNotice, setopenNotice] = useState(false)
    return (
        <div onClick={() => setopenNotice(true)} style={{ boxShadow: `0px 2px 5px rgba(0,0,0,0.34)`, marginBottom: `10px` }}>
            <IonToolbar>
                <div style={{ textAlign: `center`, maxHeight: `46vh` }}>
                    <img src={post.images[0]} />
                </div>
            </IonToolbar>
            <IonToolbar style={{ padding: `10px 20px` }}>
                <div >
                    <IonLabel style={{ textTransform: `capitalize` }}><b>{post.title}</b></IonLabel>
                    <p style={{ color: `#595858`, fontSize: `15px`, marginBottom: `0` }} >
                        {post.description.substr(0, 150)}...
                        </p>
                </div>
                <IonToolbar>
                    <IonLabel color={`medium`} ><GetHoursAgo timestamp={post.timestamp} />  <IonLabel color={`secondary`}>{post.location}</IonLabel></IonLabel>
                </IonToolbar>
            </IonToolbar>
            <EventsModal isOpen={openNotice} onDidDismiss={() => setopenNotice(false)} post={post}></EventsModal>
        </div>
    )
}
