import {
  IonAlert,
  IonAvatar,
  IonBadge,
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonLoading,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { exit, exitOutline, hammerOutline, homeOutline, notificationsOutline, peopleOutline, personOutline } from 'ionicons/icons';
import './Menu.css';
import { Pictures } from '../pages/images/images';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserInterface } from '../interfaces/users';
import React from 'react';
import { updateCountry } from '../states/action-creators/country';
import { countryInfoInterface } from '../interfaces/country';
import LetteredAvatar from './LetterAvatar';
import { Storage } from '@capacitor/storage';
import { updateUser } from '../states/action-creators/users';
import { init_favorites } from '../states/reducers/favoritesReducer';
import { auth, db, fstore } from '../Firebase/Firebase';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { update_location } from '../states/reducers/location-reducer';
import { Dialog } from '@capacitor/dialog';
import { accountInterface } from './service/serviceTypes';
import { selectServiceAccount, update_account } from '../states/reducers/service-reducer';
import { showInAppNotification } from './notifications/notifcation';
import { ListenForInAppNotifications, sanitizeDBId } from '../Firebase/pages/inAppNotifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getAppNotifications, getServiceAccount, getStoredCountry, setServiceAccount } from '../states/storage/storage-getters';
import { NotificationRedux, selectNotification, update_notifications } from '../states/reducers/InAppNotifications';
import { SanitizeStringForDB } from './classified/uploadClassifiedToDB';

