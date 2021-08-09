
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonModal, IonHeader, IonContent, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonThumbnail, IonImg, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonLoading, IonCardSubtitle } from "@ionic/react";
import { addOutline, cameraOutline, removeCircle, removeCircleOutline, shirt, shirtOutline, trashOutline } from "ionicons/icons";
import React, { useContext, useRef, useState } from "react";
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
import { UploadPublicNotice } from "../public-notice/firebase-functions";
import { UploadClassifiedItem } from "./uploadClassifiedToDB";
import { SelectedTabContext } from "../../pages/Classifieds";



const UploadClassified: React.FC<{ onDidDismiss: () => void, isOpen: boolean }> = ({ onDidDismiss, isOpen }) => {

    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([]);
    const [features, setfeatures] = useState<string[]>([])
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [selectedTab, setselectedTab] = useContext(SelectedTabContext)

    const [loading, setloading] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const addPost = function (e: any) {
        e.preventDefault()
        let { name, desc, category, cost } = e.target
        let data: any = { name, desc, category, cost }
        Object.keys(data).map(key => {
            if (data[key]) {
                return data[key] = data[key].value
            }
        })




        if (user.email) {
            setloading(true)
            UploadClassifiedItem(data, images, user, countryInfo, features).then(() => {
                alert(`posted`)
                Toast.show({ text: `post has been sent` })
                setselectedTab(data.category)
                dropRef.current?.click()
                fetch(`https://socialiteapp-backend.herokuapp.com/classified/upload-mail?email=${user.email}&name=${user.name}`, { mode: `cors` }).catch(console.log).finally(console.log)

            }).finally(() => {
                setimages([])
                setloading(false)
                e.target.name.value = ``
                e.target.desc.value = ``
                e.target.category.value = ``
                e.target.cost.value = ``


            })
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

    function changeFeature(value: string | any, index: number) {
        if (value) {
            let f = features;
            f[index] = value;
            setfeatures([...f])
        }
    }

    function deleteFeature(index: number) {
        const fs = features
        fs.splice(index, 1)
        setfeatures([...fs])
    }

    function takePicture() {

        photosFromCamera().then((data: any) => {
            if (data)
                setimages([...images, data])

        })
    }


    function galleryPhotos() {
        photosFromGallery().then((data: any) => {
            if (data)
                setimages([...images, data])
        })
    }
    return <IonModal onDidDismiss={onDidDismiss} swipeToClose cssClass={`add-modal`} mode={`ios`} isOpen={isOpen}>

        <IonHeader>
            <div className="header">
                <div className="bar"></div>
            </div>
        </IonHeader>
        <IonContent>
            <IonLoading onDidDismiss={() => setloading(false)} isOpen={loading} message={`Posting your Story`}></IonLoading>
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonIcon color={`secondary`} size={`large`} slot={`start`} icon={shirtOutline} />
                    <IonCardTitle className={`ion-padding-start`}>UPLOAD ITEM </IonCardTitle>
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
                            <IonItem lines={`none`} color={`none`} onClick={() => { setPhotoOptions(true) }} button>
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> add images of Item</IonLabel>
                            </IonItem>
                        </div>
                        <div className="input">
                            <IonInput required name={`name`} placeholder={`Enter name of item`}></IonInput>
                        </div>
                        <div style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea required name={`desc`} placeholder={`Enter Description of Item`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>category</IonLabel>
                                <IonSelect name={`category`} >
                                    <IonSelectOption value={`clothing`}>clothing</IonSelectOption>
                                    <IonSelectOption value={`food`}>food stuff</IonSelectOption>
                                    <IonSelectOption value={`electronics`}>Electronics</IonSelectOption>
                                    <IonSelectOption value={`cars`}>cars</IonSelectOption>
                                    <IonSelectOption value={`books`}>book</IonSelectOption>
                                    <IonSelectOption value={`apartment`}>apartment</IonSelectOption>
                                    <IonSelectOption value={`pets`}>pets</IonSelectOption>
                                    {/* <IonSelectOption value={`politics`}>Politics</IonSelectOption>
                                    <IonSelectOption value={`religion`}>Religion</IonSelectOption>
                                    <IonSelectOption value={`science`}>Science</IonSelectOption> */}
                                </IonSelect>
                            </IonItem >
                        </div>
                        <div className="input">
                            <IonInput required name={`cost`} placeholder={`cost e.g $35`}></IonInput>
                        </div>
                        {features.length > 0 && <IonCardSubtitle>
                            Features
                        </IonCardSubtitle>}
                        <FlipMove>
                            {
                                features.map((val, index) => {
                                    return (
                                        <IonToolbar>
                                            <div key={index} className="input">
                                                <IonInput type={`search`} onIonChange={(e) => changeFeature(e.detail.value, index)} value={val} required name={`feature${index + 1}`} placeholder={`Enter feature ${index + 1}`}></IonInput>
                                            </div>
                                            <IonButton onClick={() => deleteFeature(index)} fill={`clear`} slot={`end`}>
                                                <IonIcon icon={removeCircleOutline} />
                                            </IonButton>
                                        </IonToolbar>
                                    )
                                })
                            }
                        </FlipMove>
                        <IonButton className={`ion-margin-bottom`} onClick={() => { setfeatures([...features, ``]) }} color={`medium`} fill={`outline`}>
                            <IonIcon icon={addOutline} />
                            <IonLabel>add {features.length > 0 && `another`} feature</IonLabel>
                        </IonButton>
                        <IonToolbar className={`ion-padding-top`} style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                                Post</IonButton>
                        </IonToolbar>
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



export default UploadClassified