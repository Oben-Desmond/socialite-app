import { Camera, CameraResultType } from "@capacitor/camera";
import { IonModal, IonHeader, IonContent, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonThumbnail, IonImg, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonLoading, IonProgressBar } from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
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



const AddIncident: React.FC<{ onDidDismiss: () => void, isOpen: boolean, parentImages: string[] }> = ({ onDidDismiss, isOpen, parentImages }) => {

    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([...parentImages]);
    const contentRef = useRef<HTMLIonContentElement>(null)

    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const addPost = function (e: any) {



        if (user.email) {
            setloading(true)

            // UploadContent(data, images, user, countryInfo).then(() => {

            //     Toast.show({ text: `post has been sent` })
            //     onDidDismiss()
            // }).finally(() => {
            //     e.target.title.value = ``
            //     e.target.story.value = ``
            //     setimages([])
            //     setloading(false)

            // })
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
        <IonContent ref={contentRef}>
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonCardTitle>ADD INCIDENTS</IonCardTitle>
                </IonToolbar >
                <IonCardContent>
                    <form onSubmit={addPost} action="">
                        <FlipMove  >
                            {images.length > 0 && <IonItem className={`images`}>
                                <FlipMove style={{ display: `flex` }}>
                                    {
                                        images.map((img, index) => {
                                            return (
                                                <span onClick={() => setshowImg(index)} style={{ flex: 1, marginLeft: `10px` }} key={index}>
                                                    <ImageSlide deleteItem={() => deleteItem(index)} img={img} ></ImageSlide>
                                                </span>
                                            )
                                        })
                                    }
                                </FlipMove>
                            </IonItem>}
                        </FlipMove>
                        <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() => setPhotoOptions(true)} button>
                                <IonIcon color={`secondary`} icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Add photos of incident</IonLabel>
                            </IonItem>
                        </div>

                        <div style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea onClick={scrollDown} required name={`desc`} placeholder={`Describe Incident`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>category</IonLabel>
                                <IonSelect name={`category`} value={`sports`}>

                                    <IonSelectOption value={`Robbery`}>Robbery</IonSelectOption>
                                    <IonSelectOption value={`accident`}>Accident</IonSelectOption>
                                    <IonSelectOption value={`Fight`}>Fight</IonSelectOption>
                                    <IonSelectOption value={`Gunshots`}>Family</IonSelectOption>
                                    <IonSelectOption value={`Injured Person`}>Injured Person</IonSelectOption>
                                    {/* <IonSelectOption value={`politics`}>Politics</IonSelectOption>
                                    <IonSelectOption value={`religion`}>Religion</IonSelectOption>
                                    <IonSelectOption value={`science`}>Science</IonSelectOption>
                                    <IonSelectOption value={`sports`}>Sports</IonSelectOption>
                                    <IonSelectOption value={`technology`}>Technology</IonSelectOption> */}
                                </IonSelect>
                            </IonItem >
                        </div>
                        <IonToolbar style={{ height: `40px` }}></IonToolbar>
                        <IonToolbar style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                                Post</IonButton>
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