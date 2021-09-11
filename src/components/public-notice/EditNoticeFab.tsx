
import React, { useContext, useRef, useState } from "react";

import { IonModal, IonHeader, IonContent, IonCardContent, IonCardTitle, IonItem, IonIcon, IonLabel, IonInput, IonTextarea, IonToolbar, IonSelect, IonSelectOption, IonButton, IonBackdrop, IonCardSubtitle, IonProgressBar, IonFabButton, IonFabList, IonFab } from "@ionic/react";
import { addOutline, gridOutline, images, pencil, removeCircleOutline, shirtOutline, trashOutline } from "ionicons/icons";
import { features } from "process";
import FlipMove from "react-flip-move";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import ImageSlide from "../image slides";
import PhotoOptionsModal, { photosFromCamera, photosFromGallery } from "../PhotoOptionsModal";
import "../../pages/style/Home.css"
import { useSelector } from "react-redux";
import { selectUser } from "../../states/reducers/userReducers";
import { selectCountry } from "../../states/reducers/countryReducer";
import { countryInfoInterface } from "../../interfaces/country";
import { UserInterface } from "../../interfaces/users";
import { Dialog } from "@capacitor/dialog";
import { Toast } from "@capacitor/toast";
import { fstore, storage } from "../../Firebase/Firebase";
import { commentInterface, PostInterface } from "../../interfaces/posts";

interface EditLocalFeedFabInterface {
    onDelete: () => void,
    onEdit: () => void
}

const EditNoticeFab: React.FC<{ post: PostInterface, comments: commentInterface[], onDelete: () => void, onEdit: () => void ,commentTitle:string}> = ({ post, onDelete, onEdit, comments,commentTitle }) => {
    const [editPost, seteditPost] = useState(false)
    async function deleteItem() {
        const res = await Dialog.confirm({ message: `Are you sure you want to delete this post ?`, title: `Delete Post`, okButtonTitle: `delete` })
        if (res.value) {
            onDelete()
            DeleteItemFromDB(post, comments, commentTitle).then(() => {
                Toast.show({ text: `Public notice deleted` })
            }).catch(err => alert(JSON.stringify(err)))
        }
    }
    return (
        <>
            <IonFab style={{ transform: `translateY(-70px)` }} horizontal={`end`} vertical={`bottom`}>
                <IonFabButton color={`secondary`}>
                    <IonIcon icon={gridOutline}></IonIcon>
                </IonFabButton>
                <IonFabList side={`start`}>
                    <IonFabButton onClick={() => { seteditPost(true) }} color={`secondary`}>
                        <IonIcon icon={pencil}></IonIcon>
                    </IonFabButton>
                </IonFabList>
                <IonFabList side={`top`}>
                    <IonFabButton onClick={() => { deleteItem() }}>
                        <IonIcon icon={trashOutline}></IonIcon>
                    </IonFabButton>
                </IonFabList>
            </IonFab>
            <EditNoticeModal commentTitle={commentTitle} post={post} onDidDismiss={() => seteditPost(false)} isOpen={editPost}></EditNoticeModal>
        </>
    )
}


export default EditNoticeFab




const EditNoticeModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean, post: PostInterface,commentTitle:string }> = ({ onDidDismiss, isOpen, post, commentTitle }) => {
    const [loading, setloading] = useState(false)
    const [PhotoOptions, setPhotoOptions] = useState(false)
    const [showImg, setshowImg] = useState<number>()
    const [images, setimages] = useState<string[]>(post.images)
    const [input, setinput] = useState({ title: post.title, description: post.description })
    const user: UserInterface = useSelector(selectUser)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const titleRef = useRef<HTMLDivElement>(null)
    const descRef = useRef<HTMLDivElement>(null)


    function editPost(e: any) {
        e.preventDefault()
        const { title, description } = input
        let data: any = { title, description }

        if (user.email) {
            setloading(true)
            if (countryInfo) {
                UpdatePost(data, post, countryInfo).then(() => {
                    Dialog.alert({ message: `post has been updated`, title: `sucessful` })
                    Toast.show({ text: `post has been updated` })
                    onDidDismiss()

                }).catch(alert).finally(() => {
                    setimages([])
                    setloading(false)
                    e.target.title.value = ``
                    e.target.description.value = ``


                })
            }
        }

    }
    function deleteItem(index: number) {

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
                    {!loading && <div className="bar"></div>}
                    {loading && <IonProgressBar color={`danger`} value={0.5} buffer={0.7}></IonProgressBar>}
                </div>
            </IonHeader>

            <IonContent>

                <IonCardContent mode={`md`}>
                    <IonToolbar className={`ion-padding`} >
                        <IonCardTitle color={`secondary`} className={`ion-padding-start`}>Edit Public Notice</IonCardTitle>
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
                            <div ref={titleRef} onClick={() => titleRef.current?.scrollIntoView({ behavior: `smooth` })} className="input">
                                <IonInput onIonChange={e => setinput({ ...input, title: (e.detail.value || ``) })} value={input.title} required name={`title`} placeholder={`Enter title of post`}></IonInput>
                            </div>
                            <div ref={descRef} onClick={() => descRef.current?.scrollIntoView({ behavior: `smooth` })} style={{ whiteSpace: `pre-wrap` }} className="input">
                                <IonTextarea autoGrow  value={input.description} onIonChange={e => setinput({ ...input, description: (e.detail.value || ``) })} required name={`description`} placeholder={`Enter post detail`}></IonTextarea>
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
                        <IonToolbar style={{height:`40px`}}></IonToolbar>

                            <IonToolbar className={`ion-padding-top`} style={{ textAlign: `center` }}>
                                <IonButton type={"submit"}>
                                    save changes</IonButton>
                            </IonToolbar>
                        </form>
                    </IonCardContent>
                    <IonToolbar style={{ height: `50px` }}></IonToolbar>
                </IonCardContent>
                <PhotoOptionsModal fromPhotos={galleryPhotos} fromCamera={takePicture} onDidDismiss={() => { setPhotoOptions(false) }} isOpen={PhotoOptions}></PhotoOptionsModal>
            </IonContent>



        </IonModal>
    )
}


function DeleteItemFromDB(post: PostInterface, comments: commentInterface[],commentTitle:string) {
    const query1 = fstore.collection(`posts/${post.location}/notice`).doc(post.id).delete()
    const query2 = fstore.collection(`posts/${post.location}/${commentTitle}-reactions`).doc(post.id).delete()
    const queryComments = comments.map(comment => fstore.collection(`posts/${post.location}/${commentTitle}-reactions`).doc(post.id).collection(`comments`).doc(comment.id).delete())
    post.images.map(imageUrl => storage.refFromURL(imageUrl).delete())
    const queryParam = [query1, query2, ...queryComments]
    return (Promise.all(queryParam))
}

function UpdatePost(data: { title: string, description: string }, post: PostInterface, countryInfo: countryInfoInterface) {

    return (new Promise(async (resolve, reject) => {
        const { title, description } = data
        const newPost: PostInterface = { ...post, ...data, location: countryInfo.name }

        fstore.collection(`posts/${post.location}/notice`).doc(post.id).set(newPost)
            .then(async () => {
                resolve(`successfull`)
            }).catch(reject)
    }))
}
