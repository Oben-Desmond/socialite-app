import { IonAvatar, IonButton, IonButtons, IonCardSubtitle, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonText, IonToolbar } from '@ionic/react';
import { add, thumbsDownOutline, thumbsUp, thumbsUpOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import AddEventModal from '../components/Events/addEventModal';
import { fetchEventById } from '../components/Events/event-functions';
import EventsModal from '../components/Events/EventsModal';
import LetteredAvatar from '../components/LetterAvatar';
import PageHeader from '../components/PageHeader';
import SkeletonHome from '../components/top stories/dummy';
import { GetHoursAgo } from '../components/top stories/StoriesCard';
import { fstore } from '../Firebase/Firebase';
import { sendReactionNotificaton } from '../Firebase/services/reaction-notifications';
import { countryInfoInterface } from '../interfaces/country';
import { PostInterface } from '../interfaces/posts';
import { UserInterface } from '../interfaces/users';
import { selectCountry } from '../states/reducers/countryReducer';
import { selectUser } from '../states/reducers/userReducers';
import { getCountry } from '../states/storage/storage-getters';
import { Pictures } from './images/images';
import './style/Events.css';


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
    const [readmore, setreadmore] = useState<boolean>(false);
    const [liked, setliked] = useState(false);
    const [postLikes, setpostLikes] = useState(post.likes);
    const [postDislikes, setpostDislikes] = useState(post.dislikes);
    const [disliked, setdisliked] = useState(false);
    const user: UserInterface = useSelector(selectUser);

    useEffect(() => {
        if ((post.likes || []).filter(email => (email == user.email)).length > 0) {
            setliked(true)
        }
        else {
            setliked(false)
        }
        if ((post.dislikes || []).filter(email => (email == user.email)).length > 0) {
            setdisliked(true)
        }
        else {
            setdisliked(false)
        }
    }, [])
    function likePost() {
        let newPostLikes = [...(post.likes || []), user.email]
        if (liked) {
            newPostLikes = [...(post.likes || []).filter(email => !(email == user.email))];

        }
        sendReactionNotificaton('', user, post);

        newPostLikes = newPostLikes.filter((email, index) => (!newPostLikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ likes: newPostLikes });
        setpostLikes(newPostLikes);
        setliked(!liked);
    }
    function disLikePost() {
        let newpostDislikes = [...(post.dislikes || []), user.email]
        if (!disliked) {
            newpostDislikes = [...(post.dislikes || []).filter(email => !(email == user.email))];

        }
        newpostDislikes = newpostDislikes.filter((email, index) => (!newpostDislikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ dislikes: newpostDislikes });
        setpostDislikes(newpostDislikes);
        setdisliked(!disliked);
    }
    return (
        <div style={{ boxShadow: `0px 2px 5px rgba(0,0,0,0.34)`, marginBottom: `10px` }}>
            <IonToolbar className='image-container'>
                <div onClick={() => setopenNotice(true)} style={{ textAlign: `center`, maxHeight: `46vh` }}>
                    <img src={post.images[0]} />
                </div>
                <div className="reactions">
                    <IonItem color='none' lines='none'>
                        {
                            (post.author_url || (user.email == post.email && user.photoUrl)) ?
                                <IonAvatar>
                                    <IonImg src={user.photoUrl || post.author_url} />
                                </IonAvatar> : <LetteredAvatar name={post.author_name}></LetteredAvatar>
                        }
                        <div style={{ width: '10px' }}></div>
                        <IonText color='light'>
                            {post.author_name}
                        </IonText>

                        <IonButtons slot='end' >
                            <IonButton onClick={() => { likePost() }} color={`light`}>
                                <IonIcon slot='start' color={!liked ? 'light' : 'secondary'} icon={!liked ? thumbsUpOutline : thumbsUp}></IonIcon>
                                <IonLabel>
                                    {
                                        postLikes?.length
                                    }
                                </IonLabel>
                            </IonButton>
                            <IonButton onClick={() => { disLikePost() }} color={`light`}>
                                <IonIcon slot='start' color={!disliked ? 'light' : 'secondary'} icon={thumbsDownOutline}></IonIcon>
                                <IonLabel>
                                    {
                                        postDislikes?.length
                                    }
                                </IonLabel>
                            </IonButton>
                        </IonButtons>
                    </IonItem>
                </div>
            </IonToolbar>
            <IonToolbar onClick={() => setopenNotice(true)} style={{ padding: `10px 20px` }}>
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
