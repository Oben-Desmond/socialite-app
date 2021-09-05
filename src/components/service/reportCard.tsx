import { IonAvatar, IonBackdrop, IonBadge, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from "@ionic/react";
import { add, checkmarkDone, close, people, peopleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LetterAvatar from "../LetterAvatar";
import ReportStatistics from "./report-statistics";
import ViewReportModal from "./ViewReportModal";
import TimeAgo from '../timeago';



interface stylesInterface {
    grid: React.CSSProperties
}




const styles: stylesInterface = {
    grid: {

    }
}


const ReportCard: React.FC = () => {
    const [viewReport, setviewReport] = useState(false);
    const [time] = useState(Date.now())

    return (
        <div>
            <IonItem onClick={() => setviewReport(true)}>
                <IonGrid>
                    <IonRow>
                        <IonCol className={`ion-align-self-start`}>
                            <UserAvatar ></UserAvatar>
                        </IonCol>
                        <IonCol className={`ion-align-self-center`} >
                            <IonRow>
                                <div >
                                    <IonLabel>Buma Federic</IonLabel>
                                </div>
                                <div>
                                    <IonLabel>Fire Accident in Calaban</IonLabel>
                                </div>
                            </IonRow>
                            <IonRow>
                                <IonNote>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, eveniet?
                                </IonNote>
                            </IonRow>
                        </IonCol>
                        <IonCol className={`ion-align-self-center`}>
                            <IonRow style={{ textAlign: `center` }}>
                                <IonCol>
                                    <IonBadge color={`success`}><div style={{ width: `4px`, height: `4px` }}></div> </IonBadge>
                                    {/* <IonIcon color={`success`} icon={checkmarkDone}></IonIcon> */}
                                </IonCol>
                            </IonRow>
                            <IonRow >
                                <IonNote style={{ textAlign: `center` }} color={`secondary`}>
                                    <TimeAgo timestamp={time}></TimeAgo>
                                </IonNote>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
            <ViewReportModal onDidDismiss={() => setviewReport(false)} isOpen={viewReport}></ViewReportModal>
            {/* <ReportStatistics></ReportStatistics> */}
        </div>
    )
}


export default ReportCard

export const UserAvatar: React.FC = () => {

    const arrayWithColors = [
        '#2ecc71',
        '#3498db',
        '#8e44ad',
        '#e67e22',
        '#e74c3c',
        '#1abc9c',
        '#2c3e50'
    ];

    return (
        <LetterAvatar
            name="Lettered Avatar"
            size={57}
            // radius={20}
            color="#fff"
            // backgroundColor="rgb(55,55,22)"
            backgroundColors={arrayWithColors}
        />
    )
}