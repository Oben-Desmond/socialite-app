import { Dialog } from '@capacitor/dialog'
import { Toast } from '@capacitor/toast'
import { IonModal, IonHeader, IonProgressBar, IonContent, IonCardContent, IonToolbar, IonCardTitle, IonInput, IonTextarea, IonButton } from '@ionic/react'
import React, { useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useSelector } from 'react-redux'
import { countryInfoInterface } from '../../interfaces/country'
import { UserInterface } from '../../interfaces/users'
import { selectCountry } from '../../states/reducers/countryReducer'
import { selectUser } from '../../states/reducers/userReducers'
import ImageSlide from '../image slides'
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from '../PhotoOptionsModal'

interface EditAdvert {
    advert: {
        image: string,
        video?: string,
        description: string,
        title: string
    },
    isOpen: boolean,
    onDidDismiss: () => void
}

const EditAdvert: React.FC<EditAdvert> = ({ advert, isOpen, onDidDismiss }) => {
    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [showImg, setshowImg] = useState<number>()
    const [image, setimage] = useState<string>(advert.image)
    const [input, setinput] = useState({ title: advert.title, description: advert.description })
    const user: UserInterface = useSelector(selectUser)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const titleRef = useRef<HTMLDivElement>(null)
    const descRef = useRef<HTMLDivElement>(null)
    const [changesMade, setchangesMade] = useState(false)


    function editPost(e: any) {
        e.preventDefault()
        const { title, description } = input
        let data: any = { title, description }

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

    function changeText(){
        if(!changesMade){
            setchangesMade(true)
        }
    }

    function cancelChanges(){
     setinput({ title: advert.title, description: advert.description })
     setchangesMade(false)

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
                            <div ref={titleRef} onClick={() => titleRef.current?.scrollIntoView({ behavior: `smooth` })} className="input">
                                <IonInput onIonChange={e => {setinput({ ...input, title: (e.detail.value || ``) }); changeText()}} value={input.title} required name={`title`} placeholder={`Enter title of description`}></IonInput>
                            </div>
                            <div ref={descRef} onClick={() => descRef.current?.scrollIntoView({ behavior: `smooth` })} style={{ whiteSpace: `pre-wrap` }} className="input">
                                <IonTextarea rows={4} value={input.description} onIonChange={e => {setinput({ ...input, description: (e.detail.value || ``) }); changeText()}} required name={`description`} placeholder={`Enter description detail`}></IonTextarea>
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
                            <IonToolbar style={{ height: `40px` }}></IonToolbar>

                           {changesMade&& <IonToolbar className={`ion-padding-top`} style={{ textAlign: `center` }}>
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
