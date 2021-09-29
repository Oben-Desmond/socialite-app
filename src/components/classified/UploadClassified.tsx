
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonModal, IonHeader, IonContent, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonThumbnail, IonImg, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonLoading, IonCardSubtitle, IonProgressBar, IonGrid, IonCol, IonRow } from "@ionic/react";
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
import { Dialog } from "@capacitor/dialog";
import { selectLocation } from "../../states/reducers/location-reducer";
import { maincategories, subcategories } from "./categories-data";



const UploadClassified: React.FC<{ onDidDismiss: () => void, isOpen: boolean }> = ({ onDidDismiss, isOpen }) => {

    const rootState: StoreStateInteface | any = useSelector(state => state)
    const dropRef = useRef<HTMLIonBackdropElement>(null)
    const user: UserInterface = rootState.userReducer;
    const countryInfo: countryInfoInterface = rootState.countryReducer
    const [images, setimages] = useState<any[]>([]);
    const [features, setfeatures] = useState<string[]>([])
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [category, setcategory] = useState(``)
    const [currency, setcurrency] = useState(countryInfo.country == `CM` ? `FCFA` : countryInfo.country == `SA` ? `R` : `$`)
    const [newcategory, setnewcategory] = useState(``)
    const [subcategory, setsubcategory] = useState(``)
    const [selectedTab, setselectedTab] = useContext(SelectedTabContext)
    const location: { long: number, lat: number } = useSelector(selectLocation)
    const nameRef = useRef<HTMLDivElement>(null), descRef = useRef<HTMLDivElement>(null), costRef = useRef<HTMLDivElement>(null), otherRef = useRef<HTMLDivElement>(null);

    const [loading, setloading] = useState(false)
    const [showImg, setshowImg] = useState<number | undefined>()
    const addPost = function (e: any) {
        e.preventDefault()
        let { name, desc, category, cost } = e.target
        let data: any = { name, desc, category, cost, }

        if(images.length<=0){
             Dialog.alert({message:`Please add an image so people can clearly understand what the classified is about`,title:`Image is Missen`})
             setPhotoOptions(true)
             return ;
        }

        Object.keys(data).map(key => {
            if (data[key]) {
                return data[key] = data[key].value
            }
        })
        data = { ...data, category: data.category == `other` ? newcategory : data.category || `other`, cost: getcostwithCurrency(data.cost), subcategory:subcategory||`other` }

        function getcostwithCurrency(cost: number) {
            if (currency == `XFA` || currency == `FCFA`) {
                return cost + ` ` + currency
            }
            return currency + cost;
        }


        if (user.email) {
            setloading(true)
            UploadClassifiedItem(data, images, user, countryInfo, features, location).then(() => {
                Toast.show({ text: `post has been sent`, position:`center`})
                onDidDismiss()
                setselectedTab({cat:data.category, subcat:subcategory})
                fetch(`https://socialiteapp-backend.herokuapp.com/classified/upload-mail?email=${user.email}&name=${user.name}`, { mode: `cors` }).catch(console.log).finally(console.log)
                setimages([])
                e.target.name.value = ``
                e.target.desc.value = ``
                e.target.category.value = ``
                e.target.cost.value = ``
            }).catch(alert).finally(() => {
                setloading(false)
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
                {!loading && <div className="bar"></div>}
                {loading && <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
            </div>
        </IonHeader>

        <IonContent>

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
                        <div onClick={() => nameRef.current?.scrollIntoView({ behavior: `smooth` })} ref={nameRef} className="input">
                            <IonInput required name={`name`} placeholder={`Enter name of item`}></IonInput>
                        </div>
                        <div onClick={() => descRef.current?.scrollIntoView({ behavior: `smooth` })} ref={descRef} style={{ whiteSpace: `pre-wrap` }} className="input">
                            <IonTextarea   rows={4}   required name={`desc`} placeholder={`Enter Description of Item`}></IonTextarea>
                        </div>
                        <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>category</IonLabel>
                                <IonSelect interface="action-sheet" onIonChange={(e) => setcategory(e.detail.value)} value={category} name={`category`} >

                                    {
                                        [...maincategories,{name:`other`,url:``}].map(data => {
                                            return (
                                                <IonSelectOption key={data.name} value={data.name}>{data.name}</IonSelectOption>
                                            )
                                        })
                                    }
                                </IonSelect>
                            </IonItem >
                        </div>
                      {category && category!=`other`  && category.length>1&& <div className={`input`}>
                            <IonItem lines={`none`} color={`none`}>
                                <IonLabel color={`secondary`}>sub category</IonLabel>
                                <IonSelect onIonChange={(e) => setsubcategory(e.detail.value)} value={subcategory} name={`subcategory`} >

                                    {
                                        (subcategories[category] || []).map((data:string) => {
                                            return (
                                                <IonSelectOption key={data} value={data}>{data}</IonSelectOption>
                                            )
                                        })
                                    }
                                </IonSelect>
                            </IonItem >
                        </div>}
                        {category == `other` && <div onClick={() => otherRef.current?.scrollIntoView({ behavior: `smooth` })} ref={otherRef} className="input">
                            <IonInput onIonChange={e => setnewcategory(e.detail.value || ``)} value={newcategory} required name={`other`} placeholder={`Give  the category of this classified`}></IonInput>
                        </div>}

                        <IonGrid>
                            <IonRow>
                                <IonCol >
                                    <div ref={costRef} onClick={() => costRef.current?.scrollIntoView({ behavior: `smooth` })} className="input">
                                        <IonInput type={`number`} required name={`cost`} placeholder={`cost e.g 350`}></IonInput>
                                    </div>
                                </IonCol>
                                <IonCol size={`5`}>
                                    <div className="input">
                                        <IonItem lines={`none`} color={`none`}>
                                            <IonSelect onIonChange={e => setcurrency(e.detail.value)} value={currency} name={`currency`} >
                                                <IonSelectOption value={`R`}>R</IonSelectOption>
                                                <IonSelectOption value={`XFA`}>XFA</IonSelectOption>
                                                <IonSelectOption value={`FCFA`}>FCFA</IonSelectOption>
                                                <IonSelectOption value={`$`}>$</IonSelectOption>
                                                <IonSelectOption value={`¥`}>¥</IonSelectOption>
                                                <IonSelectOption value={`₹`}>₹</IonSelectOption>
                                                <IonSelectOption value={`﷼`}>﷼</IonSelectOption>
                                                <IonSelectOption value={`€`}>€</IonSelectOption>
                                                <IonSelectOption value={`£`}>£</IonSelectOption>
                                                <IonSelectOption value={`₩`}>₩</IonSelectOption>
                                                {/* <IonSelectOption value={`politics`}>Politics</IonSelectOption>
                                    <IonSelectOption value={`religion`}>Religion</IonSelectOption>
                                    <IonSelectOption value={`science`}>Science</IonSelectOption> */}
                                            </IonSelect>
                                        </IonItem >
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
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
                <IonToolbar style={{ height: `50vh` }}></IonToolbar>
            </IonCardContent>
            {false && <div >
                <IonBackdrop ref={dropRef}></IonBackdrop>
            </div>}
            <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
        </IonContent>

    </IonModal>
}



export default UploadClassified