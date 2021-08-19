import { IonApp, IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonSplitPane, IonTab, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

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

const App: React.FC = () => {

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true }).catch(console.log)
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        {/* <IonSplitPane contentId="main"> */}
        <Menu />


        <IonTabs>
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/Login" />
            </Route>
            <Route path="/notifications" component={Notifications} exact={true} />
            <Route path="/jobs" component={Jobs} exact={true} />
            <Route path="/settings" component={Settings} exact={true} />
            <Route path="/incident-report" component={IncidentReport} exact={true} />
            <Route path="/home" component={Home} exact={true} />
            <Route path="/events" component={Events} exact={true} />
            <Route path="/classifieds" component={Classifieds} exact={true} />
            <Route path="/public-notice" component={PublicNotice} exact={true} />

          </IonRouterOutlet>
          <IonTabBar id={`tabbar`} color={`primary`} slot={`bottom`}>
            <IonTabButton tab={`home`} href={`/home`}>
              <IonIcon icon={documentOutline} />
              <IonLabel >Local Feed</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`notice`} href={`/public-notice`}>
              <IonIcon icon={alertCircleOutline} />
              <IonBadge color={`danger`}>3</IonBadge>
              <IonLabel>Public Notice</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`events`} href={`/events`}>
              <IonIcon icon={wineOutline} />
              <IonLabel>Events</IonLabel>
            </IonTabButton>
            <IonTabButton tab={`classifieds`} href={`/classifieds`}>
              <IonIcon icon={shirtOutline} />
              <IonLabel>Classifieds</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <Route path="/Login" component={Login} exact={true} />
        <Route path="/signup" component={SignUp} exact={true} />
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