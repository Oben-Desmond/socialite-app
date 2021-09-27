import { IonContent, IonLabel, IonPage } from "@ionic/react";
import React,{FC} from "react";

import GoogleMapReact from 'google-map-react';

const Maps:FC= function() {
 
   const defaultProps = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      zoom: 11
    };
    return (
        <IonPage>
            <IonContent>
                <IonLabel>Maps</IonLabel>
                <GoogleMapReact
          bootstrapURLKeys={{ key: `AIzaSyBLuEonWXa8ftaMsTUbKkbY6viRboNkxrg`}}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
          </GoogleMapReact>
            </IonContent>
        </IonPage>
    )
}




const AnyReactComponent = (props:{ lat: number; lng: number; text: string; }) => <div className="ripple"></div>;

export default Maps
