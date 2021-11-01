import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonCardSubtitle, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonModal, IonNote, IonPage, IonRange, IonToolbar } from '@ionic/react';
import { selectLocation } from '../states/reducers/location-reducer';
import { useSelector } from 'react-redux';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Pictures } from './images/images';
import { crop, cropOutline, reload } from 'ionicons/icons';
import ImageEditModal from '../components/ImageEditModal';

const Maps = () => {
    const location: { long: number, lat: number } = useSelector(selectLocation)

    const [result, setresult] = useState(``)
    const [edit, setedit] = useState(false)
    // const [distance, setdistance] = useState(500)
    // const [selected, setselected] = useState<{location:{lng:number,lat:number},name:string}|undefined>()

    // const mapStyles = {
    //     height: "100vh",
    //     width: "100%"
    // };

    // const [defaultCenter, setdefaultCenter] = useState({
    //     lat: 41.3851, lng: 2.1734
    // });
    // useEffect(() => {
    //     setdefaultCenter({ lat: location.lat || 4.2345, lng: location.long || 9.37643676 })
    // }, [location])

    return (
        <IonPage>
            
            <IonContent>
                <IonButton onClick={()=>setedit(true)}>edit</IonButton>


                {/* <LoadScript
                    googleMapsApiKey='AIzaSyBLuEonWXa8ftaMsTUbKkbY6viRboNkxrg'>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={13}
                        center={defaultCenter}


                    >  <Marker onClick={()=>setselected({location:defaultCenter,name:`your current location`})} clickable position={defaultCenter} options={{}} />
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
                </LoadScript> */}
                {/* <CropDemo src={Pictures.event1}></CropDemo> */}
                <ImageEditModal src={Pictures.event1} isOpen={edit} onDidDismiss={(img) => { setresult(``); setresult(img); setedit(false)}}></ImageEditModal>
              { result&& <IonImg src={result}></IonImg>}
            </IonContent>
            {/* <IonFooter>
                <IonToolbar>
                    <IonItem lines={`none`}>
                        <IonCardSubtitle>Sync feed to  {distance} kilometers</IonCardSubtitle>
                        <IonButton color={`secondary`}  slot={`end`} >Sync</IonButton>
                    </IonItem>
                    <IonRange step={10}  ticks onIonChange={(e: any) => setdistance(e.target.value || 100)} value={distance} min={100} max={5000}></IonRange>
                </IonToolbar>
            </IonFooter> */}
        </IonPage>
    )
}

export default Maps;

function CropDemo(props: { src: string }) {
    const { src } = props
    const [crop, setCrop] = useState<Partial<Crop> | any>({ width: 50, height: 50, unit: `%`, x: 30, y: 30, });
    const [image, setimage] = useState<HTMLImageElement>();
    // const [srcImg, setSrcImg] = useState<HTMLImageElement>()

    const [result, setResult] = useState<any>(null);


    const getCroppedImg = async () => {
        if (!image) return;
        try {
            const canvas: any = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            const base64Image = canvas.toDataURL("image/jpeg", 1);
            setResult(base64Image);
            console.log(result);
        } catch (e) {
            alert(e)
            console.log("crop the image");
        }
    };

    return <><ReactCrop keepSelection onImageLoaded={setimage} src={src} crop={crop} onChange={(newCrop: any) => setCrop(newCrop)} />
        <IonButton onClick={() => getCroppedImg()}>Done</IonButton>
        {
            result && <img src={result} />
        }
    </>;
}

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
