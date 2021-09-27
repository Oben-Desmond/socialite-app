import React, { useEffect, useState } from 'react';
import { Circle, GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { IonButton, IonButtons, IonCardHeader, IonCardSubtitle, IonContent, IonFooter, IonItem, IonModal,  IonPage, IonRange, IonToolbar } from '@ionic/react';
import { selectLocation } from '../states/reducers/location-reducer';
import { useSelector } from 'react-redux';

interface GeoSyncModal{
   isOpen:boolean,
   onDidDismiss:(val:number)=>void,

}

const GeoSyncModal:React.FC<GeoSyncModal> = ({isOpen, onDidDismiss}) => {
    const location: { long: number, lat: number } = useSelector(selectLocation)
    const [distance, setdistance] = useState(500)
    const [selected, setselected] = useState<{ location: { lng: number, lat: number }, name: string } | undefined>()

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const [defaultCenter, setdefaultCenter] = useState({
        lat: 41.3851, lng: 2.1734
    });
    useEffect(() => {
        setdefaultCenter({ lat: location.lat || 4.2345, lng: location.long || 9.37643676 })
    }, [location])

    return (
        <IonModal  isOpen={isOpen} onDidDismiss={()=>onDidDismiss(distance)}>
            <IonContent>
                <LoadScript
                    googleMapsApiKey='AIzaSyBLuEonWXa8ftaMsTUbKkbY6viRboNkxrg'>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={13}
                        center={defaultCenter}


                    >  <Marker onClick={() => setselected({ location: defaultCenter, name: `your current location` })} clickable position={defaultCenter} options={{}} />
                        <Circle
                            center={defaultCenter}
                            radius={distance}
                            options={{
                                strokeColor: "#ffb700"
                            }}
                        />
                        {
                            selected?.location &&
                            (
                                <InfoWindow
                                    position={selected.location}

                                    onCloseClick={() => setselected(undefined)}
                                >
                                    <p>{selected.name}</p>
                                </InfoWindow>
                            )
                        }
                    </GoogleMap>
                </LoadScript>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonItem lines={`none`}>
                        <IonCardSubtitle>Sync feed to  {distance} kilometers</IonCardSubtitle>
                        <IonButton color={`secondary`} slot={`end`} >Sync</IonButton>
                    </IonItem>
                    <IonRange step={10} ticks onIonChange={(e: any) => setdistance(e.target.value || 100)} value={distance} min={100} max={5000}></IonRange>
                </IonToolbar>
            </IonFooter>
        </IonModal>
    )
}

export default GeoSyncModal;

const locations = [
    {
        name: "Location 1",
        location: {
            lat: 41.3954,
            lng: 2.162
        },
    },
    {
        name: "Location 2",
        location: {
            lat: 41.3917,
            lng: 2.1649
        },
    },
    {
        name: "Location 3",
        location: {
            lat: 41.3773,
            lng: 2.1585
        },
    },
    {
        name: "Location 4",
        location: {
            lat: 41.3797,
            lng: 2.1682
        },
    },
    {
        name: "Location 5",
        location: {
            lat: 41.4055,
            lng: 2.1915
        },
    }
];