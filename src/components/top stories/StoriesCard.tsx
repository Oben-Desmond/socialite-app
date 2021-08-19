// @flow strict

import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonSpinner, IonTextarea, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Pictures } from '../../pages/images/images';
import "../styles/Cards.css";
import { Link } from 'react-router-dom';
import { arrowBack, chatboxOutline, close, closeCircle, closeCircleOutline, pencilOutline, sendSharp, shareSocialOutline, textSharp, thumbsDown, thumbsDownOutline, thumbsUp, thumbsUpOutline } from 'ionicons/icons';
import { commentInterface, PostInterface, reactionInterface } from '../../interfaces/posts';
import { ReadableDate } from '../text formaters/date-formater';
import ViewImage from '../view image';
import { fstore } from '../../Firebase/Firebase';
import { useSelector } from 'react-redux';
import { UserInterface } from '../../interfaces/users';
import FlipMove from 'react-flip-move';
import { uploadCommentToFirebase } from '../../Firebase/pages/story modal';
import ProfileModal from '../ProfileModal';
import LetteredAvatar from '../LetterAvatar';
import TimeAgo from '../timeago';


const StoriesCard: React.FC<{ post: PostInterface }> = function (props) {
    const { post } = props
    const [readmore, setreadmore] = useState<boolean>(false);
    const [loaded, setloaded] = useState<boolean>(false)

    return (
        <div onClick={() => setreadmore(true)} className={`stories-card`}>
            <div className="hero-img">
                <img src={post.images[0]} />
            </div>
            <IonLabel className={`news-caption`}>
                {post.title}
            </IonLabel>
            <p className={`description`}>
                {post.description.substr(0, 180)}...
            </p>
            <IonLabel color={`secondary`} className={`time-place`}> <IonLabel color={`primary`}><GetHoursAgo timestamp={post.timestamp}></GetHoursAgo>  |</IonLabel> {post.location}</IonLabel>
            <hr />
            <StoryModal title={`TOP STORIES`} post={post} onDidDismiss={() => setreadmore(false)} isOpen={readmore}></StoryModal>
        </div>
    );
};

export default StoriesCard;


export function GetHoursAgo(props: { timestamp: number }) {
    
    return (
        <TimeAgo timestamp={props.timestamp}/>
    )
}


