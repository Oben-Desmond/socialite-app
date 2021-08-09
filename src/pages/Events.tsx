import { IonCardSubtitle, IonContent, IonFab, IonFabButton, IonIcon, IonImg, IonLabel, IonPage, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import AddEventModal from '../components/Events/addEventModal';
import PageHeader from '../components/PageHeader';
import ProfileModal from '../components/ProfileModal';
import Addmodal from '../components/top stories/addmodal';
import SkeletonHome from '../components/top stories/dummy';
import { GetHoursAgo, StoryModal } from '../components/top stories/StoriesCard';
import { fstore } from '../Firebase/Firebase';
import { PostInterface } from '../interfaces/posts';
import { Pictures } from './images/images';


const Events: React.FC = function () {
    const [addEvent, setaddEvent] = useState(false)
    const [events, setevents] = useState<PostInterface[]>([])

    useEffect(() => {
        console.log(`fetching...`)
        fstore.collection(`events`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            })
            console.log(data)
            setevents([...data])
        })

    }, [])
    return (
        <IonPage>
            <PageHeader></PageHeader>
            <IonContent>
                {events.length<=0&&<SkeletonHome></SkeletonHome>}
                <FlipMove>
                    {
                        events.map((post, index) => {
                            return (
                                <EventCard key={post.id} post={post}></EventCard>
                            )
                        })
                    }
                </FlipMove>
                <FlipMove>
                    {
                        events.length <= 0 && <IonToolbar style={{ textAlign: `center`, paddingTop: `10vh` }}><IonImg src={Pictures.notfound} />
                            <IonCardSubtitle>NO EVENTS YET </IonCardSubtitle>
                        </IonToolbar>
                    }
                </FlipMove>
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
                    <p style={{ color: `#595858`, fontSize: `15px` ,marginBottom:`0`}} >
                        {post.description.substr(0, 150)}...
                        </p>
                </div>
                <IonToolbar>
                    <IonLabel color={`primary`} ><GetHoursAgo timestamp={post.timestamp} /> | <IonLabel color={`secondary`}>{post.location}</IonLabel></IonLabel>
                </IonToolbar>
            </IonToolbar>
            <StoryModal title={`Events`} isOpen={openNotice} onDidDismiss={() => setopenNotice(false)} post={post}></StoryModal>
        </div>
    )
}