const countries = [`south africa`, `cameroon`, `nigeria`, `ghana`]
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  condition: boolean
}



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
  const servAccount: accountInterface = useSelector(selectServiceAccount)
  const notifState: NotificationRedux = useSelector(selectNotification)
  const [adminAcc, setadminAcc] = useState<UserInterface | undefined>()

  const appPages: AppPage[] = [
    {
      title: 'Home',
      url: '/feed/default',
      iosIcon: homeOutline,
      mdIcon: homeOutline,
      condition: true

    },
    {
      title: 'Notifications',
      url: '/notifications',
      iosIcon: notificationsOutline,
      mdIcon: notificationsOutline,
      condition: true

    },
    {
      title: 'Profile',
      url: '/profile',
      iosIcon: personOutline,
      mdIcon: personOutline,
      condition: true

    },
    {
      title: 'Admin',
      url: '/admin',
      iosIcon: hammerOutline,
      mdIcon: hammerOutline,
      condition: !!adminAcc
    },



  ];
  useEffect(() => {
    initLocation()
    LocalNotifications.addListener('localNotificationActionPerformed', () => {
      history.push('/notifications')
    })

    initializeService()
    initializeAppNotifications()


  }, [])

  useEffect(() => {
    initializeAdminAccount()

  }, [user])

  async function initializeService() {
    const acc = await getServiceAccount()
    if (acc?.code) {
      dispatch(update_account(acc))
    }
  }

  async function initializeAdminAccount() {
    if (user && user.email) {
      const path = SanitizeStringForDB(user.email);
      db.ref(`admins`).child(path).once(`value`, (snapshot) => {
        const value = snapshot.val()
        if (value) {
          setadminAcc(value)
        }
      })
    }
  }

  async function initializeAppNotifications() {
    const storedNotifications = await getAppNotifications()
    dispatch(update_notifications(storedNotifications));
  }

  async function loginToService(code = user.domainCode) {

    if (!code) {
      setgetCode(true)
      return;
    }
    setloading(true)

    try {
      let account: accountInterface = await interpreteCode(code, countryInfo?.name || `South Africa`, user)
      dispatch(update_account(account))
      setServiceAccount(account)
      if (account.type == `company`) {
        history.push(`/company`)
        setloading(false)
        return;
      }
      history.push(`/service/${account.type}`)
    }
    catch (err) {
      Dialog.alert({ title: `Auth Error`, message: err.message || err || `unexpected error occurred` })
    }
    setloading(false)

  }
  useEffect(() => {

    Storage.get({ key: `favorites` }).then((res) => {
      if (res.value) {
        dispatch(init_favorites(JSON.parse(res.value)))
      }
    })

    initUser()
    initializeCountry()
    initLocation()

  }, [])

  async function initializeCountry() {
    const storedCountry = await getStoredCountry();
    if (storedCountry) {
      dispatch(updateCountry(storedCountry))
    }
    fetch(`https://get.geojs.io/v1/ip/country.json`).then(async res => {
      const country: countryInfoInterface | undefined = (await res.json())

      if (country) {
        if (country.name == storedCountry?.name) {
          return;
        }
        dispatch(updateCountry(country))
        Storage.set({ key: 'country', value: JSON.stringify(country) });
      }
    }).catch(console.log)

  }

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
    loginToService(e[0] + ``)
    // dispatch(updateUser(newUser))
  }


  async function initLocation() {
    try {
      const geo_id = await Geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 3000, timeout: 300000 }, (data) => {
        // alert(data)
        if (data) {
          // alert({ long: data.coords.longitude, lat: data.coords.latitude });
          dispatch(update_location({ long: data.coords.longitude, lat: data.coords.latitude }))
          Geolocation.clearWatch({ id: geo_id });
        }

      })
    } catch (err) {
      Dialog.alert({ title: 'Unable to get Location', message: 'Please make sure to turn on your location and have a stable connection' })
    }

  }

  useEffect(() => {
    if (countryInfo?.country && user.email) {
      ListenForInAppNotifications({ callBack: (info) => { showInAppNotification(info) }, country: countryInfo.name, user_email: user.email })
    }
  }, [countryInfo])
  return (
    <IonMenu swipeGesture={false} className={`menu`} contentId="main" type="overlay">
      <IonToolbar style={{ minHeight: '20vh' }} color={`none`}>
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
        <IonAlert buttons={[{ text: `send`, handler: submitCode }, { text: `cancel` }]} inputs={[{ type: `number`, value: servAccount.code, }]} message={`add service code below`} header={`Please add service Code`} onDidDismiss={() => setgetCode(false)} isOpen={getCode} />
        <IonLoading message={`loading...`} onDidDismiss={() => setloading(false)} isOpen={loading}></IonLoading>
        <div className={`list`}>
          {appPages.map((appPage, index) => {


            return (
              <>{appPage.condition === true && <IonMenuToggle color={`dark`} key={index} autoHide={false}>
                <IonItem routerLink={appPage.url} color={`dark`} routerDirection="forward" lines={`full`} detail={false}>
                  <IonIcon color={location.pathname === appPage.url ? 'warning' : 'light'} slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel color={`dark`} style={{ fontFamily: 'Comfortaa', color: location.pathname === appPage.url ? 'var(--ion-color-warning)' : 'white' }} >{appPage.title}</IonLabel>
                  {appPage.title == 'Notifications' && notifState?.new && <IonBadge slot='end' style={{ transform: 'translate(-14px,0)', borderRadius: '50%', }} color='danger'>
                    <div style={{ width: '1px', height: '3px' }}></div>
                  </IonBadge>}
                </IonItem>
              </IonMenuToggle>
              }</>
            );
          })}
          <IonMenuToggle color={`dark`} autoHide={false}>
            <IonItem color={`dark`} onClick={() => loginToService()} routerDirection="forward" lines={`full`} detail={false}>
              <IonIcon slot="start" ios={peopleOutline} md={peopleOutline} />
              <IonLabel style={{ fontFamily: "Comfortaa" }}>Business Account</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle onClick={() => auth.signOut()} color={`dark`} autoHide={false}>
            <IonItem color={`dark`} className={location.pathname === `/login` ? 'selected' : ''} routerLink={`/login`} routerDirection="forward" lines={`full`} detail={false}>
              <IonIcon slot="start" ios={exit} md={exitOutline} />
              <IonLabel style={{ fontFamily: "Comfortaa" }}>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </div>



      </IonContent>
    </IonMenu>
  );
};

export default Menu;

export async function interpreteCode(code: string, country: string, user: UserInterface): Promise<accountInterface> {

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
  // fstore.collection(`business`).doc(`${country}-${code}`).set(accOwner);

  return (new Promise((resolve, reject) => {
    if (code.length != 6) {
      reject({ message: `Service code MUST BE 6 characters long` })
      return;
    }

    fstore.collection(`business`).doc(`${country}-${code}`).get()
      .then((snapshot) => {
        if (!(snapshot.data() && snapshot.exists)) {
          reject({ message: `No such service account matches the service code` })
          return undefined;
        }
        else {
          const acc: accountInterface | any = snapshot.data();
          const filUsers = acc.users.filter(((accuser: any) => accuser == user.email))
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