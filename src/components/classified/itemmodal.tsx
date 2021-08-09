// @flow strict

import { IonAvatar, IonBackdrop, IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from '@ionic/react';
import { arrowBack, callOutline, close, heartOutline, locationOutline, logoWhatsapp, mailOutline, shareSocial, shareSocialOutline } from 'ionicons/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { classifiedItemInterface } from '../../interfaces/classifiedItems';
import { StoreStateInteface } from '../../interfaces/redux';
import { UserInterface } from '../../interfaces/users';
import LetteredAvatar from '../LetterAvatar';
import ClassifiedItem from './ClassifiedItem';
import { Share } from "@capacitor/share";

import "./style.css";


const ClassifiedItemModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void, item: classifiedItemInterface, distance: number }> = function ({ isOpen, onDidDismiss, item, distance }) {

    const contentRef = React.useRef<HTMLIonContentElement>(null)
    const rootState: StoreStateInteface | any = useSelector(state => state)
    const user: UserInterface | undefined = rootState.userReducer


    function scrollToBottom() {
        contentRef.current?.scrollToBottom(2500)
    }

    function contactSeller() {
        if (user?.email && user.name)
            fetch(`https://socialiteapp-backend.herokuapp.com/classified/contact-warning?email=${user.email}&name=${user.name}`).finally(console.log)
    }

  async  function shareItem() {

        await Share.share({
            title: `${item.item_name}`,
            text: `Checkout this cool item from Socialite app`,
            url: `http:socialite.web.app/${item.item_id}`,
            dialogTitle: 'Share with friends and Family',
        });
    }
    return (
        <IonModal cssClass={`classified-modal`} onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonContent ref={contentRef}>
                <div className="top-slide">
                    <IonButton color={`light`} shape={`round`} className={`close-btn`} >
                        <IonIcon icon={arrowBack} />
                        <IonBackdrop></IonBackdrop>
                    </IonButton>
                    <IonSlides>
                        {item.item_images.map((image, index) => <IonSlide key={index}>
                            <img className={`main-img`} src={image} alt="" />
                        </IonSlide>)}
                    </IonSlides>

                    {item.item_images.length > 1 && <div className="pager">
                        <span></span>
                        <span className={`pager-content`}>
                            {
                                item.item_images.map((img, index) => {
                                    return (
                                        <div ><div className={`circle ${index == 0 && `active`}`}></div></div>
                                    )
                                })
                            }
                        </span>
                        <span></span>
                    </div>}
                </div>
                <IonCardContent>
                    <div className="name-price">
                        <IonCardTitle className={`item-title`}>
                            {item.item_name} <IonChip color={`danger`}>{item.item_category}</IonChip>
                        </IonCardTitle>
                        <div className={`item-price`} >{item.item_cost}</div>
                    </div>
                    <div className="reactions">
                        <IonCardTitle className="sub-title">
                        </IonCardTitle>
                        <div className="react-grid">
                            <div> <IonButton fill={`clear`} className={`btn-react`} color={`dark`}>
                                <IonIcon icon={heartOutline}></IonIcon>
                            </IonButton></div>
                            <div>
                                <IonButton onClick={shareItem} fill={`clear`} className={`btn-react`} color={`dark`}>
                                    <IonIcon icon={shareSocialOutline}></IonIcon>
                                </IonButton>
                            </div>
                            <div>
                                <IonButton onClick={() => scrollToBottom()} fill={`clear`} className={`btn-react`} color={`dark`}>
                                    <IonIcon icon={locationOutline}></IonIcon>
                                </IonButton>
                            </div>
                        </div>
                    </div>
                    <IonCardSubtitle className={`item-desc`}>
                        {
                            item.item_desc
                        }
                    </IonCardSubtitle>
                    <IonCardTitle className="sub-title">
                        Features
                    </IonCardTitle>
                    <div className="list">
                        {
                            item.item_features.map((feature) => (
                                <IonItem key={feature}>
                                    {feature}
                                </IonItem>))
                        }
                    </div>
                    <IonCardTitle className="sub-title">
                        Contact Supplier
                    </IonCardTitle>
                    <IonGrid className={`contact-card`}>
                        <IonRow>
                            <IonCol size={`4`}>
                                <LetteredAvatar size={80} backgroundColor={`var(--ion-color-primary)`} name={item.item_contact.user_name.substr(0, 1)} />
                            </IonCol>
                            <IonCol>
                                <div className="name">{item.item_contact.user_name}</div>
                                <IonRow onClick={contactSeller} className={`contact-fabs`}>
                                    <IonCol>
                                        <IonFabButton href={`https://wa.me/${item.item_contact.user_tel}`} color={`success`}>
                                            <IonIcon icon={logoWhatsapp} />
                                        </IonFabButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonFabButton href={`tel:${item.item_contact.user_tel}`} color={`tertiary`}>
                                            <IonIcon icon={callOutline} />
                                        </IonFabButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonFabButton href={`mailto:${item.item_contact.user_email}`} color={`danger`}>
                                            <IonIcon icon={mailOutline} />
                                        </IonFabButton>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonCardTitle className={`sub-title`}>
                        Location <br />
                        <IonNote>
                            {Math.floor(distance)} km from you
                    </IonNote>
                    </IonCardTitle>

                    <div>
                        <iframe src={`http://maps.google.com/maps?q=${item.item_location.lat}, ${item.item_location.long}&z=15&output=embed`} height="450" style={{ border: "0", width: `100%` }} loading="lazy"></iframe>
                    </div>
                    {/* <div className="recommended">
                        <IonCardTitle className={`sub-title`}>
                            Recommended
                    </IonCardTitle>
                        <IonGrid className={`classifieds`}>
                            <IonRow>
                                <IonCol size={`6`}>
                                    <ClassifiedItem item={`https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`}></ClassifiedItem>
                                    <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />

                                </IonCol>
                                <IonCol size={`6`} >
                                    <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                    <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1602810320073-1230c46d89d4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div> */}

                </IonCardContent>
            </IonContent>
        </IonModal>
    );
};

export default ClassifiedItemModal


export function CalculateDistanceKm(point1: { long: number, lat: number }, point2: { long: number, lat: number }) {

    function deg2rad(deg: number) {
        return deg * (Math.PI / 180)
    }
    const lat1 = point1.lat, lon1 = point1.long, lat2 = point2.lat, lon2 = point2.long
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log(`d------------------`, d)
    return (d)





}
