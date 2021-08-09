import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonLabel, IonPage, IonToolbar, IonGrid, IonRow, IonThumbnail, IonImg, IonCol, IonItem, useIonViewDidEnter, useIonViewDidLeave, IonIcon, IonNote, IonFab, IonFabButton, IonCardSubtitle } from '@ionic/react';
import { add, sunnyOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import AddNoticeModal from '../components/public-notice/AddNoticeModal';
import Addmodal from '../components/top stories/addmodal';
import { GetHoursAgo, StoryModal } from '../components/top stories/StoriesCard';
import { fstore } from '../Firebase/Firebase';
import { PostInterface } from '../interfaces/posts';
import { Pictures } from './images/images';


const PublicNotice: React.FC = function () {

    const [addNotice, setaddNotice] = useState(false)
    const [notices, setnotices] = useState<PostInterface[]>([])

    useEffect(() => {
        console.log(`fetching...`)
        fstore.collection(`notice`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            })
            console.log(data)
            setnotices([...data])
        })

    }, [])
    return (
        <IonPage>
            <PageHeader></PageHeader>
            <IonContent>
                <IonGrid >
                    {
                        notices.map((post) => {
                            return (
                                <NoticeCard key={post.id} post={post}></NoticeCard>
                            )
                        })
                    }
                    {
                        notices.length <= 0 && <IonToolbar style={{textAlign:`center`,paddingTop:`10vh`}}><IonImg src={Pictures.notfound} />
                        <IonCardSubtitle>NO PUBLIC NOTICE YET </IonCardSubtitle>
                        </IonToolbar>
                    }
                </IonGrid>

            </IonContent>
            <IonFab vertical={`bottom`} horizontal={`end`} >
                <IonFabButton onClick={() => setaddNotice(true)} color={`secondary`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <AddNoticeModal isOpen={addNotice} onDidDismiss={() => setaddNotice(false)}></AddNoticeModal>
        </IonPage>
    );
};

export default PublicNotice;


const NoticeCard: React.FC<{ post: PostInterface }> = function ({ post }) {
    const [openNotice, setopenNotice] = useState(false)
    return (
        <IonRow onClick={() => setopenNotice(true)} style={{ borderBottom: `0.5px solid #ebe7e7` }}>
            <IonCol>
                <div>
                    <img style={{ borderRadius: `10px` }} src={post.images[0]} />
                </div>
            </IonCol>
            <IonCol size={`8`}>
                <IonRow>
                    <IonCol >
                        <IonLabel style={{ fontSize: `14px`, textTransform: `capitalize` }}><b>{post.title}</b></IonLabel>
                        <p style={{ color: `#595858`, fontSize: `13px` }} >
                            {post.description.substr(0, 100)}...
                        </p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonNote color={`primary`} ><GetHoursAgo timestamp={post.timestamp} /> | <IonLabel color={`secondary`}>{post.location}</IonLabel></IonNote>
                    </IonCol>
                </IonRow>
            </IonCol>
            <StoryModal title={`public notice`} isOpen={openNotice} onDidDismiss={() => setopenNotice(false)} post={post}></StoryModal>
        </IonRow>
    )
}