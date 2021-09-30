// @flow strict

import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import   React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Pictures } from '../images/images';
import { Toast } from '@capacitor/toast';
import "../style/notifications.css";
import { hideTabBar } from '../../App';
import { InAppNotification } from '../../interfaces/notifications';
import TimeAgo from '../../components/timeago';
import LetteredAvatar from '../../components/LetterAvatar';


function Notifications() {
    const [feeds, setfeeds] = useState<InAppNotification[]>([])
    const [notices, setnotices] = useState<InAppNotification[]>([])
    const [events, setevents] = useState<InAppNotification[]>([])
    const [classifieds, setclassifieds] = useState<InAppNotification[]>([])


    const notifications: InAppNotification[] = [
        {
            category: 'feed',
            id: 'jhsjhjd',
            message: 'you are the best thing that happened to me',
            path: 'https://socionet.co.za/feed',
            post_id: '',
            sender: 'obend678@gmail.com',
            sender_photo: '',
            timestamp: Date.now(),
            type: 'comment',
            post_title: 'Emerging Cameroon',
            sender_name: 'Oben Desmond'
        }
    ]
    useEffect(() => { 
        setfeeds([...notifications.filter(info=>info.category=='feed')])
        setnotices([...notifications.filter(info=>info.category=='public notice')])
        setevents([...notifications.filter(info=>info.category=='events')])
        setclassifieds([...notifications.filter(info=>info.category=='classified')])
    }, [notifications])
    const history = useHistory()
    function goBack() {
        history.goBack()
    }
    useIonViewDidLeave(() => {
        hideTabBar(false)
    })
    useIonViewDidEnter(() => {
        hideTabBar()
    })
    return (
        <IonPage className={`notifications`}>
            <IonHeader>
                <IonToolbar className='ion-padding-top' color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItemDivider>Stories</IonItemDivider>
                    {
                        notifications.map((info) => {
                            return (<NotificationItem notification={info} />);
                        })
                    }
                    {/* <NotificationItem />
                    <NotificationItem />
                    <NotificationItem /> */}
                </IonList>
                {/* <IonList>
                    <IonItemDivider>Public notice</IonItemDivider>
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList>
                <IonList>
                    <IonItemDivider>Events</IonItemDivider>
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList> */}
            </IonContent>
        </IonPage>
    );
};

export default Notifications;

const NotificationItem: React.FC<{ notification: InAppNotification }> = ({ notification }) => {

    function showToast() {
        Toast.show({ text: `notification opened` }).then(console.log)
    }
    if (notification.type == 'comment') {
        return (
            <IonItem button onClick={showToast}>
                <Avatar name={notification.sender_name.trim()} photoUrl={notification.sender_photo} usePicture={!!notification.sender_photo} ></Avatar>
                <IonNote><b>{notification.sender_name}</b> sent a comment on your post <b><i>"{notification.post_title}"</i></b></IonNote>
                <IonNote className={`ion-margin-start`}>
                    <TimeAgo timestamp={notification.timestamp}></TimeAgo>
                </IonNote>
            </IonItem>
        )
    }
    return (
        <IonItem button onClick={showToast}>
            <IonAvatar slot={`start`}>
                <IonImg src={Pictures.dp} />
            </IonAvatar>
            <IonNote>Rosabell replied to your comment this on Developing South Africa</IonNote>
            <IonNote className={`ion-margin-start`}>2:23 pm</IonNote>
        </IonItem>
    )
}



function Avatar(props: { usePicture: boolean, photoUrl: string, name: string }) {
    const { usePicture, name, photoUrl } = props
    return (
        <> {usePicture ? <IonAvatar slot={`start`}>
            <IonImg src={photoUrl} />
        </IonAvatar> : <div style={{marginBottom:5, marginRight:10, transform:'translateY(-5px) scale(0.8)'}} >
            <LetteredAvatar name={name[0]} ></LetteredAvatar>
        </div>}</>
    )
}