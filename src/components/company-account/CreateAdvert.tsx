import { Dialog } from '@capacitor/dialog'
import { Toast } from '@capacitor/toast'
import { IonModal, IonHeader, IonProgressBar, IonContent, IonCardContent, IonToolbar, IonCardTitle, IonInput, IonTextarea, IonButton, IonBackdrop, IonIcon, IonItem, IonLabel } from '@ionic/react'
import { cameraOutline } from 'ionicons/icons'
import React, { useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useSelector } from 'react-redux'
import { UploadContent } from '../../Firebase/pages/top pages'
import { countryInfoInterface } from '../../interfaces/country'
import { StoreStateInteface } from '../../interfaces/redux'
import { UserInterface } from '../../interfaces/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectLocation } from '../../states/reducers/location-reducer'
import { selectUser } from '../../states/reducers/userReducers'
import ImageSlide from '../image slides'
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../PhotoOptionsModal'

interface CreateAdvert {
    advert?: {
        image: string,
        video?: string,
        description: string,
        title: string
    },
    isOpen: boolean,
    onDidDismiss: () => void
}

const CreateAdvert: React.FC<CreateAdvert> = ({  isOpen, onDidDismiss }) => {
    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [image, setimage] = useState<string>('');
    const contentRef = useRef<HTMLIonContentElement>(null)
    const locationInfo: { long: number, lat: number } = useSelector(selectLocation)
    const [editImage, seteditImage] = useState(false)

    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
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
        if (!image) {
            Dialog.alert({ message: `Please add an image so people can clearly understand what the Story is about`, title: `Image is Missen` })
            setPhotoOptions(true)
            return;
        }


        if (user.email) {
            setloading(true)

            // UploadContent(data, images, user, countryInfo, locationInfo).then(() => {

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

        setimage('')
    }
    function scrollDown() {
        contentRef.current?.scrollToBottom(400)
    }


    function takePicture() {

        photosFromCamera().then((data: any) => {
            if (data)
                setimage(data)

        })
    }


    function galleryPhotos() {
        photosFromGallery().then((data: any) => {
            if (data)
                setimage(data)
        })
    } function finishedEditing(newImg: string) {

        setimage(newImg);
        seteditImage(false)
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
                    <IonCardTitle>ADD AN ADVERT</IonCardTitle>
                </IonToolbar >
                <IonCardContent>
                    <form onSubmit={addPost} action="">
                        {image && <IonItem className={`images`}>
                            <FlipMove style={{ display: `flex` }}>
                                {
                                    <span onClick={() => setshowImg(0)} style={{ flex: 1, marginLeft: `10px` }} key={image}>
                                        <ImageSlide deleteItem={() => deleteItem(0)} img={image} ></ImageSlide>
                                    </span>
                                }
                            </FlipMove>
                        </IonItem>}
                        <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() => setPhotoOptions(true)} button>
                                <IonIcon color={`secondary`} icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Take photos</IonLabel>
                            </IonItem>
                        </div>
                        <div className="input">
                            <IonInput onClick={(e: any) => e.target.scrollIntoView({ behavior: 'smooth' })} autocomplete={`country-name`}   autocorrect={`on`} required name={`title`} placeholder={`Enter name of ad`}></IonInput>
                        </div>
                        <div style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea rows={4} onClick={(e: any) => e.target.scrollIntoView({ behavior: 'smooth' })} required name={`story`} placeholder={`Enter advert description`}></IonTextarea>
                        </div>
                        {/* <div className={`input`}>
                             <IonItem lines={`none`} color={`none`}>
                                 <IonLabel color={`secondary`}>category</IonLabel>
                                 <IonSelect name={`category`} value={`sports`}>
                                   
                                     <IonSelectOption value={`business`}>Business</IonSelectOption>
                                     <IonSelectOption value={`business`}>Education</IonSelectOption>
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

                        <IonToolbar style={{ textAlign: `center` }}>
                            <IonButton type={"submit"}>
                               Launch Campaign</IonButton>
                        </IonToolbar>
                        <IonToolbar style={{ height: `50vh` }} ></IonToolbar>
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

export default CreateAdvert
