import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonToolbar,
} from '@ionic/react';

import { useHistory, useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, cashOutline, chevronDown, chevronUp, exit, exitOutline, flagOutline, heart, heartOutline, heartSharp, homeOutline, mailOutline, mailSharp, notificationsOutline, paperPlaneOutline, paperPlaneSharp, settingsOutline, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
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
import { auth } from '../Firebase/Firebase';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { update_location } from '../states/reducers/location-reducer';
import { Dialog } from '@capacitor/dialog';

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
  {
    title: 'Settings',
    url: '/settings',
    iosIcon: settingsOutline,
    mdIcon: settingsOutline
  },
  {
    title: 'Jobs',
    url: '/jobs',
    iosIcon: cashOutline,
    mdIcon: cashOutline
  },
  

];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const [showCountries, setshowCountries] = useState(false)
  const rootState: any = (useSelector(state => state))
  const user: UserInterface = rootState.userReducer;
  const dispatch = useDispatch()
  const countryInfo: countryInfoInterface | undefined = rootState.countryReducer
  const history = useHistory()
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
        <IonToolbar className={`dp`} color={`none`} style={{ marginTop: `-6px`, paddingBottom:`30px` }}>
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

        <div className={`list`}>
          {appPages.map((appPage, index) => {
            // if (appPage.title === `Countries`) {
            //   return (
            //     <React.Fragment key={index}>
            //       <FlipMove>
            //         <IonItem onClick={() => setshowCountries(!showCountries)} color={`dark`} className={location.pathname === appPage.url ? 'selected' : ''} lines={`full`} detail={false}>
            //           <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
            //           <IonLabel>{appPage.title}</IonLabel>
            //           <IonButtons slot={`end`}>
            //             <IonButton>
            //               <IonIcon icon={showCountries ? chevronUp : chevronDown} />
            //             </IonButton>
            //           </IonButtons>
            //         </IonItem>


            //         {
            //           showCountries && countries.map((country, index) => {
            //             return (
            //               <IonMenuToggle color={`primary`} key={index} autoHide={false}>
            //                 <IonItem color={`primary`} className={location.pathname === appPage.url ? 'selected' : ''} lines={`full`} detail={false}>
            //                   {country}
            //                 </IonItem>
            //               </IonMenuToggle>
            //             )
            //           })

            //         }
            //       </FlipMove>

            //     </React.Fragment>
            //   )
            // }
            return (
              <IonMenuToggle color={`dark`} key={index} autoHide={false}>
                <IonItem routerLink={appPage.url} color={`dark`} routerDirection="forward" lines={`full`} detail={false}>
                  <IonIcon color={ location.pathname === appPage.url ? 'warning' : 'light'} slot="start" ios={appPage.iosIcon}  md={appPage.mdIcon} />
                  <IonLabel color={`dark`} style={{ color : location.pathname === appPage.url ? 'var(--ion-color-warning)' : 'white'}} >{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle onClick={()=>auth.signOut()} color={`dark`}  autoHide={false}>
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
