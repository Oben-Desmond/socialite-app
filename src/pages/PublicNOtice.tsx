import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonLabel, IonPage, IonToolbar, IonGrid, IonRow, IonThumbnail, IonImg, IonCol, IonItem, useIonViewDidEnter, useIonViewDidLeave, IonIcon, IonNote, IonFab, IonFabButton, IonCardSubtitle, IonRefresher, IonRefresherContent, IonPopover, IonCardContent, IonInput, IonBackdrop, IonSpinner } from '@ionic/react';
import { add, code, sunnyOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { interpreteCode } from '../components/Menu';
import PageHeader from '../components/PageHeader';
import AddNoticeModal from '../components/public-notice/AddNoticeModal';
import { fetchNoticeById } from '../components/public-notice/firebase-functions';
import PublicNoticeModal from '../components/public-notice/PublicNoticeModal';
import { accountInterface } from '../components/service/serviceTypes';
import SkeletonHome from '../components/top stories/dummy';
import { GetHoursAgo, StoryModal } from '../components/top stories/StoriesCard';
import { fstore } from '../Firebase/Firebase';
import { countryInfoInterface } from '../interfaces/country';
import { PostInterface } from '../interfaces/posts';
import { UserInterface } from '../interfaces/users';
import { selectCountry } from '../states/reducers/countryReducer';
import { getServiceAccount, selectServiceAccount, update_account } from '../states/reducers/service-reducer';
import { selectUser } from '../states/reducers/userReducers';
import { getCountry, setServiceAccount } from '../states/storage/storage-getters';
import { Pictures } from './images/images';


const PublicNotice: React.FC = function () {

    const [addNotice, setaddNotice] = useState(false)
    const [loaded, setloaded] = useState(false)
    const [notices, setnotices] = useState<PostInterface[]>([])
    const countryinfo: countryInfoInterface = useSelector(selectCountry)
    const [noData, setnoData] = useState(false)
    const params: { postid: string } = useParams()
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const serviceAccount: accountInterface = useSelector(selectServiceAccount);
    const user: UserInterface = useSelector(selectUser);
    const [showAddOption, setshowAddOption] = useState(false)
    const [showCodeEntryPopover, setshowCodeEntryPopover] = useState(false)
    const [codeData, setcodeData] = useState('')
    const [loading, setloading] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        initializeLocalServiceAccount()
    }, [ ])

    async function initializeLocalServiceAccount(){
        const acc:accountInterface|undefined=await getServiceAccount()
        console.log(acc,`---- the account ---`)
        if(acc){
            dispatch(update_account(acc))
        }
    }

    useEffect(() => {
        if (params.postid == `default` || !params.postid) {
            if (countryinfo && !loaded) {
                getNotice(() => { });
            }
            setloaded(true);
            return;
        }
        setTimeout(() => {
            getPost(params.postid)

        }, 1200);
       
    }, [params])
    async function getPost(postid: string) {
        setnotices([])

        let country = countryinfo.name || (await getCountry())?.name || 'South Africa';


        fetchNoticeById(postid, countryinfo.name, (post: PostInterface) => {

            setnotices([])
            setnotices([post])
            if ([post].length <= 0) {
                setnoData(true)
            }
        }, () => {
            setnoData(true)
        })
    }

    useEffect(() => {
        console.log(`fetching...`)
        if (!loaded) {
            setloaded(true);
            return;
        }
        if (countryinfo) {
            getNotice(() => { })
        }

    }, [countryinfo])

    useEffect(() => {
        if (serviceAccount.code) {
            if (serviceAccount.type == `municipal`) {
                setshowAddOption(true)
            }
        }
    }, [serviceAccount])

    function getNotice(callback: () => void) {
        const country_name = countryinfo.name || `South Africa`
        setnoData(false)
        fstore.collection(`posts/${country_name}/notice`).orderBy(`timestamp`, `desc`).onSnapshot((res) => {
            const data: any[] = res.docs.map(doc => {
                return doc.data()
            })
            if (data.length <= 0) {
                setnoData(true)
            }
            console.log(data)
            setnotices([...data])
            callback()
        })
    }
    async function submitCode(e: any) {
        e.preventDefault();
        setloading(true)
        let country = countryinfo.name || (await getCountry())?.name || 'South Africa';

        try {
            let account: accountInterface  = await interpreteCode(codeData, country, user)
            if (account.code && account.type==`municipal`) {
                dispatch(update_account(account))
                setServiceAccount(account)
                setshowAddOption(true)
                setaddNotice(true)
                setshowCodeEntryPopover(false)
            }
            else{
                Dialog.alert({ title: `Auth Error`, message:  `Sorry but no municipal account exists with that code` })
            }
            // history.push(`/service/${account.type}`)
        }
        catch (err) {
            Dialog.alert({ title: `Auth Error`, message: err.message || err || `unexpected error occurred` })
        }
        setloading(false)
    }
    return (
        <IonPage>
            <PageHeader></PageHeader>
            <IonContent>
                <IonRefresher ref={refresherRef} onIonRefresh={() => getNotice(() => refresherRef.current?.complete())} slot={`fixed`}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {notices.length <= 0 && !noData && <SkeletonHome></SkeletonHome>}
                <IonGrid >
                    {
                        notices.map((post) => {
                            return (
                                <NoticeCard key={post.id} post={post}></NoticeCard>
                            )
                        })
                    }
                    {
                        notices.length <= 0 && noData && <IonToolbar style={{ textAlign: `center`, paddingTop: `10vh` }}><IonImg src={Pictures.notfound} />
                            <IonCardSubtitle>NO PUBLIC NOTICE YET </IonCardSubtitle>
                        </IonToolbar>
                    }
                </IonGrid>

            </IonContent>
            {showAddOption && <IonFab vertical={`bottom`} horizontal={`end`} >
                <IonFabButton onClick={() => setaddNotice(true)} color={`secondary`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>}
            { !showAddOption && <IonFab vertical={`bottom`} horizontal={`end`} >
                <IonFabButton onClick={() => setshowCodeEntryPopover(true)} color={`medium`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>}
            <IonPopover isOpen={showCodeEntryPopover} onDidDismiss={() => setshowCodeEntryPopover(false)}>
                <IonContent >
                    <form onSubmit={submitCode}>
                        <IonCardContent>
                            <IonCardSubtitle>Please Enter your Municipal code</IonCardSubtitle>
                            <div className="ion-padding-bottom">
                                <IonItem disabled={loading}>
                                    <IonLabel style={{ fontFamily: 'comfortaa', fontSize: 'smaller' }} position='floating'>
                                        Enter code here
                                </IonLabel>
                                    <IonInput autofocus value={codeData} onIonChange={(e) => { setcodeData(e.detail.value || '') }} required type='number'></IonInput>
                                </IonItem>
                            </div>
                            <IonItem lines='none' >
                                <IonButtons slot='end'>
                                    {!loading && <IonButton>
                                        <IonBackdrop></IonBackdrop>
                                        <IonLabel style={{ fontFamily: 'comfortaa' }}>
                                            cancel
                                    </IonLabel>
                                    </IonButton>}
                                    {loading ? <IonButton color='success'><IonSpinner className='ion-margin-end'></IonSpinner> verifying</IonButton> : <IonButton type='submit' color='success'>verify</IonButton>}
                                </IonButtons>
                            </IonItem>
                        </IonCardContent>
                    </form>
                </IonContent>
            </IonPopover>
            <AddNoticeModal isOpen={addNotice} onDidDismiss={() => setaddNotice(false)}></AddNoticeModal>
        </IonPage>
    );
};

export default PublicNotice;


const NoticeCard: React.FC<{ post: PostInterface }> = function ({ post }) {
    const [openNotice, setopenNotice] = useState(false)
    return (
        <IonRow onClick={() => setopenNotice(true)} style={{ borderBottom: `0.5px solid #ebe7e7` }}>
            <IonCol>
                <div>
                    <img style={{ borderRadius: `10px` }} src={post.images[0]} />
                </div>
            </IonCol>
            <IonCol size={`8`}>
                <IonRow>
                    <IonCol >
                        <IonLabel style={{ fontSize: `14px`, textTransform: `capitalize` }}><b>{post.title}</b></IonLabel>
                        <p style={{ color: `#595858`, fontSize: `13px` }} >
                            {post.description.substr(0, 100)}...
                        </p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonNote color={`primary`} ><GetHoursAgo timestamp={post.timestamp} /> | <IonLabel color={`secondary`}>{post.location}</IonLabel></IonNote>
                    </IonCol>
                </IonRow>
            </IonCol>
            <PublicNoticeModal title={`public notice`} isOpen={openNotice} onDidDismiss={() => setopenNotice(false)} post={post}></PublicNoticeModal>
        </IonRow>
    )
}

