// @flow strict

import { IonBackdrop, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { arrowBack, callOutline, close, cloudOutline, mailOutline } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router';
import { hideTabBar } from '../../App';


function Jobs() {
    const history = useHistory()
    function goBack() {
        history.goBack()
    }
    useIonViewDidLeave(()=>{
        hideTabBar(false)
    })
    useIonViewDidEnter(()=>{
        hideTabBar()
    })
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonButtons onClick={goBack} slot={`start`}>
                        <IonButton>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Jobs</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader>
                    <IonToolbar color={`light`}>
                        <IonSearchbar color={`dark`}></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonToolbar color={`light`}>

                    <JobCard title={`Graphic Designer needed`}></JobCard>
                    <JobCard title={`Musician in South Africa`}></JobCard>
                    <JobCard title={`Software Engineer needed`}></JobCard>
                    <JobCard title={`Pastor needed `}></JobCard>
                </IonToolbar>
            </IonContent>
        </IonPage>
    );
};

export default Jobs;


function JobCard(props: { title: string }) {

    const [view, setview] = React.useState(false)
    return (
        <IonCard onClick={() => setview(true)}>
            <IonCardHeader>
                <IonCardTitle>{props.title}</IonCardTitle>
                <IonCardSubtitle>Digital Rentals Ltd</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <ul>
                        <li>Basic HTML </li>
                        <li>2 years working experience</li>
                    </ul>
                    <IonChip color={`secondary`}>200000XAF a month</IonChip>
                </IonList>
            </IonCardContent>
            <IonModal onDidDismiss={() => setview(false)} isOpen={view}>
                <IonHeader>
                    <IonToolbar color={`primary`}>
                        <IonButtons slot={`start`}>
                            <IonBackdrop />
                            <IonButton>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>
                            {props.title}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent >
                    <IonCardContent>
                    <IonCardTitle>
                            {props.title}
                        </IonCardTitle>
                        <IonCardSubtitle>more about {props.title} job </IonCardSubtitle><br/><br/>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae architecto quaerat consequuntur vero culpa. Quis, delectus ad! Sint, odit asperiores iure ab eos nostrum, obcaecati voluptatum, atque facilis suscipit blanditiis a consectetur. Vitae iure, cupiditate totam minima ab ipsam molestias.
               </p>
                   <p>
                       <IonLabel>skills</IonLabel>
                       <ul>
                           <li>HTML</li>
                           <li>CSS</li>
                       </ul>
                   </p>
                   <IonItemDivider>
                       <IonLabel>contacts</IonLabel>
                   </IonItemDivider>
                   <IonGrid>
                       <IonRow>
                           <IonCol>
                               <IonButton fill={`clear`}>
                                   <IonIcon icon={callOutline}></IonIcon>
                                   <IonLabel>+237 6783000021</IonLabel>
                               </IonButton>
                           </IonCol>
                           <IonCol>
                               <IonButton fill={`clear`}>
                                   <IonIcon icon={mailOutline}></IonIcon>
                                   <IonLabel>example@gmail.com</IonLabel>
                               </IonButton>
                           </IonCol>
                           <IonCol>
                               <IonButton fill={`clear`}>
                                   <IonIcon icon={cloudOutline}></IonIcon>
                                   <IonLabel>https://example.com</IonLabel>
                               </IonButton>
                           </IonCol>
                       </IonRow>
                   </IonGrid>
                    </IonCardContent>
                </IonContent>
            </IonModal>
        </IonCard>
    )
}