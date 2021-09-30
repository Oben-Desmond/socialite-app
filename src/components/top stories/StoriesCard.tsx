// @flow strict

import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCard, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonNote, IonRippleEffect, IonRow, IonSlide, IonSlides, IonSpinner, IonTextarea, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Pictures } from '../../pages/images/images';
import "../styles/Cards.css";
import { Link } from 'react-router-dom';
import { arrowBack, chatboxOutline, close, closeCircle, closeCircleOutline, gridOutline, pencil, pencilOutline, sendSharp, shareSocialOutline, textSharp, thumbsDown, thumbsDownOutline, thumbsUp, thumbsUpOutline, trashOutline } from 'ionicons/icons';
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
import { selectCountry } from '../../states/reducers/countryReducer';
import { countryInfoInterface } from '../../interfaces/country';
import { Keyboard } from '@capacitor/keyboard';
import EditLocalFeedFab from './EditLocalFeedTab';
import { Share } from '@capacitor/share';
import { selectUser } from '../../states/reducers/userReducers';
import { sendNotification } from '../../Firebase/services/notifications';
import { sendReactionNotificaton, sendCommentReaction } from '../../Firebase/services/reaction-notifications';
import { InAppNotification } from '../../interfaces/notifications';
import * as uuid from "uuid";
import { sendInAppNotification } from '../../Firebase/pages/inAppNotifications';

const StoriesCard: React.FC<{ post: PostInterface }> = function (props) {
    const { post } = props
    const [readmore, setreadmore] = useState<boolean>(false);
    const [liked, setliked] = useState(false);
    const [postLikes, setpostLikes] = useState(post.likes);
    const [postDislikes, setpostDislikes] = useState(post.dislikes);
    const [disliked, setdisliked] = useState(false);
    const user: UserInterface = useSelector(selectUser);

    useEffect(() => {
        if ((post.likes || []).filter(email => (email == user.email)).length > 0) {
            setliked(true)
        }
        else {
            setliked(false)
        }
        if ((post.dislikes || []).filter(email => (email == user.email)).length > 0) {
            setdisliked(true)
        }
        else {
            setdisliked(false)
        }
    }, [])
    function likePost() {
        let newPostLikes = [...(post.likes || []), user.email]
        sendReactionNotificaton('', user, post);

        if (liked) {
            newPostLikes = [...(post.likes || []).filter(email => !(email == user.email))];

        }
        newPostLikes = newPostLikes.filter((email, index) => (!newPostLikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ likes: newPostLikes });
        setpostLikes(newPostLikes);
        setliked(!liked);
    }
    function disLikePost() {
        let newpostDislikes = [...(post.dislikes || []), user.email]
        if (!disliked) {
            newpostDislikes = [...(post.dislikes || []).filter(email => !(email == user.email))];

        }
        newpostDislikes = newpostDislikes.filter((email, index) => (!newpostDislikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ dislikes: newpostDislikes });
        setpostDislikes(newpostDislikes);
        setdisliked(!disliked);
    }
    return (
        <div className={`stories-card comfortaa`}>
            <IonList>
                <div onClick={() => setreadmore(true)} className="hero-img">
                    <img src={post.images[0]} />
                </div>
                <IonFab vertical='bottom' horizontal='start' style={{ height: '20%', width: '140%', transform: 'translate(-20px,0)', background: '#000', opacity: 0.7 }} >
                    <div style={{ width: '100%', height: '100%', }} >

                    </div>
                </IonFab>
                {/* <IonFab vertical='bottom' horizontal='end' style={{ height: '20%', width: '50%', transform: 'translate(20px,0)' }} >
                    <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom right, #0000003f, #00000035, #000000a1, #0000007c, #000000)' }}></div>
                </IonFab> */}


                <IonFab style={{ width: '120%' }} horizontal='start' vertical='bottom'>

                    <IonItem color='none' lines='none' >
                        {(post.author_url || (user.photoUrl && user.email == post.email)) ? <IonAvatar>
                            <IonImg src={post.author_url || user.photoUrl} />
                        </IonAvatar> : <LetteredAvatar name={post.author_name} size={40} ></LetteredAvatar>}

                        <div style={{ margin: '0 25px 0 15px' }}  >
                            <IonLabel className='comfortaa' color='light'>
                                {post.author_name}
                            </IonLabel>
                        </div>

                        <IonButtons  >
                            <IonButton onClick={() => { likePost() }} color={`light`}>
                                <IonIcon slot='start' color={!liked ? 'light' : 'secondary'} icon={!liked ? thumbsUpOutline : thumbsUp}></IonIcon>
                                <IonLabel>
                                    {
                                        postLikes?.length
                                    }
                                </IonLabel>
                            </IonButton>
                            <IonButton onClick={() => { disLikePost() }} color={`light`}>
                                <IonIcon slot='start' color={!disliked ? 'light' : 'secondary'} icon={thumbsDownOutline}></IonIcon>
                                <IonLabel>
                                    {
                                        postDislikes?.length
                                    }
                                </IonLabel>
                            </IonButton>
                        </IonButtons>

                    </IonItem>
                </IonFab>
            </IonList>
            <div className="ion-activatable ripple-parent" onClick={() => setreadmore(true)}>
                <IonLabel className={`news-caption`}>
                    {post.title}
                </IonLabel>
                <p className={`description`}>
                    {post.description.substr(0, 180)}...

            <IonButtons style={{ marginTop: '5px' }}>
                        <IonLabel color={`secondary`} className={`time-place`}> <IonLabel color={`primary`}><GetHoursAgo timestamp={post.timestamp}></GetHoursAgo> </IonLabel> {post.location}</IonLabel>
                    </IonButtons>
                    <hr />
                </p>
                <IonRippleEffect />
            </div>
            <StoryModal title={`Local Feed`} post={post} onDidDismiss={() => setreadmore(false)} isOpen={readmore}></StoryModal>
        </div>
    );
};