export const StoryModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean, post: PostInterface, title: string }> = function ({ isOpen, onDidDismiss, post, title }) {
    const [addcomment, setaddcomment] = useState(false)
    const [reactions, setreactions] = useState<reactionInterface | undefined>()
    const [viewProfile, setviewProfile] = useState(false)
    const [profile, setprofile] = useState<UserInterface>()
    const rootState: any = useSelector(state => state)
    const [commenttext, setcommenttext] = useState<string>(``)
    const user: UserInterface | undefined = rootState.userReducer;
    const [comments, setcomments] = useState<commentInterface[]>([])
    const contentRef = useRef<HTMLIonContentElement>(null)

    useEffect(() => {
        const unsub = fstore.collection(`${title}-comment`).doc(`${post.id}`).collection(`comments`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const dataArray: commentInterface[] | undefined | any[] = res.docs.map(doc => doc.data())
            if (dataArray)
                setcomments(dataArray)
        })
        return (() => unsub())
    }, [])
    function getReactions() {
        fstore.collection(`reactions`).doc(`${post.id}`).onSnapshot((res) => {
            const data: reactionInterface | any = res.data()
            if (data) {
                setreactions(data)
            }
        })
    }
    function likePost() {
        let likes = reactions?.likes || []

        if (user?.email) {
            if (likes.indexOf(user.email) >= 0) {
                likes.splice(likes.indexOf(user.email), 1)
            }
            else {
                likes = [...likes, post.email]
            }
            fstore.collection(`reactions`).doc(`${post.id}`).set({ ...reactions, likes }).then(() => { console.log(`liked`) }).catch(console.log)
        }
    }
    function dislikePost() {
        let dislikes = reactions?.dislikes || []

        if (user?.email) {
            if (dislikes.indexOf(user.email) >= 0) {
                dislikes.splice(dislikes.indexOf(user.email), 1)
            }
            else {
                dislikes = [...dislikes, post.email]
            }
            fstore.collection(`reactions`).doc(`${post.id}`).set({ ...reactions, dislikes }).then(() => { console.log(`disliked`) }).catch(console.log)
        }
    }
    function updateComment(text: string) {
        if (!user?.email) return;

        const commentObj: commentInterface = {
            author_name: user?.name,
            description: text,
            photoUrl: user?.photoUrl,
            subcomments: [],
            timestamp: Date.now(),
            id: Date.now() + user.email
        }
        console.log(commentObj)
        uploadCommentToFirebase(commentObj, post.id, title).then(() => {
            setcommenttext(``)
            contentRef.current?.scrollToBottom()
        }).catch(alert)

    }
    function getProfileInfo(email: string) {
        setviewProfile(true)

        if (email == post.email) {
            setprofile({ bio: ``, domain: ``, email: email, location: ``, name: post.author_name, photoUrl: post.author_url, tel: (user?.tel || ``) })
        }
    }
    return (
        <IonModal cssClass={`story-modal`} onDidPresent={getReactions} onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonHeader>
                <IonToolbar color={`primary`} >
                    <IonButtons className={`ion-margin-end`} slot={`start`} >
                        <IonButton>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonLabel style={{ textTransform: `uppercase` }}>{title}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef} >
                <div className="background hero-img">
                    <img src={post.images[0]}></img>
                </div>
                <IonToolbar className={`story-card`}>
                    <IonItem className={`author`} lines={`none`} color={`none`}>
                        <IonAvatar slot={`start`}>
                            <img src={post.author_url} />
                        </IonAvatar>
                        <IonLabel onClick={() => getProfileInfo(post.email)}>
                            <Link to={`#`}>
                                {post.author_name} </Link></IonLabel>
                    </IonItem >
                    <IonButtons>
                        <IonLabel>
                            <IonNote className={`ion-margin-start`}><ReadableDate timestamp={post.timestamp} />  </IonNote>
                        </IonLabel>
                    </IonButtons>
                    <div >
                        <IonLabel className={`card-title`}>{post.title}
                        </IonLabel>
                    </div>
                    <p style={{ whiteSpace: `pre-line` }}> {post.description}</p>
                </IonToolbar>
                <IonToolbar>
                    <IonSlides options={{ slidesPerView: 2 }}>
                        {post.images.map((img, index) => {
                            return <IonSlide key={index}>
                                <ViewImage img={img}></ViewImage>
                            </IonSlide>
                        })}
                    </IonSlides>
                </IonToolbar>
                <IonToolbar className={`rating`}>
                    <IonGrid>
                        <IonRow style={{ textAlign: `center` }}>
                            <IonCol>
                                <IonButton onClick={likePost} fill={`clear`}>
                                    <LikeIcon user={user} likes={(reactions?.likes || [])} ></LikeIcon>
                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton onClick={dislikePost} fill={`clear`}>
                                    <DisLikeIcon user={user} dislikes={(reactions?.dislikes || [])} ></DisLikeIcon>
                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton fill={`clear`}>
                                    <IonIcon icon={shareSocialOutline} />
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow style={{ textAlign: `center` }}>
                            <IonCol>
                                <IonLabel >
                                    {reactions?.likes?.length || 0}
                                </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonLabel >
                                    {reactions?.dislikes?.length || 0}
                                </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonLabel >
                                    {reactions?.shares?.length || 0}
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonToolbar className={`ion-padding-horizontal`} color={`light`}>comments ({comments.length})</IonToolbar>
                    <IonGrid>
                        {/* <Comment></Comment>
                        <div style={{ marginLeft: `40px` }}> <Comment></Comment></div>
                        <Comment></Comment>
                        <Comment></Comment> */}

                        <FlipMove  >
                            {comments.map((comment, index) => {
                                return <Comment key={comment.id} comment={comment}></Comment>
                            })
                            }
                        </FlipMove>
                    </IonGrid>
                </IonToolbar>
                <IonToolbar className={`ion-padding`}>

                </IonToolbar>
            </IonContent>
            <FlipMove appearAnimation={'elevator'}>
                {user?.email == post.email && !addcomment && <IonFab className={`edit-fab`} onClick={() => { }} vertical={`bottom`} horizontal={`end`}>
                    <IonFabButton color={`secondary`}>
                        <IonIcon icon={pencilOutline} />
                    </IonFabButton>
                </IonFab>}
            </FlipMove>
            <FlipMove >
                {!addcomment && user?.email && <IonFab onClick={() => setaddcomment(true)} vertical={`bottom`} horizontal={`end`}>
                    <IonFabButton>
                        <IonIcon icon={chatboxOutline} />
                    </IonFabButton>
                </IonFab>}
            </FlipMove >
            <IonFab horizontal={`start`} vertical={`bottom`}>
                <FlipMove >
                    {addcomment && <div className={`comment-footer`}>
                        <CommentTextField sendComent={(text => { updateComment(text) })} text={commenttext} settext={setcommenttext} closeComment={() => setaddcomment(false)}></CommentTextField>
                    </div>}</FlipMove>
            </IonFab>
            <ProfileModal profile={profile} onDidDismiss={() => setviewProfile(false)} isOpen={viewProfile}></ProfileModal>
        </IonModal>
    );
};

