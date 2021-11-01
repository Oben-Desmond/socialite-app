import { Dialog } from '@capacitor/dialog'
import { Toast } from '@capacitor/toast'
import { IonModal, IonHeader, IonProgressBar, IonContent, IonCardContent, IonToolbar, IonCardTitle, IonInput, IonTextarea, IonButton, IonIcon, IonItem, IonLabel, IonButtons } from '@ionic/react'
import { cameraOutline, trash } from 'ionicons/icons'
import { title } from 'process'
import React, { useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useSelector } from 'react-redux'
import { uploadAd } from '../../Firebase/services/advert_queries'
import { Advert } from '../../interfaces/adverts_interfaces'
import { countryInfoInterface } from '../../interfaces/country'
import { UserInterface } from '../../interfaces/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectUser } from '../../states/reducers/userReducers'
import ImageSlide from '../image slides'
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../PhotoOptionsModal'

interface EditAdvert {
    advert: Advert,
    isOpen: boolean,
    onDidDismiss: () => void
}

const EditAdvert: React.FC<EditAdvert> = ({ advert, isOpen, onDidDismiss }) => {
    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [showImg, setshowImg] = useState<number>()
    const [image, setimage] = useState<string>(advert.image_url)
    const user: UserInterface = useSelector(selectUser)
    const [changesMade, setchangesMade] = useState(false)

    const [thisTitle, setthisTitle] = useState(advert.title);
    const [thisClickLink, setthisClickLink] = useState(advert.link);
    const [thisActionText, setthisActionText] = useState(advert.action_text);


    function editPost(e: any) {
        e.preventDefault()

        if (user.email) {
            // setloading(true)
            // if (countryInfo) {
            //     UpdatePost(data, post, countryInfo).then(() => {
            //         Dialog.alert({ message: `post has been updated`, title: `sucessful` })
            //         Toast.show({ text: `post has been updated` })
            //         onDidDismiss()

            //     }).catch(alert).finally(() => {
            //         setimages([])
            //         setloading(false)
            //         e.target.title.value = ``
            //         e.target.description.value = ``


            //     })
            // }
        }

    }
    function deleteItem(index: number) {

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
    }


    function cancelChanges() {

        setchangesMade(false)

    }

    function handleTitleChange(e: CustomEvent) {
        setthisTitle(e.detail.value || ``)
        detectChanges({ thisTitle: e.detail.value, thisActionText, thisClick: thisClickLink })
    }
    function handleLinkChange(e: CustomEvent) {
        setthisClickLink(e.detail.value || ``)
        detectChanges({ thisTitle, thisActionText, thisClick: e.detail.value })
    }
    function handleActionTextChange(e: CustomEvent) {
        setthisActionText(e.detail.value || ``)
        detectChanges({ thisTitle, thisActionText: e.detail.value, thisClick: thisClickLink })
    }

    function detectChanges(input: { thisTitle: string, thisActionText: string, thisClick: string }) {
        const { thisClick, thisActionText, thisTitle } = input
        if (thisTitle == advert.title && thisClick == advert.link && thisActionText == advert.action_text) {
            setchangesMade(false)
        }
        else {
            setchangesMade(true)
        }
    }

    async function deleteAd() {
        const value = (await Dialog.confirm({ message: `Are you sure you want to permanently delete this advert ? \n`, title: `Delete Advert`, okButtonTitle: `Delete` })).value
        if (value) {

        }
        
    }

    return (
        <IonModal onDidDismiss={onDidDismiss} showBackdrop swipeToClose cssClass={`add-modal edit-modal`} mode={`ios`} isOpen={isOpen}>

            <IonHeader>
                <div className="header">
                    {!loading && <div className="bar"></div>}
                    {loading && <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
                </div>
            </IonHeader>

            <IonContent>

                <IonCardContent mode={`md`}>
                    <IonToolbar className={`ion-padding`} >
                        <IonCardTitle color={`secondary`} className={`ion-padding-start`}>Edit Advert</IonCardTitle>
                        <IonButtons slot={`end`}>
                            <IonButton onClick={deleteAd}>
                                <IonIcon icon={trash}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar >
                    <IonCardContent>
                        <form onSubmit={editPost} action="">
                            <FlipMove style={{ display: `flex` }}>
                                {
                                    <span onClick={() => setshowImg(0)} style={{ flex: 1, marginLeft: `10px` }} key={image}>
                                        <ImageSlide deleteItem={() => deleteItem(0)} img={image} ></ImageSlide>
                                    </span>
                                }
                            </FlipMove>
                            <div style={{ height: `10px` }}></div>
                            {/* <div className="input">
                                <IonItem lines={`none`} color={`none`} onClick={() => setPhotoOptions(true)} button>
                                    <IonIcon color={`secondary`} icon={cameraOutline}></IonIcon>
                                    <IonLabel className={`ion-padding-start`}> add photo</IonLabel>
                                </IonItem>
                            </div> */}
                            <div className="input ">
                                <IonInput onClick={(e: any) => e.target.scrollIntoView({ behavior: 'smooth' })} onIonChange={handleTitleChange} value={thisTitle} placeholder={`Enter title of ad`}></IonInput>
                            </div>
                            <div className="input ">
                                <IonInput type={`url`} onClick={(e: any) => e.target.scrollIntoView({ behavior: 'smooth' })} onIonChange={handleLinkChange} value={thisClickLink} required name={`link`} placeholder={`Enter click link e.g socionet.co.za`}></IonInput>
                            </div>
                            <div className="input ">
                                <IonInput onClick={(e: any) => e.target.scrollIntoView({ behavior: 'smooth' })} onIonChange={handleActionTextChange} value={thisActionText} required name={`action`} placeholder={`Enter call to action e.g Contact Us`}></IonInput>
                            </div>

                            <IonToolbar style={{ height: `40px` }}></IonToolbar>

                            {changesMade && <IonToolbar className={`ion-padding-top`} style={{ textAlign: `center` }}>
                                <IonButton slot="end" type={"submit"}>
                                    save changes</IonButton>
                                <IonButton fill='outline' onClick={cancelChanges}>
                                    cancel</IonButton>
                            </IonToolbar>}
                        </form>
                    </IonCardContent>
                    <IonToolbar style={{ height: `50px` }}></IonToolbar>
                </IonCardContent>
                <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
            </IonContent>



        </IonModal>
    )
}

export default EditAdvert
