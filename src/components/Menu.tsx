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
import { archiveOutline, archiveSharp, bookmarkOutline, cashOutline, chevronDown, chevronUp, exitOutline, flagOutline, heart, heartOutline, heartSharp, mailOutline, mailSharp, notificationsOutline, paperPlaneOutline, paperPlaneSharp, settingsOutline, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
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
import {Storage} from '@capacitor/storage';
import { updateUser } from '../states/action-creators/users';

const countries = [`south africa`, `cameroon`, `nigeria`, `ghana`]
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Notifications',
    url: '/notifications',
    iosIcon: notificationsOutline,
    mdIcon: notificationsOutline
  },
  {
    title: 'Countries',
    url: '/page/Outbox',
    iosIcon: flagOutline,
    mdIcon: flagOutline
  },
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
  {
    title: 'Logout',
    url: '/login',
    iosIcon: exitOutline,
    mdIcon: exitOutline
  },

];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();
  const [showCountries, setshowCountries] = useState(false)
  const rootState: any = (useSelector(state => state))
  const user: UserInterface = rootState.userReducer;
  const dispatch = useDispatch()
  const countryInfo:countryInfoInterface|undefined=  rootState.countryReducer
  const history= useHistory()
  useEffect(() => {
 
    fetch(`https://get.geojs.io/v1/ip/country.json`).then(async res => {
      const country: countryInfoInterface | undefined = (await res.json())
      if (country) {
        dispatch(updateCountry(country))
      }
    }).catch(console.log)

   initUser()

  }, [])


 async  function initUser(){
   const userStr=( await  Storage.get({key:`user`})).value
   if(userStr){
     const user = JSON.parse(userStr)
     dispatch(updateUser(user))
     history.push(`/home`)

   }
  }
  return (
    <IonMenu className={`menu`} contentId="main" type="overlay">
      <IonToolbar color={`none`}>
        <div className={`country-flag`}>
          <IonImg src={user?.photoUrl|| Pictures.bg} />
        </div>
        <IonToolbar className={`dp`} color={`none`} style={{ marginTop: `-20px` }}>
       {countryInfo?.country&& <img style={{marginBottom:`-20px`}} src={`https://www.countryflags.io/${countryInfo?.country}/shiny/64.png`}/>}
          {user.photoUrl&&<IonAvatar slot={`end`}  >
            <IonImg src={user.photoUrl} />
          </IonAvatar>}
          {
            !user.photoUrl&& user.name&& <IonButtons slot={`end`}>
              <LetteredAvatar size={60} backgroundColor={`var(--ion-color-secondary)`} name={user?.name[0]} />
            </IonButtons>
                              
           }
        </IonToolbar>
      </IonToolbar>
      <IonContent>

        <div className={`list`}>
          {appPages.map((appPage, index) => {
            if (appPage.title === `Countries`) {
              return (
                <React.Fragment key={index}>
                  <FlipMove>
                    <IonItem onClick={() => setshowCountries(!showCountries)} color={`dark`} className={location.pathname === appPage.url ? 'selected' : ''} lines={`full`} detail={false}>
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                      <IonButtons slot={`end`}>
                        <IonButton>
                          <IonIcon icon={showCountries ? chevronUp : chevronDown} />
                        </IonButton>
                      </IonButtons>
                    </IonItem>


                    {
                      showCountries && countries.map((country, index) => {
                        return (
                          <IonMenuToggle color={`primary`} key={index} autoHide={false}>
                            <IonItem color={`primary`} className={location.pathname === appPage.url ? 'selected' : ''} lines={`full`} detail={false}>
                              {country}
                            </IonItem>
                          </IonMenuToggle>
                        )
                      })

                    }</FlipMove>

                </React.Fragment>
              )
            }
            return (
              <IonMenuToggle color={`dark`} key={index} autoHide={false}>
                <IonItem color={`dark`} className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="forward" lines={`full`} detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </div>


      </IonContent>
    </IonMenu>
  );
};

export default Menu;
