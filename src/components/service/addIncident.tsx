import { Camera, CameraResultType } from "@capacitor/camera";
import { IonModal, IonHeader, IonContent, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonThumbnail, IonImg, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonLoading, IonProgressBar, IonText } from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { PostInterface } from "../../interfaces/posts";
import { fstore } from "../../Firebase/Firebase";
import { DefaultRootState, useSelector } from "react-redux";
import { UserInterface } from "../../interfaces/users";
import { Toast } from "@capacitor/toast";
import FlipMove from "react-flip-move";
import ImageSlide from "../image slides";
import { UploadContent } from "../../Firebase/pages/top pages";
import { StoreStateInteface } from "../../interfaces/redux";
import { countryInfoInterface } from "../../interfaces/country";
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from "../PhotoOptionsModal";
import { Dialog } from "@capacitor/dialog";
import { reportInterface, serviceProvider } from "../../interfaces/reportTypes";
import * as  uuid from "uuid";
import { selectLocation } from "../../states/reducers/location-reducer";
import { useHistory } from "react-router";
import { getServicesNearBy, ReportIncident } from "../../Firebase/services/report";
import { availableAccount } from "./serviceTypes";
import { selectServiceAccount } from "../../states/reducers/service-reducer";


const Medical_Emergency =`Medical_Emergency`
const Crime = `Crime`
const Accident =`Accident`
const Protest= `Protest`
const Municipal_Issues =  `Municipal_Issues`

const report_type = {
    Municipal_Issues,
    Medical_Emergency,
    Crime,
    Protest, 
    Accident

}



const AddIncident: React.FC<{ onDidDismiss: () => void, isOpen: boolean, parentImages: string[] }> = ({ onDidDismiss, isOpen, parentImages }) => {

    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>(parentImages);
    const [category, setcategory] = useState<string>(``);
    const contentRef = useRef<HTMLIonContentElement>(null)
    const location: { long: number, lat: number } = useSelector(selectLocation);

    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const textAreaRef = useRef<HTMLIonTextareaElement>(null)
    const inputRef = useRef<HTMLIonInputElement>(null)
    const history = useHistory();
    const [nearBYServiceProvider, setnearBYServiceProvider] = useState<availableAccount[]>([]);

    useEffect(() => {
        console.log(images)
        if (category) {
            GetNearByPlaces()
        }
    }, [category])

    async function GetNearByPlaces() {
        try {
            const serAcc: any = await getServicesNearBy(countryInfo.name, category);
            setnearBYServiceProvider([...serAcc]);
        } catch (err) {
            Dialog.alert({ message: err.message || err || 'Unexpected error occured', title: 'Error getting nearby police stations' })
        }
    }
    const addPost = function (e: any) {
        e.preventDefault();
        if (!user.email) {
            history.push(`/login`);
            return;
        }
        const incident: reportInterface = {
            author: user.email,
            category:categoryFromType(category),
            country: countryInfo.name,
            description: textAreaRef.current?.value || ``,
            id: uuid.v4(),
            images,
            location,
            photoUrl: user.photoUrl,
            seenBy: [],
            sentTo: [...nearBYServiceProvider],
            timestamp: Date.now(),
            username:user.name
        }
      
        
        if (user.email) {
            setloading(true)

            ReportIncident(incident, nearBYServiceProvider,countryInfo.name).then(() => {

                Toast.show({ text: `case reported` })
                onDidDismiss()
            }).finally(() => {
               textAreaRef.current?.setAttribute('value','');
                setimages([])
                setloading(false)

            })
        }
    }
    useEffect(() => {
        setimages([...parentImages])
    }, [parentImages])

    function categoryFromType(category:string):string{

        switch (category) {
            case report_type.Accident: return `health`;
            case report_type.Crime: return `police`;
            case report_type.Medical_Emergency: return `health`;
            case report_type.Municipal_Issues: return `municipal`;
            case report_type.Protest: return `police`;
               
        
            default: return `police`
        }

    }

    function deleteItem(item: number) {
        const imgs = images
        // imgs.splice(item,1)
        // setimages([...imgs])
        console.log(item)
        imgs.splice(item, 1)
        setimages([...imgs])
    }
    function scrollDown() {
        contentRef.current?.scrollToBottom(400)
    }
    function takePicture() {
        setPhotoOptions(false)
        photosFromCamera().then((data: any) => {
            if (data)
                setimages([...images, data])

        })
    }


    function galleryPhotos() {
        setPhotoOptions(false)
        photosFromGallery().then((data: any) => {
            if (data)
                setimages([...images, data])
        })
    }
    return <IonModal onDidDismiss={onDidDismiss} swipeToClose cssClass={`add-modal`} mode={`ios`} isOpen={isOpen}>

        <IonHeader>
            <div className="header">
                {!loading && <div className="bar"></div>}
                {loading && <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
            </div>
        </IonHeader>
        <IonLoading message={nearBYServiceProvider.length<=0?`Sending Report... `:`sending Report to ${nearBYServiceProvider.length} ${category} offices`} isOpen={loading} onDidDismiss={()=>{ setloading(false)}} />
        <IonContent ref={contentRef}>
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonCardTitle>ADD INCIDENTS</IonCardTitle>
                </IonToolbar >
                <IonCardContent >
                    <form onSubmit={addPost} action="">
                        <FlipMove  >
                            {images.length > 0 && <IonItem className={`images`}>
                                <FlipMove style={{ display: `flex` }}>
                                    {
                                        images.map((img, index) => {
                                            return (
                                                <span onClick={() => setshowImg(index)} style={{ flex: 1, marginLeft: `10px`, maxHeight: `46vh`, width: `100%`, border: `1px solid var(--ion-color-secondary)` }} key={index}>
                                                    <ImageSlide deleteItem={() => deleteItem(index)} img={img} ></ImageSlide>
                                                </span>
                                            )
                                        })
                                    }
                                </FlipMove>
                            </IonItem>}
                        </FlipMove>
                        <div style={{ height: `30px` }}></div>
                        <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() => setPhotoOptions(true)} button>
                                <IonIcon color={`secondary`} icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Add photos of incident</IonLabel>
                            </IonItem>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>Report a ...</IonLabel>
                                <IonSelect interface={`action-sheet`} onIonChange={(e) => setcategory(e.detail.value)} value={category || `sports`} name={`category`} >
                                <IonSelectOption value={Crime}>Crime</IonSelectOption>
                                    <IonSelectOption value={Medical_Emergency}>Medical Emergency</IonSelectOption>
                                    <IonSelectOption value={Accident}>Accident</IonSelectOption>
                                    <IonSelectOption value={Protest}>Protest</IonSelectOption>
                                    <IonSelectOption value={Municipal_Issues}>Municipal Issues</IonSelectOption>
                                </IonSelect>
                            </IonItem >
                        </div>
                        <div style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea   rows={4}   ref={textAreaRef} onClick={() => { textAreaRef.current?.scrollIntoView({ behavior: `smooth` }) }} required name={`desc`} placeholder={`Describe Incident`}></IonTextarea>
                        </div>

                        <IonToolbar style={{ height: `40px` }}></IonToolbar>
                        <IonToolbar style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                                Report</IonButton>
                        </IonToolbar>
                        <IonToolbar style={{ height: `30vh` }} ></IonToolbar>
                    </form>
                </IonCardContent>
            </IonCardContent>
            {false && <div >
                <IonBackdrop ref={dropRef}></IonBackdrop>
            </div>}
            <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
        </IonContent>

    </IonModal>
}



export default AddIncident