export default StoriesCard;


export function GetHoursAgo(props: { timestamp: number }) {

    return (
        <TimeAgo timestamp={props.timestamp} />
    )
}


export const StoryModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean, post: PostInterface, title: string }> = function ({ isOpen, onDidDismiss, post, title }) {
    const [addcomment, setaddcomment] = useState(false)
    const [viewProfile, setviewProfile] = useState(false)
    const [profile, setprofile] = useState<UserInterface>()
    const [commenttext, setcommenttext] = useState<string>(``)
    const user: UserInterface = useSelector(selectUser);
    const [comments, setcomments] = useState<commentInterface[]>([])
    const contentRef = useRef<HTMLIonContentElement>(null)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const commentTitle = title.replace(` `, ``).trim()
    const [moveInputUp, setmoveInputUp] = useState(false)
    const commentItemRef = useRef<HTMLDivElement>(null)
    const [liked, setliked] = useState(false);
    const [postLikes, setpostLikes] = useState(post.likes);
    const [postDislikes, setpostDislikes] = useState(post.dislikes);
    const [disliked, setdisliked] = useState(false);


    useEffect(() => {
        const unsub = fstore.collection(`posts/${countryInfo.name || `South Africa`}/${commentTitle}-reactions`).doc(`${post.id}`).collection(`comments`).orderBy(`timestamp`, `asc`).onSnapshot((res) => {
            const dataArray: commentInterface[] | undefined | any[] = res.docs.map(doc => doc.data())
            if (dataArray)
                setcomments(dataArray)
        })
        handleKeyBoard()
        return (() => unsub())
    }, [])

    useEffect(() => {
        if ((post.likes || []).filter(email => (email == user.email)).length > 0) {
            setliked(true)
        }
        else {
            setliked(false)
        }
        if ((post.dislikes || []).filter(email => (email == user.email)).length > 0) {
            setdisliked(true)
        }
        else {
            setdisliked(false)
        }
    }, [])
    function likePost() {
        let newPostLikes = [...(post.likes || []), user.email]
        if (liked) {
            newPostLikes = [...(post.likes || []).filter(email => !(email == user.email))];

        }
        sendReactionNotificaton('', user, post);

        newPostLikes = newPostLikes.filter((email, index) => (!newPostLikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ likes: newPostLikes });
        setpostLikes(newPostLikes);
        setliked(!liked);
    }
    function disLikePost() {
        let newpostDislikes = [...(post.dislikes || []), user.email]
        if (!disliked) {
            newpostDislikes = [...(post.dislikes || []).filter(email => !(email == user.email))];

        }
        newpostDislikes = newpostDislikes.filter((email, index) => (!newpostDislikes.includes(email, index + 1)))
        fstore.collection(`posts/${post.location}/feed`).doc(post.id).update({ dislikes: newpostDislikes });
        setpostDislikes(newpostDislikes);
        setdisliked(!disliked);
    }


    function updateComment(text: string) {
        if (!user?.email || !user) return;


        sendCommentReaction(text, user, post);
        const id= Date.now()+ uuid.v4().substr(0.6) ;
        const commentObj: commentInterface = {
            author_name: user?.name,
            description: text,
            photoUrl: user?.photoUrl,
            subcomments: [],
            timestamp: Date.now(),
            id
        }
        console.log(commentObj)
        const commentTitle = title.replace(` `, ``).trim()
        uploadCommentToFirebase(commentObj, commentTitle, countryInfo, post.id).then(() => {
            setcommenttext(``)
            commentItemRef.current?.scrollIntoView({ behavior: `smooth` })

        }).catch(alert)

        const inAppInfo:InAppNotification={
           category:'feed',
           id,
           message:text,
           path:`http://socionet.co.za/feed/${post.id}`,
           post_id:post.id,
           post_title:post.title,
           sender:user.email,
           sender_name:user.name,
           sender_photo:user.photoUrl,
           timestamp:Date.now(),
           type:'comment'

        }
        sendInAppNotification({country:countryInfo.name, notification:inAppInfo,reciever:post.email})

    }
    function getProfileInfo(email: string) {
        setviewProfile(true)

        if (email == post.email) {
            setprofile({ bio: ``, domain: ``, email: email, location: ``, name: post.author_name, photoUrl: post.author_url, tel: (user?.tel || ``), domainCode: undefined })
        }
    }
    function handleKeyBoard() {
        try {
            Keyboard.addListener(`keyboardDidHide`, () => {
                setmoveInputUp(false)
            }).catch(console.log)
        } catch (err) {
            console.log(err)
        }
    }

    const sharePost = () => {
        Share.share({ dialogTitle: `share post with friends`, url: `https://socionet.co.za/feed/${post.id}` })
    }

    return (
        <IonModal cssClass={`story-modal`} onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonHeader>
                <IonToolbar style={{ paddingTop: `18px` }} color={`primary`} >
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
                <div className="background  k hero-img">
                    <img style={{maxHeight:`40vh`,objectFit:`cover`}} width={`100%`} src={post.images[0]}></img>
                </div>
                <IonToolbar className={`story-card`}>
                    <IonItem style={{ transform: !post.author_url ? `translate(0,10px)` : `auto` }} className={`author`} lines={`none`} color={`none`}>
                        {!!post.author_url && <IonAvatar slot={`start`}>
                            <img style={{maxHeight:`30vh`}} src={post.author_url} />
                        </IonAvatar>}
                        {
                            !post.author_url && post.author_name && <IonButtons slot={`start`}  >
                                <LetteredAvatar size={50} backgroundColor={`var(--ion-color-secondary)`} name={post.author_name.split(` `)[0]} />
                            </IonButtons>

                        }
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
                <IonToolbar style={{ height: '200px' }}>
                    <IonSlides options={{ slidesPerView: 2 }}>
                        {post.images.map((img, index) => {

                            return <IonSlide key={index}>
                                <ViewImage img={img}></ViewImage>
                            </IonSlide>
                        })}
                        {
                            post.images.length == 1 && <IonSlide>
                                <div style={{ width: '100px' }} ></div>
                            </IonSlide>
                        }
                    </IonSlides>
                </IonToolbar>
                <IonToolbar className={`rating`}>
                    <IonGrid>
                        <IonRow style={{ textAlign: `center` }}>
                            <IonCol>
                                <IonButton onClick={likePost} fill={`clear`}>
                                    <IonIcon slot='start' color={!liked ? 'primary' : 'secondary'} icon={!liked ? thumbsUpOutline : thumbsUp}></IonIcon>

                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton fill={`clear`} onClick={() => { disLikePost() }} color={`primary`}>
                                    <IonIcon slot='start' color={!disliked ? 'primary' : 'secondary'} icon={thumbsDownOutline}></IonIcon>

                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton onClick={sharePost} fill={`clear`}>
                                    <IonIcon icon={shareSocialOutline} />
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow style={{ textAlign: `center` }}>
                            <IonCol>
                                <IonLabel>
                                    {
                                        postLikes?.length
                                    }
                                </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    {
                                        postDislikes?.length
                                    }
                                </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonLabel >
                                    share
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
                            {comments.map((comment) => {
                                return <Comment key={comment.id} comment={comment}></Comment>
                            })
                            }
                        </FlipMove>
                        <div ref={commentItemRef}></div>

                    </IonGrid>
                </IonToolbar>
                <IonToolbar className={`ion-padding`}>

                </IonToolbar>

            </IonContent>
            {/* <FlipMove appearAnimation={'elevator'}> */}
            {user?.email == post.email && !addcomment && <EditLocalFeedFab comments={comments} post={post} onEdit={() => { }} onDelete={() => { onDidDismiss(); }}></EditLocalFeedFab>}
            {/* </FlipMove> */}
            <FlipMove >
                {!addcomment && user?.email && <IonFab onClick={() => setaddcomment(true)} vertical={`bottom`} horizontal={`end`}>
                    <IonFabButton>
                        <IonIcon icon={chatboxOutline} />
                    </IonFabButton>
                </IonFab>}
            </FlipMove >
            <IonFab onClick={() => setmoveInputUp(true)} style={{ transform: moveInputUp ? `translateY(-40vh)` : `translateY(0vh)`, transition: `0.5s` }} horizontal={`start`} vertical={`bottom`}>
                <FlipMove >
                    {addcomment && <div className={`comment-footer`}>
                        <CommentTextField onBlur={() => setmoveInputUp(false)} sendComent={(text => { updateComment(text) })} text={commenttext} settext={setcommenttext} closeComment={() => setaddcomment(false)}></CommentTextField>
                    </div>}</FlipMove>
            </IonFab>
            <ProfileModal profile={profile} onDidDismiss={() => setviewProfile(false)} isOpen={viewProfile}></ProfileModal>
        </IonModal>
    );
};

function CommentTextField(props: { closeComment: () => void, text: string, settext: (val: string) => void, sendComent: (text: string) => void, onBlur: () => void }) {


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
                        <IonTextarea onIonBlur={props.onBlur} autofocus={true} ref={textAreaRef} rows={rows} value={text} onIonChange={handleChange} placeholder={`comment on this post `}></IonTextarea>
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
                        {comment.photoUrl && <IonAvatar style={{ height: `50px`, width: '50px' }}>
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
