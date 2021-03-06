// @flow strict

import { Geolocation } from '@capacitor/geolocation';
import { IonActionSheet, IonAvatar, IonBackdrop, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonPopover, IonProgressBar, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { add, addCircleOutline, cashOutline, close, ellipsisVertical, heartOutline, shirtOutline, sync } from 'ionicons/icons';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { maincategories, subcategories } from '../components/classified/categories-data';
import ClassifiedItem from '../components/classified/ClassifiedItem';
import { fetchMyItems } from '../components/classified/classifieds-fetch';
import SearchModal from '../components/classified/searchModal';
import UploadClassified from '../components/classified/UploadClassified';
import { fetchItemById, getItemsMatching } from '../components/classified/uploadClassifiedToDB';
import GeoSyncModal from '../components/GeoSyncModal';
import SkeletonHome from '../components/top stories/dummy';
import { fstore } from '../Firebase/Firebase';
import { getSyncedClassifieds } from '../Firebase/pages/classifieds';
import { classifiedItemInterface } from '../interfaces/classifiedItems';
import { PostInterface } from '../interfaces/posts';
import { UserInterface } from '../interfaces/users';
import { CURRENCIES } from '../states/constants';
import { Currency, selectCurrency, update_currency } from '../states/reducers/currency_reducer';
import { selectFavorites } from '../states/reducers/favoritesReducer';
import { selectLocation, update_location } from '../states/reducers/location-reducer';
import { selectUser } from '../states/reducers/userReducers';
import { Pictures } from './images/images';
import "./style/Classifieds.css";


const mycontext: any = []
export const SelectedTabContext = createContext(mycontext)

const Classifieds: React.FC = () => {
    const [showMenu, setshowMenu] = useState(false)
    const [startSearch, setstartSearch] = useState(false)
    const [uploadItem, setuploadItem] = useState(false)
    const [searchTabText, setsearchTabText] = useState(``)
    const [classifiedList, setclassifiedList] = useState<classifiedItemInterface[]>()
    const [loading, setloading] = useState(false)
    const [notFound, setnotFound] = useState(false)
    const [selectedTab, setselectedTab] = useState<categoryPayloadInterface>({ cat: `latest`, subcat: subcategories[maincategories[0].name] || `other` })
    const [prevTab, setprevTab] = useState<categoryPayloadInterface>({ cat: ``, subcat: `` })
    const [select_currency_option, setselect_currency_option] = useState(false)
    const user_location = useSelector(selectLocation)
    const user: UserInterface = useSelector(selectUser)
    const favorites = useSelector(selectFavorites)
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const [distance, setdistance] = useState<number>(500)
    const [openSyncMap, setopenSyncMap] = useState(false)
    const locationInfo: { long: number, lat: number } = useSelector(selectLocation);
    const [current_currency, setcurrent_currency] = useState(0)
    const currency_state: Currency = useSelector(selectCurrency);
    const dispatch = useDispatch();

    const params: { postid: string } = useParams()

    useEffect(() => {
        if (params.postid == `default` || !params.postid) {
            // getItemsFromTab(selectedTab)
            SyncPostWithDistance(distance)
            setprevTab(selectedTab);
            return;
        }
        setTimeout(() => {

            getPost(params.postid)

        }, 1200);

    }, [params])
    function getPost(postid: string) {
        setloading(true)
        setclassifiedList([])
        fetchItemById(postid, (post: classifiedItemInterface) => {
            setclassifiedList([])
            setloading(false)
            setclassifiedList([post])
            if ([post].length <= 0) {
                setnotFound(true)
            }
        }, () => {
            setnotFound(true)
        })
    }

    function openUploadItem() {
        setuploadItem(true)
        setshowMenu(false)
    }


    function sendAlert(val: any) {
        alert(JSON.stringify(val))
    }

    useEffect(() => {
        if (prevTab.subcat == ``) {
            setprevTab(selectedTab);
            return;
        }
        getItemsFromTab(selectedTab)
        // return (() => unsub())

    }, [selectedTab])

    function getItemsFromTab(selectedTab: categoryPayloadInterface) {
        const category = selectedTab
        console.log(selectedTab)
        setloading(true)
        console.log(category)
        setsearchTabText(``)

        if (selectedTab.cat == `latest`) {
            getLatestClassifieds(() => { })

        } else {
            if (category.subcat && category.subcat != `order`) {
                console.log();

                const unsub = fstore.collection(`classified`)
                    .where(`sub_category`, `==`, category.subcat).limit(50).get().then(res => {
                        const docs: any[] = res.docs.map((doc) => doc.data())
                        console.log(docs)
                        setclassifiedList(docs)
                        setnotFound(docs.length <= 0)
                        setloading(false)

                    })
            } else if (category.cat) {
                const unsub = fstore.collection(`classified`)
                    .where(`sub_category`, `==`, category.subcat).limit(50).get().then(res => {
                        const docs: any[] = res.docs.map((doc) => doc.data())
                        console.log(docs)
                        setclassifiedList(docs)
                        setnotFound(docs.length <= 0)
                        setloading(false)

                    })
            }
        }
    }

    function getLatestClassifieds(callback: () => void) {
        setclassifiedList([])
        fstore.collection(`classified`).orderBy(`timestamp`, `desc`).limit(20).get().then(res => {
            const docs: any[] = res.docs.map((doc) => doc.data())
            console.log(docs)
            setclassifiedList(docs)
            setnotFound(docs.length <= 0)
            setloading(false)
            callback()

        })
    }

    function getClassified(category: string) {

    }

    async function getMyItems() {
        try {
            setloading(true)
            const myItems: classifiedItemInterface[] | any = await fetchMyItems(user)
            setclassifiedList([...myItems])
            setshowMenu(false)
            setloading(false)

        } catch (err) {
            console.log(err)
            setshowMenu(false)
            setloading(false)
        }

    }

    async function searchForItem(text: string) {
        setstartSearch(false)
        setclassifiedList([])
        setloading(true)
        setnotFound(false)

        const items = await getItemsMatching(text, user_location)
        if (items.length > 0) {
            setclassifiedList([...items])
            setsearchTabText(`Search Results`)
        } else {
            setnotFound(true)
        }
        setloading(false)

    }
    function getFavorites() {
        setclassifiedList(favorites || [])
        if (favorites.length < 0)
            setnotFound(true)
        setshowMenu(false)
        setsearchTabText(`Your Favorites`)
    }
    async function SyncPostWithDistance(radius: number) {
        setdistance(radius);
        setnotFound(false)
        setclassifiedList([])
        setopenSyncMap(false)
        setloading(true)
        const posts: any[] = await getSyncedClassifieds(radius, locationInfo);

        if (posts.length <= 0) {
            setnotFound(true)
        }
        setclassifiedList([...posts])
        console.log(posts)
        setloading(false)
    }
    function modifyCurrency(index: number) {
        setcurrent_currency(index)
        const newCurrency: Currency = {
            name: CURRENCIES[index],
            equivalent: {
                ...currency_state.equivalent
            }
        }
        console.log(newCurrency)
        dispatch(update_currency(newCurrency))
    }
    return (
        <IonPage className={`classifieds`}>
            <SelectedTabContext.Provider value={[selectedTab, setselectedTab]}>
                <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
                {/* {loading && <IonProgressBar color={`secondary`} type={`indeterminate`}></IonProgressBar>} */}
                <IonToolbar >
                    <div className="title">
                        <IonItem lines={`none`} >
                            <IonLabel>Classifieds</IonLabel>

                            <IonButtons slot={`end`}>
                                <IonButton onClick={() => setopenSyncMap(true)} fill={`clear`}>
                                    <IonIcon icon={sync} />
                                    <IonBadge color={`success`} >{distance > 0 && distance + `km`}</IonBadge>
                                </IonButton>

                                <IonButton onClick={() => setselect_currency_option(true)} color={`tertiary`} fill={`clear`}>
                                    <IonIcon icon={cashOutline} />
                                    {CURRENCIES[current_currency]}
                                </IonButton>
                                <IonButton fill={`clear`}>
                                    <IonIcon icon={ellipsisVertical} />
                                </IonButton>
                            </IonButtons>
                        </IonItem>

                    </div>
                    <IonSearchbar onClick={() => setstartSearch(true)} mode={`ios`} placeholder={`search`}></IonSearchbar>

                </IonToolbar>
                <IonContent >
                    <IonRefresher ref={refresherRef} onIonRefresh={() => getLatestClassifieds(() => refresherRef.current?.complete())} slot={`fixed`}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonContent scrollY={false} style={{ height: `45px`, width: `100%` }} scrollX className={`category-tab`}>
                        <div style={{ width: `600vw` }}>
                            <Categories getClassified={getClassified}></Categories>
                        </div>
                    </IonContent>
                    {loading && <SkeletonHome></SkeletonHome>}
                    {notFound && (classifiedList || [])?.length <= 0 && <div className={`ion-padding`}><IonImg src={Pictures.notfound} /> <IonLabel>NOT RESULT</IonLabel></div>}
                    {searchTabText && <IonToolbar style={{ textAlign: `center` }}>
                        <IonText>
                            Search Results
                        </IonText>

                    </IonToolbar>}
                    <IonGrid>
                        <IonRow>{(classifiedList || []).length == 1 &&
                            <IonCol>
                                {
                                    classifiedList?.map((item: classifiedItemInterface, index: number) => {
                                        return (
                                            <ClassifiedItem key={index} item={item}></ClassifiedItem>
                                        )
                                    })
                                }
                            </IonCol>}
                        </IonRow>


                        {(classifiedList || []).length > 1 && <IonRow>
                            <IonCol size={`6`}>
                                {
                                    classifiedList?.map((item: classifiedItemInterface, index: number) => {
                                        if (!!!(index % 2) && item) return (
                                            <ClassifiedItem key={index} item={item}></ClassifiedItem>
                                        )
                                    })
                                }
                                {/* <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                            <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} /> */}

                            </IonCol>
                            <IonCol size={`6`}>
                                {
                                    classifiedList?.map((item: classifiedItemInterface, index: number) => {
                                        if (!!(index % 2) && item) return (
                                            <ClassifiedItem key={index} item={item}></ClassifiedItem>
                                        )
                                    })
                                }
                                {/* {
                                 <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                 <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1602810320073-1230c46d89d4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                 <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`}></ClassifiedItem>
                             
                            } */}
                            </IonCol>
                            {/* <IonCol size={`6`} >
                            <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                            <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1602810320073-1230c46d89d4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHNoaXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                            <ClassifiedItem photoUrl={`https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`}></ClassifiedItem>
                        </IonCol> */}
                        </IonRow>}
                    </IonGrid>

                </IonContent>
                <IonFab vertical={`bottom`} horizontal={`end`}>
                    <IonFabButton color={`secondary`} onClick={() => openUploadItem()}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>


                <IonPopover onDidDismiss={() => setshowMenu(false)} isOpen={showMenu}>
                    <IonItem lines={`none`}>
                        <IonCardTitle>Options</IonCardTitle>
                        <IonButton slot={`end`} fill={`clear`}>
                            <IonIcon icon={close} />
                            <IonBackdrop></IonBackdrop>
                        </IonButton>
                    </IonItem>
                    <IonContent>
                        <IonItem onClick={openUploadItem} button >
                            <IonIcon slot={`start`} icon={addCircleOutline} />
                            <IonLabel>upload item</IonLabel>
                        </IonItem>
                        <IonItem onClick={() => getMyItems()} button >
                            <IonIcon slot={`start`} icon={shirtOutline} />
                            <IonLabel>My Items</IonLabel>
                        </IonItem>
                        <IonItem onClick={() => getFavorites()} button >
                            <IonIcon slot={`start`} icon={heartOutline} />
                            <IonLabel>favorites</IonLabel>
                        </IonItem>
                    </IonContent>
                </IonPopover>
                <GeoSyncModal displayText={`Sync feed to`} isOpen={openSyncMap} onDidDismiss={radius => {
                    if (radius) {
                        SyncPostWithDistance(radius)
                    };
                    setopenSyncMap(false)
                }}></GeoSyncModal>
                <IonActionSheet header={`choose currency`} isOpen={select_currency_option} buttons={CURRENCIES.map((currency, index) => ({ text: currency, handler: () => modifyCurrency(index) }))} onDidDismiss={() => { setselect_currency_option(false) }} />
                <SearchModal searchForItem={searchForItem} onDidDismiss={() => setstartSearch(false)} isOpen={startSearch}></SearchModal>
                <UploadClassified onDidDismiss={() => { setuploadItem(false) }} isOpen={uploadItem}></UploadClassified>
            </SelectedTabContext.Provider>
        </IonPage>
    );
};

export default Classifieds;




function Categories(props: { getClassified: (cat: string) => void }) {
    const [selectedTab, setselectedTab] = useContext(SelectedTabContext)
    //    const [selectedTab,setselectedTab]=useState(categoryData[1].name)
    const { getClassified } = props
    const colors = [`secondary`, `dark`, `tertiary`, `medium`, `success`, `danger`, `primary`, `warning`]
    return (
        <>
            {
                maincategories.map((category, index) => {
                    const color = colors[index % colors.length]
                    return (<CategoryChip key={index} selected={category.name == selectedTab.cat} selectedTab={(categoryPayload) => { setselectedTab(categoryPayload); getClassified(category.name) }} category={{ ...category, color: color }}></CategoryChip>)
                })
            }

        </>
    )
}

export interface categoryPayloadInterface {
    cat: string,
    subcat: string,
}

function CategoryChip(props: { category: { name: string, url: string, color: string }, selected: boolean, selectedTab: (val: categoryPayloadInterface) => void }) {
    const { category, selected, selectedTab } = props
    const [init, setinit] = useState(false)
    const [openActions, setopenActions] = useState(false)
    const [listActions, setlistActions] = useState<string[]>((subcategories[category.name] || []))

    function switchTab(categoryPayload: categoryPayloadInterface) {
        selectedTab(categoryPayload)
        setinit(true)
    }

    async function openSubCat() {
        setopenActions(true)

    }
    // style={{ border: selected ? `2px solid var(--ion-color-dark)` : `none` }}
    return (

        <IonChip outline={selected} onClick={() => openSubCat()} color={category.color}>
            <IonAvatar>
                <img src={category.url}  ></img>maincategories[0].name
            </IonAvatar>
            <IonLabel>{category.name}</IonLabel>
            <IonActionSheet header={`Select Subcategory`} buttons={[...listActions.map((action) => ({ text: action, handler: () => switchTab({ cat: category.name, subcat: action }) })), { text: `other`, handler: () => switchTab({ cat: category.name, subcat: `other` }) }]} onDidDismiss={() => setopenActions(false)} isOpen={openActions}></IonActionSheet>
            {/* <IonSelect>
                {
                    (subcategories[category.name] || []).map((subcat:string)=>{
                        return(
                            <IonSelectOption>
                                {subcat}
                            </IonSelectOption>
                        )
                    })
                }
            </IonSelect> */}
        </IonChip>
    )
}




export const categoryData: { name: string, url: string, color: string }[] = [
    {
        name: `latest`,
        url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROAyavRmHuN1Kz4nLmBi770dykPjAho9QNkw&usqp=CAU`,
        color: `dark`
    },
    {
        name: `clothing`,
        url: `https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `success`
    },
    {
        name: `cars`,
        url: `https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2Fyc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `danger`

    },
    {

        name: `Furniture`,
        url: `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZnVybml0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `warning`
    },
    {
        name: `electronics`,
        url: `https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `secondary`
    },
    {
        name: `food`,
        url: `https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `tertiary`
    },
    {
        name: `Apartment`,
        url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `dark`,
    },
    {
        name: `pets`,
        url: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
        color: `primary`,

    }, {
        name: `book`,
        url: `data:image/jpeg;base64,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`
        , color: `success`
    }
]
