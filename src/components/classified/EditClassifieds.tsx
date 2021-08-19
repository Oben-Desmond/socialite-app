
import { IonModal, IonHeader, IonContent, IonCardContent, IonCardTitle, IonItem, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonCardSubtitle, IonProgressBar, IonFabButton, IonFabList, IonFab } from "@ionic/react";
import { addOutline, cameraOutline, gridOutline, images, pencil, removeCircleOutline, shirtOutline, trashOutline } from "ionicons/icons";
import { features } from "process";
import React, { useState } from "react";
import FlipMove from "react-flip-move";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import ImageSlide from "../image slides";
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from "../PhotoOptionsModal";
import  "../../pages/style/Home.css"
interface EditClassifiedFabInterface{
    onDelete:()=>void,
    onEdit:()=>void
}

const EditClassifiedFab: React.FC<{item:classifiedItemInterface,onFinish:()=>void}> = ({item,onFinish}) => {
  const [editPost, seteditPost] = useState(false)
    return (
        <>
        <IonFab horizontal={`end`} vertical={`bottom`}>
            <IonFabButton>
                <IonIcon icon={gridOutline}></IonIcon>
            </IonFabButton>
            <IonFabList side={`start`}>
                <IonFabButton onClick={()=>seteditPost(true)} color={`secondary`}>
                    <IonIcon icon={pencil}></IonIcon>
                </IonFabButton>
            </IonFabList>
            <IonFabList side={`top`}>
                <IonFabButton>
                    <IonIcon icon={trashOutline}></IonIcon>
                </IonFabButton>
            </IonFabList>
        </IonFab>
    <EditClassifiedModal item={item} onDidDismiss={()=>seteditPost(false)} isOpen={editPost}></EditClassifiedModal>
        </>
    )
}


export default EditClassifiedFab




const EditClassifiedModal: React.FC<{onDidDismiss:()=>void,isOpen:boolean, item:classifiedItemInterface}> = ({onDidDismiss,isOpen,item}) => {
     const [loading, setloading] = useState(false)
     const [PhotoOptions, setPhotoOptions] = useState(false)
     const [category, setcategory] = useState(`${item.item_category}`)
     const [showImg, setshowImg] = useState<number>()
     const [images, setimages] = useState<string[]>([])
     const [features, setfeatures] = useState<string[]>(item.item_features)
     const [input, setinput]=useState({name:item.item_name,desc:item.item_desc,cost:item.item_cost})
     

     function editPost(e:any){
         e.preventDefault()

     }
     function deleteItem(index:number){

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
    return (
        <IonModal onDidDismiss={onDidDismiss} showBackdrop swipeToClose cssClass={`add-modal edit-modal`} mode={`ios`} isOpen={isOpen}>

        <IonHeader>
            <div className="header">
                {!loading&&<div className="bar"></div>}
                {loading&& <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
            </div>
        </IonHeader>
       
        <IonContent>
           
            <IonCardContent mode={`md`}>
                <IonToolbar className={`ion-padding`} >
                    <IonIcon color={`secondary`} size={`large`} slot={`start`} icon={shirtOutline} />
                    <IonCardTitle className={`ion-padding-start`}>EDIT CLASSIFIED </IonCardTitle>
                </IonToolbar >
                <IonCardContent>
                    <form onSubmit={editPost} action="">
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
                        {/* <div className="input">
                            <IonItem lines={`none`} color={`none`} onClick={() => { setPhotoOptions(true) }} button>
                                <IonIcon icon={cameraOutline}></IonIcon>
                                <IonLabel className={`ion-padding-start`}> add images of Item</IonLabel>
                            </IonItem>
                        </div> */}
                        <div className="input">
                            <IonInput onIonChange={e=>setinput({...input,name:(e.detail.value || ``)})} value={input.name} required name={`name`} placeholder={`Enter name of item`}></IonInput>
                        </div>
                        <div style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea value={input.desc} onIonChange={e=>setinput({...input,desc:(e.detail.value || ``)})} required name={`desc`} placeholder={`Enter Description of Item`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>category</IonLabel>
                                <IonSelect onIonChange={e=>setcategory(e.detail.value)} value={category} name={`category`} >
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
                            <IonInput value={input.cost} onIonChange={e=>setinput({...input,cost:(e.detail.value || ``)})} required name={`cost`} placeholder={`cost e.g $35`}></IonInput>
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
                                save changes</IonButton>
                        </IonToolbar>
                    </form>
                </IonCardContent>
            </IonCardContent>
            <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
        </IonContent>

    </IonModal>
    )
}
