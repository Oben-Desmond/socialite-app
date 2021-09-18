
import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCard, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonSpinner, IonTextarea, IonToolbar } from '@ionic/react';
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
import EditEventsFab from './EditEventsFab';
import { getRandomColor } from '../text formaters/getRandomColor';
import { Share } from '@capacitor/share';
import { sendCommentReaction, sendReactionNotificaton } from '../../Firebase/services/reaction-notifications';
import { selectUser } from '../../states/reducers/userReducers';


const EventsModal: React.FC<{ onDidDismiss: () => void, isOpen: boolean, post: PostInterface }> = function ({ isOpen, onDidDismiss, post }) {
    const [addcomment, setaddcomment] = useState(false)
    const [reactions, setreactions] = useState<reactionInterface | undefined>()
    const [viewProfile, setviewProfile] = useState(false)
    const [profile, setprofile] = useState<UserInterface>()
    const rootState: any = useSelector(state => state)
    const [commenttext, setcommenttext] = useState<string>(``)
    const user: UserInterface = useSelector(selectUser)
    const [comments, setcomments] = useState<commentInterface[]>([])
    const contentRef = useRef<HTMLIonContentElement>(null)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const commentTitle = `events`
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
    function getReactions() {
        fstore.collection(`posts/${countryInfo.name}/${commentTitle}-reactions`).doc(`${post.id}`).onSnapshot((res) => {
            const data: reactionInterface | any = res.data()
            if (data) {
                setreactions(data)
            }
        })
    }
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

        const commentObj: commentInterface = {
            author_name: user?.name,
            description: text,
            photoUrl: user?.photoUrl,
            subcomments: [],
            timestamp: Date.now(),
            id: Date.now() + user.email
        }
        console.log(commentObj)
        uploadCommentToFirebase(commentObj, commentTitle, countryInfo, post.id).then(() => {
            setcommenttext(``)
            commentItemRef.current?.scrollIntoView({ behavior: `smooth` })
            setaddcomment(false);

        }).catch(alert)

    }
    function getProfileInfo(email: string) {
        setviewProfile(true)

        if (email == post.email) {
            setprofile({ bio: ``, domain: ``, email: email, location: ``, name: post.author_name, photoUrl: post.author_url, tel: (user?.tel || ``), domainCode: `` })
        }
    }
    async function handleKeyBoard() {
        try {
            await Keyboard.addListener(`keyboardDidHide`, () => {
                setmoveInputUp(false)
            })
        } catch (err) {
            console.log(err)
        }
    }
    async function sharePost() {

        await Share.share({
            title: `check out post`,
            text: `Checkout post from Socialite app`,
            url: `https://socionet.co.za/events/${post.id}`,
            dialogTitle: 'Share with friends and Family',
        });
    }

    return (
        <IonModal cssClass={`story-modal`} onDidPresent={getReactions} onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonHeader>
                <IonToolbar style={{ paddingTop: `18px` }} color={`primary`} >
                    <IonButtons className={`ion-margin-end`} slot={`start`} >
                        <IonButton>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonLabel style={{ textTransform: `uppercase` }}>Events</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef} >
                <div className="background hero-img">
                    <img width={`100%`} src={post.images[0]}></img>
                </div>
                <IonToolbar className={`story-card`}>
                    <IonItem style={{ transform: !post.author_url ? `translate(0,10px)` : `auto` }} className={`author`} lines={`none`} color={`none`}>
                        {!!post.author_url && <IonAvatar slot={`start`}>
                            <img src={post.author_url} />
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
                <IonToolbar>
                    <IonSlides style={{ height: '200px' }} options={{ slidesPerView: 2 }}>
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
                        <div ref={commentItemRef}></div>
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
            {/* <FlipMove appearAnimation={'elevator'}> */}
            {user?.email == post.email && !addcomment && <EditEventsFab commentTitle={commentTitle} comments={comments} post={post} onEdit={() => { }} onDelete={() => { onDidDismiss(); }}></EditEventsFab>}
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


export default EventsModal




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
                        <IonTextarea onIonBlur={props.onBlur} autofocus ref={textAreaRef} rows={rows} value={text} onIonChange={handleChange} placeholder={`comment on this post `}></IonTextarea>
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
