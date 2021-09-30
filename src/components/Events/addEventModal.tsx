// @flow strict

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { IonModal, IonHeader, IonContent, IonLoading, IonCardContent, IonToolbar, IonCardTitle, IonItem, IonIcon, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonProgressBar } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';
import { UploadContent, UploadEventContent } from '../../Firebase/pages/top pages';
import { countryInfoInterface } from '../../interfaces/country';
import { StoreStateInteface } from '../../interfaces/redux';
import { UserInterface } from '../../interfaces/users';
import { selectLocation } from '../../states/reducers/location-reducer';
import ImageSlide from '../image slides';
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../PhotoOptionsModal';


const AddEventModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean }> = function ({ isOpen, onDidDismiss }) {
    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([]);
    const titleRef = useRef<HTMLDivElement>(null), descRef = useRef<HTMLDivElement>(null);
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const location:{long:number, lat:number}= useSelector(selectLocation)
    const [loading, setloading] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const addPost = function (e: any) {
        e.preventDefault()
        let { title, story, } = e.target
        let data: any = { title, story }
        Object.keys(data).map(key => {
            if (data[key]) {
                return data[key] = data[key].value
            }
        })
        if (images.length <= 0) {
            Dialog.alert({ message: `Please add an image so people can clearly understand what the Event is about`, title: `Image is Missen` })
            setPhotoOptions(true)
            return;
        }


        if (user.email) {
            setloading(true)

            UploadEventContent(data, images, user, countryInfo, location).then(() => {
                Toast.show({ text: `Event has been posted` })
                onDidDismiss()
            }).finally(() => {
                e.target.title.value = ``
                e.target.story.value = ``
                setimages([])
                setloading(false)

            })
        }
    }
    function deleteItem(item: number) {
        const imgs = images
        imgs.splice(item, 1)
        setimages([...imgs])
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
                {!loading && <div className="bar"></div>}
                {loading && <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
            </div>
        </IonHeader>
        <IonContent>
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonCardTitle>ADD EVENT</IonCardTitle>
                </IonToolbar >
                <IonCardContent>
                    <form onSubmit={addPost} action="">
                        {/* <IonItem lines={`none`} className={`images`}> */}
                        <FlipMove style={{ display: `flex` }}>
                            {
                                images.map((img, index) => {
                                    return (
                                        <span onClick={() => setshowImg(index)} style={{ flex: 1, marginLeft: `5px` }} key={index}>
                                            <ImageSlide deleteItem={() => deleteItem(index)} img={img} ></ImageSlide>
                                        </span>
                                    )
                                })
                            }
                        </FlipMove>
                        {/* </IonItem> */}
                        <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() =>setPhotoOptions(true)} button>
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Take photos</IonLabel>
                            </IonItem>
                        </div>
                        <div onClick={() => titleRef.current?.scrollIntoView({ behavior: `smooth` })} ref={titleRef} className="input">
                            <IonInput required name={`title`} placeholder={`add title of Event`}></IonInput>
                        </div>
                        <div onClick={() => descRef.current?.scrollIntoView({ behavior: `smooth` })} ref={descRef} style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea   rows={4}   required name={`story`} placeholder={`add event description`}></IonTextarea>
                        </div>
                        {/* <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>add category</IonLabel>
                                <IonSelect onIonChange={e=>setcategory(e.detail.value || ``)} value={category} name={`category`} >
                                    <IonSelectOption value={`business`}>Business</IonSelectOption>
                                    <IonSelectOption value={`education`}>Education</IonSelectOption>
                                    <IonSelectOption value={`entertainment`}>Entertainment</IonSelectOption>
                                    <IonSelectOption value={`family`}>Family</IonSelectOption>
                                    <IonSelectOption value={`health`}>Health</IonSelectOption>
                                    <IonSelectOption value={`politics`}>Politics</IonSelectOption>
                                    <IonSelectOption value={`religion`}>Religion</IonSelectOption>
                                    <IonSelectOption value={`science`}>Science</IonSelectOption>
                                    <IonSelectOption value={`sports`}>Sports</IonSelectOption>
                                    <IonSelectOption value={`technology`}>Technology</IonSelectOption>
                                </IonSelect>
                            </IonItem >
                        </div> */}
                        <IonToolbar style={{ height: `40px` }}></IonToolbar>
                        <IonToolbar style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                                Post Event</IonButton>
                        </IonToolbar>
                    </form>
                </IonCardContent>
                <IonToolbar style={{ height: `40vh` }}></IonToolbar>
            </IonCardContent>
            {false && <div >
                <IonBackdrop ref={dropRef}></IonBackdrop>
            </div>}
            <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
        </IonContent>

    </IonModal>
};

export default AddEventModal

