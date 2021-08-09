// @flow strict

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { IonModal, IonHeader, IonContent, IonLoading, IonCardContent, IonToolbar, IonCardTitle, IonItem, IonIcon, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonBackdrop } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import   React, { useRef, useState } from 'react';
import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';
import { UploadContent, UploadEventContent } from '../../Firebase/pages/top pages';
import { countryInfoInterface } from '../../interfaces/country';
import { StoreStateInteface } from '../../interfaces/redux';
import { UserInterface } from '../../interfaces/users';
import ImageSlide from '../image slides';
 

const AddEventModal:React.FC<{ onDidDismiss: () => void, isOpen: boolean }> = function({isOpen,onDidDismiss}) {
    const rootState: StoreStateInteface |any  = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([]);

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
      
        e.target.title.value = ``
        e.target.story.value = ``
        e.target.category.value = ``
       
        if (user.email) {
            setloading(true)

            UploadEventContent(data,images, user, countryInfo).then(() => {
                alert(`posted`)
                Toast.show({ text: `Event has been posted` })
                dropRef.current?.click()
            }).finally(() => {
                setimages([])
                setloading(false)

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
    return <IonModal onDidDismiss={onDidDismiss} swipeToClose cssClass={`add-modal`} mode={`ios`} isOpen={isOpen}>

        <IonHeader>
            <div className="header">
                <div className="bar"></div>
            </div>
        </IonHeader>
        <IonContent>
            <IonLoading onDidDismiss={() => setloading(false)} isOpen={loading} message={`Posting your Event`}></IonLoading>
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
                            <IonItem lines={`none`} color={`none`} onClick={() => {
                                Camera.getPhoto({ resultType: CameraResultType.DataUrl, allowEditing: true,source:CameraSource.Photos }).then((res) => {
                                    setimages([...images, res.dataUrl])
                                })
                            }} button>
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> Take photos</IonLabel>
                            </IonItem>
                        </div>
                        <div className="input">
                            <IonInput required name={`title`} placeholder={`add title of Event`}></IonInput>
                        </div>
                        <div style={{whiteSpace: `pre-wrap`}} className="input">
                            <IonTextarea required name={`story`} placeholder={`add event description`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>add category</IonLabel>
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
                                Post Event</IonButton>
                        </IonToolbar>
                    </form>
                </IonCardContent>
            </IonCardContent>
            {false && <div >
                <IonBackdrop ref={dropRef}></IonBackdrop>
            </div>}
        </IonContent>

    </IonModal>
};

export default AddEventModal 

 