function CommentTextField(props: { closeComment: () => void, text: string, settext: (val: string) => void, sendComent: (text: string) => void }) {


    const { closeComment, text, settext, sendComent } = props
    const [rows, setrows] = useState(2)
    const textAreaRef = useRef<HTMLIonTextareaElement>(null)
    const [loading, setloading] = useState(false)

    function handleChange(e: any) {
        const words = e.detail.value
        settext(words || ``)
        if (words?.length < 30) {
            setrows(2)
        }
        else if (text.length < 60) {
            setrows(4)
        }
        else if (text.length < 120) {

            setrows(5)
        }
        else {
            setrows(6)
        }
    }
    useEffect(() => {
        // alert(`hey`)
        if (loading && text == ``) {
            setloading(false)
        }
    }, [text])

    return <IonToolbar className={`comment-field`} >

        <IonGrid>
            <IonRow>
                <IonCol size={`9`}>
                    <IonToolbar color={`primary`}>
                        <IonButton color={`light`} fill={`clear`} size={`small`} onClick={closeComment} style={{}} slot={`start`} shape={`round`}>
                            <IonIcon icon={closeCircleOutline} />
                        </IonButton>
                        <IonTextarea autofocus ref={textAreaRef} rows={rows} value={text} onIonChange={handleChange} placeholder={`comment on this post `}></IonTextarea>
                    </IonToolbar>
                </IonCol>
                <IonCol>
                    <IonFabButton color={`secondary`} onClick={() => { sendComent(text); setloading(true) }}>
                        {(loading && text != ``) ? <IonSpinner></IonSpinner> : <IonIcon icon={sendSharp} />}
                    </IonFabButton>
                </IonCol>
            </IonRow>
        </IonGrid>

    </IonToolbar>
}

function LikeIcon(props: { user: UserInterface | undefined, likes: string[] }) {
    const { user, likes } = props
    let icon = thumbsUpOutline
    if (user?.email)
        if (likes.indexOf(user.email) >= 0) {
            icon = thumbsUp
        }
    return (
        <IonIcon icon={icon} />
    )
}

function DisLikeIcon(props: { user: UserInterface | undefined, dislikes: string[] }) {
    const { user, dislikes } = props
    let icon = thumbsDownOutline
    if (user?.email)
        if (dislikes.indexOf(user.email) >= 0) {
            icon = thumbsDown
        }
    return (
        <IonIcon icon={icon} />
    )
}

function ViewIcon(props: { user: UserInterface | undefined, dislikes: string[] }) {
    const { user, dislikes } = props
    let icon = thumbsDownOutline
    if (user?.email)
        if (dislikes.indexOf(user.email) >= 0) {
            icon = thumbsDown
        }
    return (
        <IonIcon icon={icon} />
    )
}


function Comment(props: { comment: commentInterface }) {
    const { comment } = props
    const [reply, setreply] = useState(false)
    const colors = [`primary`, `secondary`, `danger`, `success`, `warning`, `tertiary`, `dark`, `medium`]
    const alpha = `abcdefghijklmnopqrstuvwxyz`;
    const [randomColor] = useState(colors[getColorIndex(comment.author_name)])

    function getColorIndex(name: string) {
        let num = 0
        if (!name) return num;

        const index = alpha.indexOf(name[0].toLowerCase())
        num = index >= 0 ? index : 0;

        return num % colors.length
    }
    return (
        <IonRow className={`comment`}>
            <IonCol>
                <IonRow>
                    <IonCol size={`3`}>
                        {comment.photoUrl && <IonAvatar style={{ maxHeight: `50px` }}>
                            <img src={comment.photoUrl} ></img>
                        </IonAvatar>}

                        {
                            !comment.photoUrl && comment.author_name && <IonButtons >
                                <LetteredAvatar size={50} backgroundColor={`var(--ion-color-${randomColor})`} name={comment.author_name} />
                            </IonButtons>

                        }
                    </IonCol>
                    <IonCol>
                        <label>{comment.author_name}</label><br />
                        <IonLabel> <ReadableDate timestamp={comment.timestamp} /> </IonLabel>
                    </IonCol>
                    {/* <IonCol>
                        <IonButton onClick={() => setreply(true)} fill={`outline`} size={`small`} >
                            REPLY
             </IonButton>
                    </IonCol> */}

                </IonRow>
                <IonItem>
                    <p>
                        {comment.description}    </p>
                </IonItem>
            </IonCol>
            { reply && <IonFooter>
                <IonToolbar color={`primary`}>
                    <IonItem color={`none`}>
                        <IonInput placeholder={`send reply `}></IonInput>
                        <IonButtons onClick={() => setreply(false)} slot={`end`}>
                            <IonIcon size={`large`} icon={sendSharp} />
                        </IonButtons>
                    </IonItem>
                </IonToolbar>
            </IonFooter>}
        </IonRow>
    )
}
