import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCardHeader,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonPopover,
  IonRow,
  IonToolbar,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, cashOutline, chevronDown, chevronUp, exit, exitOutline, flagOutline, heart, heartOutline, heartSharp, homeOutline, mailOutline, mailSharp, notificationsOutline, paperPlaneOutline, paperPlaneSharp, peopleOutline, settingsOutline, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { Pictures } from '../pages/images/images';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserInterface } from '../interfaces/users';
import FlipMove from 'react-flip-move';
import React from 'react';
import { updateCountry } from '../states/action-creators/country';
import { countryInfoInterface } from '../interfaces/country';
import LetteredAvatar from './LetterAvatar';
import { Storage } from '@capacitor/storage';
import { updateUser } from '../states/action-creators/users';
import { init_favorites, update_favorites } from '../states/reducers/favoritesReducer';
import { auth, fstore } from '../Firebase/Firebase';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { update_location } from '../states/reducers/location-reducer';
import { Dialog } from '@capacitor/dialog';
import { accountInterface } from './service/serviceTypes';

const countries = [`south africa`, `cameroon`, `nigeria`, `ghana`]
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/feed/default',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Notifications',
    url: '/notifications',
    iosIcon: notificationsOutline,
    mdIcon: notificationsOutline
  },
  // {
  //   title: 'Countries',
  //   url: '/page/Outbox',
  //   iosIcon: flagOutline,
  //   mdIcon: flagOutline
  // },



];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const [loading, setloading] = useState(false)
  const [getCode, setgetCode] = useState(false)
  const rootState: any = (useSelector(state => state))
  const user: UserInterface = rootState.userReducer;
  const dispatch = useDispatch()
  const countryInfo: countryInfoInterface | undefined = rootState.countryReducer
  const history = useHistory()

  async function loginToService(code = user.domainCode) {

    if (!code) {
      setgetCode(true)
      return;
    }
    setloading(true)

    try {
      let account = await interpreteCode(code, countryInfo?.name || `South Africa`, user)
      console.log(`acount - - - - `, account);
    }
    catch (err) {
      Dialog.alert({ title: `Auth Error`, message: err.message || err || `unexpected error occurred` })
    }
    setloading(false)

  }
  useEffect(() => {

    fetch(`https://get.geojs.io/v1/ip/country.json`).then(async res => {
      const country: countryInfoInterface | undefined = (await res.json())
      if (country) {
        dispatch(updateCountry(country))
      }
    }).catch(console.log)
    Storage.get({ key: `favorites` }).then((res) => {
      if (res.value) {
        dispatch(init_favorites(JSON.parse(res.value)))
      }
    })
    initLocation()
    initUser()

  }, [])


  async function initUser() {
    const userStr = (await Storage.get({ key: `user` })).value
    if (userStr) {
      const user = JSON.parse(userStr)
      dispatch(updateUser(user))

      if (Capacitor.isNativePlatform()) history.push(`/feed/default`);

    }
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push(`/login`)
      }
    })
  }
  function submitCode(e: any) {

    let newUser: UserInterface = {
      ...user, domainCode: e[0] + ``
    }
    loginToService(e[0]+``)
    // dispatch(updateUser(newUser))
  }


  async function initLocation() {

    Geolocation.checkPermissions().then((res) => {
      if (res.location == `granted`)
        Geolocation.getCurrentPosition().then(data => {
          dispatch(update_location({ long: data.coords.longitude, lat: data.coords.latitude }))
        })
      else {
        Geolocation.requestPermissions().then(async (res) => {
          const ans = await Dialog.confirm({ message: `In Order for us to provide you relevant content we will require your current location`, title: `Location Required`, okButtonTitle: `Proceed`, cancelButtonTitle: `Deny` })

          if (!ans.value) return;

          if (res.location == `granted`) {
            Geolocation.getCurrentPosition().then(data => {
              dispatch(update_location({ long: data.coords.longitude, lat: data.coords.latitude }))
            })
          }
        })

      }
    })



  }
  return (
    <IonMenu className={`menu`} contentId="main" type="overlay">
      <IonToolbar color={`none`}>
        <div className={`country-flag`}>
          <IonImg src={user?.photoUrl || Pictures.bg} />
        </div>
        <IonToolbar className={`dp`} color={`none`} style={{ marginTop: `-6px`, paddingBottom: `30px` }}>
          {countryInfo?.country && <img style={{ marginBottom: `-20px` }} src={`https://www.countryflags.io/${countryInfo?.country}/shiny/64.png`} />}
          {user.photoUrl && <IonAvatar slot={`end`}  >
            <IonImg src={user.photoUrl} />
          </IonAvatar>}
          {
            !user.photoUrl && user.name && <IonButtons slot={`end`}>
              <LetteredAvatar size={60} backgroundColor={`var(--ion-color-secondary)`} name={user?.name[0]} />
            </IonButtons>

          }
        </IonToolbar>
      </IonToolbar>
      <IonContent>
        <IonAlert buttons={[{ text: `send`, handler: submitCode }, { text: `cancel` }]} inputs={[{ type: `number` }]} message={`add service code below`} header={`Please add service Code`} onDidDismiss={() => setgetCode(false)} isOpen={getCode} />
        <IonLoading message={`loading...`} onDidDismiss={() => setloading(false)} isOpen={loading}></IonLoading>
        <div className={`list`}>
          {appPages.map((appPage, index) => {


            return (
              <IonMenuToggle color={`dark`} key={index} autoHide={false}>
                <IonItem routerLink={appPage.url} color={`dark`} routerDirection="forward" lines={`full`} detail={false}>
                  <IonIcon color={location.pathname === appPage.url ? 'warning' : 'light'} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel color={`dark`} style={{ color: location.pathname === appPage.url ? 'var(--ion-color-warning)' : 'white' }} >{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle color={`dark`} autoHide={false}>
            <IonItem color={`dark`} onClick={() => loginToService()} routerDirection="forward" lines={`full`} detail={false}>
              <IonIcon slot="start" ios={peopleOutline} md={peopleOutline} />
              <IonLabel>Business Account</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle onClick={() => auth.signOut()} color={`dark`} autoHide={false}>
            <IonItem color={`dark`} className={location.pathname === `/login` ? 'selected' : ''} routerLink={`/login`} routerDirection="forward" lines={`full`} detail={false}>
              <IonIcon slot="start" ios={exit} md={exitOutline} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </div>



      </IonContent>
    </IonMenu>
  );
};

export default Menu;

async function interpreteCode(code: string, country: string, user: UserInterface) {

  // const accOwner:accountInterface={
  //   code:`102001`,
  //   country:`Cameroon`,
  //   location:{lat:9.345,long:9.4567},
  //   tel:`+237678320028`,
  //   timestamp:Date.now(),
  //   type:`defence`,
  //   users:[{
  //     email:`obend678@gmail.com`,
  //     last_signIn:Date.now(),
  //     name:user.name||`unknown`,
  //     photoUrl:user.photoUrl
  //   }]
    
  // }
  // fstore.collection(`business`).doc(country).collection(`accounts`).doc(accOwner.code).set(accOwner)

  return (new Promise((resolve, reject) => {
    if (code.length != 6) {
      reject({ message: `SERVICE CODE must not be 6 characters` })
      return;
    }

    fstore.collection(`business`).doc(country).collection(`accounts`).doc(code).get()
      .then((snapshot) => {
        if (!(snapshot.data() && snapshot.exists)) {
          reject({ message: `No such service account matches the service code` })
          return;
        }
        else {
          const acc: accountInterface | any = snapshot.data();
          const filUsers = acc.users.filter(((accuser: any) => accuser.email == user.email))
          if (filUsers.length <= 0) {
            reject({ message: `your email is not permitted among permitted service providers` });
            return;
          } else {
            resolve(acc)
          }
        }
      }).catch(reject)


  }))
}