import { IonApp, IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonSplitPane, IonTab, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Menu from './components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

import { alertCircleOutline, alertOutline, book, documentOutline, shirtOutline, volumeMediumOutline, wineOutline } from 'ionicons/icons';
import PublicNotice from './pages/PublicNOtice';
import Events from './pages/Events';
import Notifications from './pages/menu/notifications';
import Jobs from './pages/menu/Jobs';
import Settings from './pages/menu/settings';
import IncidentReport from './pages/IncidentReport';
import React, { useEffect } from 'react';
import ProfileModal from './components/ProfileModal';
import Classifieds from './pages/Classifieds';
import { StatusBar } from "@capacitor/status-bar";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import AppUrlListener from './components/deep-linking/AppUrlListener';
import ReportAnIncident from './pages/ReportAnIncident';
import Profile from './pages/menu/Profile';
import AdminPanel from './pages/menu/adminPanel';
import Maps from './pages/maps';

const App: React.FC = () => {

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true }).catch(console.log)
    // initializePushNotification()

  }, [])

  return (

    <IonApp>
      <IonReactRouter>
        {/* <IonSplitPane contentId="main"> */}
        <Menu />
        <AppUrlListener></AppUrlListener>
        <IonTabs>
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/Login" />
            </Route>
            <Route path="/notifications" component={Notifications} exact={true} />
            <Route path="/jobs" component={Jobs} exact={true} />
            <Route path="/settings" component={Settings} exact={true} />
            <Route path="/feed/:postid" component={Home} exact={true} />
            <Route path="/events/:postid" component={Events} exact={true} />
            <Route path="/classifieds/:postid" component={Classifieds} exact={true} />
            <Route path="/public-notice/:postid" component={PublicNotice} exact={true} />

          </IonRouterOutlet>
          <IonTabBar id={`tabbar`} color={`primary`} slot={`bottom`}>
            <IonTabButton tab={`home`} href={`/feed/default`}>
              <IonIcon icon={documentOutline} />
              <IonLabel >Local Feed</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`notice`} href={`/public-notice/default`}>
              <IonIcon icon={alertCircleOutline} />

              <IonLabel>Public Notice</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`events`} href={`/events/default`}>
              <IonIcon icon={wineOutline} />
              <IonLabel>Events</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`classifieds`} href={`/classifieds/default`}>
              <IonIcon icon={shirtOutline} />
              <IonLabel>Classifieds</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <Route path="/Login" component={Login} exact={true} />
        <Route path="/admin" component={AdminPanel} exact={true} />
        <Route path="/signup" component={SignUp} exact={true} />
        <Route path="/profile" component={Profile} exact={true} />
        <Route path="/maps" component={Maps} exact={true} />
        <Route path="/incident-report" component={IncidentReport} exact={true} />
        <Route path="/report" component={ReportAnIncident} exact={true} />
        
        <Route path="/service/:type" component={IncidentReport} exact={true} />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;


export function hideTabBar(value = true) {
  if (value) {
    document.getElementById(`tabbar`)?.style.setProperty(`opacity`, `0`)
  } else {
    document.getElementById(`tabbar`)?.style.setProperty(`opacity`, `1`)

  }
}




export function initializePushNotification() {
  PushNotifications.requestPermissions().then(result => {
    if (result.receive === 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration',
    (token: Token) => {
      // alert('Push registration success, token: ' + token.value);
    }
  );

  // // Some issue with our setup and push will not work
  // PushNotifications.addListener('registrationError',
  //   (error: any) => {
  //     alert('Error on registration: ' + JSON.stringify(error));
  //   }
  // );

  // // Show us the notification payload if the app is open on our device
  // PushNotifications.addListener('pushNotificationReceived',
  //   (notification: PushNotificationSchema) => {
  //     alert('Push received: ' + JSON.stringify(notification));
  //   }
  // );

  // // Method called when tapping on a notification
  // PushNotifications.addListener('pushNotificationActionPerformed',
  //   (notification: ActionPerformed) => {
  //     alert('Push action performed: ' + JSON.stringify(notification));
  //   }
  // );
}

