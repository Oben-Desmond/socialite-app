
import { IonButton, IonContent, IonModal, IonSearchbar, IonToolbar, IonList, IonIcon, IonItem, IonLabel, IonFab, IonFabButton, IonProgressBar } from '@ionic/react';
import { search, searchOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { fstore } from '../../Firebase/Firebase';
import { searchKeys } from './uploadClassifiedToDB';
import '../styles/searchModal.css';
import FlipMove from 'react-flip-move';

const SearchModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void, searchForItem: (text: string) => void }> = function ({ isOpen, onDidDismiss, searchForItem }) {

    const [recommendText, setrecommendText] = useState<string[]>([])
    const [loading, setloading] = useState<boolean>(false)
    const searchRef= useRef<HTMLIonSearchbarElement>(null)

    useEffect(()=>{
        searchRef.current?.addEventListener(`keyup`,e=>{
            if(e.key.toLowerCase()==`enter` || e.key.toLowerCase()==`\n`){
                searchText(searchRef.current?.value||``)
            }
        })
    },[])

    async function searchText(text: string | undefined) {
        setloading(true)
        if (text)
            setrecommendText(await searchKeys(text))
        setloading(false)
    }

    function searchWord(text: string) {
        setloading(true)
        return (new Promise((resolve, reject) => {
            fstore.collection(`classified`).orderBy(`timestamp`).limitToLast(4).where(`item_keywords`, `array-contains-any`, text).get().then((res) => {
                const docs = res.docs.map(doc => doc.data())
                resolve(docs)
            }).catch(reject).finally(() => {
                setloading(false)
            })
        }))
    }

    function searchFor(text: string) {

        searchForItem(text)

    }
    return (
        <IonModal cssClass={`search-modal`} isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <div style={{ height: `25px`, background: `var(--ion-color-primary)` }} className="status-bar"></div>
            <IonToolbar className={`header`}>
                <IonSearchbar ref={searchRef} mode={`ios`} onIonChange={(e) => searchText(e.detail.value)}></IonSearchbar>
            </IonToolbar>
            {loading && <IonProgressBar color={`primary`} buffer={0.5}></IonProgressBar>}
            <IonContent>
                <IonList className={`recommend-list`}>
                    <FlipMove>
                        {
                            recommendText.map((text, index) => (
                                <IonItem onClick={() => searchFor(text)} key={index} button>
                                    <IonIcon icon={searchOutline} />
                                    <IonLabel>
                                        {text}
                                    </IonLabel>
                                </IonItem>
                            ))
                        }
                    </FlipMove>
                </IonList>
            </IonContent>
           {searchRef.current?.value&&<IonFab onClick={() => searchFor(searchRef.current?.value || ``)}  className={`search-fab`} horizontal={`end`} vertical={`center`}>
                <IonFabButton >
                    <IonIcon icon={search} />
                </IonFabButton>
            </IonFab>}
        </IonModal>
    );
};

export default SearchModal;