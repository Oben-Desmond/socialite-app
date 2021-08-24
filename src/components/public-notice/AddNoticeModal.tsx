
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
import { UploadPublicNotice } from "./firebase-functions";
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from "../PhotoOptionsModal";



const AddNoticeModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean }> = ({ onDidDismiss, isOpen }) => {

    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([]);
    const [PhotoOptions, setPhotoOptions] = useState(false)

    const titleRef = useRef<HTMLDivElement>(null)
    const storyRef = useRef<HTMLDivElement>(null)

    const [loading, setloading] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const addPost = function (e: any) {
        e.preventDefault()
        let { title, story, category } = e.target
        let data: any = { title, story, category }
        Object.keys(data).map(key => {
            if (data[key]) {
                return data[key] = data[key].value
            }
        })



        if (user.email) {
            setloading(true)
            UploadPublicNotice(data, images, user, countryInfo).then(() => {
                alert(`posted`)
                Toast.show({ text: `post has been sent` })
                dropRef.current?.click()
            }).finally(() => {
                setimages([])
                setloading(false)
                e.target.title.value = ``
                e.target.story.value = ``
                e.target.category.value = ``
                onDidDismiss()

            })
        }
    }
    function deleteItem(item: number) {
        const imgs = images
        // imgs.splice(item,1)
        // setimages([...imgs])
        imgs.splice(item, 1)
        setimages([...imgs])
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
        <IonContent>
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonCardTitle>ADD PUBLIC NOTICE</IonCardTitle>
                </IonToolbar >
                <IonCardContent>
                    <form onSubmit={addPost} action="">
                        <FlipMove style={{ display: `flex` }}>
                            {
                                images.map((img, index) => {
                                    return (
                                        <span onClick={() => setshowImg(index)} style={{ flex: 1, marginLeft: `10px` }} key={img}>
                                            <ImageSlide deleteItem={() => deleteItem(index)} img={img} ></ImageSlide>
                                        </span>
                                    )
                                })
                            }
                        </FlipMove>
                        <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() =>setPhotoOptions(true) } button>
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Take photos</IonLabel>
                            </IonItem>
                        </div>
                        <div onClick={() => titleRef.current?.scrollIntoView({ behavior: `smooth` })} ref={titleRef} className="input">
                            <IonInput required name={`title`} placeholder={`Enter title of notice`}></IonInput>
                        </div>
                        <div onClick={() => storyRef.current?.scrollIntoView({ behavior: `smooth` })} ref={storyRef} style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea required name={`story`} placeholder={`Enter Public Notice`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>category</IonLabel>
                                <IonSelect name={`category`} value={`sports`}>
                                    <IonSelectOption value={`sports`}>Sports</IonSelectOption>
                                    <IonSelectOption value={`business`}>Business</IonSelectOption>
                                    <IonSelectOption value={`business`}>Education</IonSelectOption>
                                    <IonSelectOption value={`entertainment`}>Entertainment</IonSelectOption>
                                    <IonSelectOption value={`family`}>Family</IonSelectOption>
                                    <IonSelectOption value={`health`}>Health</IonSelectOption>
                                    <IonSelectOption value={`politics`}>Politics</IonSelectOption>
                                    <IonSelectOption value={`religion`}>Religion</IonSelectOption>
                                    <IonSelectOption value={`science`}>Science</IonSelectOption>
                                </IonSelect>
                            </IonItem >
                        </div>
                        <IonToolbar style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                                Post</IonButton>
                        </IonToolbar>
                    </form>
                </IonCardContent>
                <IonToolbar style={{ height: `70px` }}></IonToolbar>
            </IonCardContent>
        </IonContent>
        <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
    </IonModal>
}



export default AddNoticeModal
