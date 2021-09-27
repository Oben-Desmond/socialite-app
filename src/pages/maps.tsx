import { IonContent, IonLabel, IonPage, IonRange } from "@ionic/react";
import React, { FC, useEffect, useState } from "react";

import GoogleMapReact from 'google-map-react';
import './style/ripple.css';
import { useSelector } from "react-redux";
import { selectLocation } from "../states/reducers/location-reducer";

const Maps: FC = function () {
    const location=useSelector(selectLocation)

    const [defaultProps, setdefaultProps] = useState({
        center: {
            lat: location.lat,
            lng: location.long
        },
        zoom: 18
    });

    useEffect(() => {
        console.log(location)
        setdefaultProps({...defaultProps, center:{lat:location.lat, lng:location.long}})
    }, [location])
    return (
        <IonPage>
            <IonContent>
                <IonLabel>Maps</IonLabel>
                <IonRange max={18} value={defaultProps.zoom}  onIonChange={(e:any)=>setdefaultProps({...defaultProps,zoom:(e.target.value)})} min={5} ></IonRange>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: `AIzaSyBLuEonWXa8ftaMsTUbKkbY6viRboNkxrg` }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                    <AnyReactComponent
                        lat={location.lat||defaultProps.center.lat}
                        lng={location.long||defaultProps.center.lng}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </IonContent>

        </IonPage>
    )
}




const AnyReactComponent = (props: { lat: number; lng: number; text: string; }) => <div className="ripple"></div>;

export default Maps
