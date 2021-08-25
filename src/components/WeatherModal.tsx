// @flow strict

import { IonBackdrop, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonModal, IonSpinner, IonToolbar } from '@ionic/react';
import { close } from 'ionicons/icons';
import * as Geolocation from '@capacitor/geolocation';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { countryInfoInterface } from '../interfaces/country';
import "./styles/weather.css";
import { useState } from 'react';


const WeatherModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {
    //  $('<iframe>') // Creates the element
    // .attr('src', iSource) // Sets the attribute spry:region="myDs"
    // .attr('height', 245) // Set the height
    // .attr('width', "100%") // Set the width
    // .appendTo('#id-weather'); // Append to an existing element ID
    const root: any = useSelector(state => state)
    const country: countryInfoInterface | undefined = root.countryReducer
    const [coords, setcoords] = React.useState<Geolocation.Position>()
    const [loading, setloading] = useState(false)
     
    return (
        <IonModal swipeToClose cssClass={`weather-modal`} onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <div className="header">
                        <div className="bar"></div>
                    </div>
                    <IonButtons slot={`end`}>
                        <IonBackdrop />
                        <IonButton>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCardContent>
                    <IonCardHeader>
                        <IonCardTitle>The Weather at your current location in {country?.name}</IonCardTitle>
                    </IonCardHeader>
                    {/* <div className="container">
                        <div className="background">
                            <div className="Circle1"></div>
                            <div className="Circle2"></div>
                            <div className="Circle3"></div>
                            <div className="content">
                                {/* <h1 className="Condition"><i className="material-icons sun">wb_sunny</i> Sunny</h1> 
                                <h1 className="Temp">72<span id="F">&#8457;</span></h1>
                                <h1 className="Time">09:35</h1>
                                <h1 className="Location"><i className="material-icons locationIcon">place</i> Raleigh, NC</h1>
                            </div>
                        </div>
                    </div> */}
                   {loading&& <IonToolbar>
                    <IonSpinner color={`secondary`}></IonSpinner>

                    </IonToolbar>}
                    {  <iframe height={`300`} width={`90%`} src={"https://forecast.io/embed/#lat=" + (coords?.coords.latitude || 7.456 )+ "&lon=" + (coords?.coords.longitude || 6.783989) + "&name=Woot&color=#00aaff"} ></iframe>
                    }
                    {!coords && <h2>OH OH ! Cant get your location</h2>}

                </IonCardContent>

            </IonContent>
        </IonModal>
    );
};

export default WeatherModal;