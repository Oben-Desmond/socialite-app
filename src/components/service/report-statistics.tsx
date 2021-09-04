

import { IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonModal, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { people, peopleOutline, star } from 'ionicons/icons';
import React, { FC } from 'react';
import "./service.css";


const ReportStatistics: FC<{}> = function () {
    return (
        <IonModal cssClass={`report-statistics`} isOpen={true}>
            <IonHeader>
                <IonToolbar >
                    <IonTitle>Report Statistic</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard className={`card`}>
                                <IonText color={`secondary`}>50%</IonText>
                                <IonCardHeader>
                                    <IonLabel color={`primary`}>attended cases</IonLabel>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>
                        <IonCol>
                            <IonCard className={`card`}>
                                <IonText color={`secondary`}>40k</IonText>
                                <IonCardHeader>
                                    <IonLabel color={`primary`}>Reports this Month</IonLabel>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonCard className={`card`}>
                                <IonText color={`primary`}>4 <IonIcon  size={`small`} color={`warning`} icon={star} /> </IonText>
                                <IonCardHeader>
                                    <IonLabel color={`primary`}>user rating</IonLabel>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>
                        <IonCol>
                            <IonCard className={`card people`}>
                                <IonIcon   icon={peopleOutline}/>
                                <IonCardHeader>
                                    <IonLabel color={`primary`}>5 service coworkers</IonLabel>
                                </IonCardHeader>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonModal>
    );
};

export default ReportStatistics;