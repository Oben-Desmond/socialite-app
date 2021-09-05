import { IonAvatar, IonBackdrop, IonBadge, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from "@ionic/react";
import { add, checkmarkDone, close, people, peopleOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LetterAvatar from "../LetterAvatar";
import ReportStatistics from "./report-statistics";
import ViewReportModal from "./ViewReportModal";
import TimeAgo from '../timeago';
import { reportInterface } from "../../interfaces/reportTypes";



interface stylesInterface {
    grid: React.CSSProperties
}




const styles: stylesInterface = {
    grid: {

    }
}


const ReportCard: React.FC<{report:reportInterface}> = ({report}) => {
    const [viewReport, setviewReport] = useState(false);
    const [seen, setseen] = useState(false)
    const [time] = useState(Date.now())
    useEffect(() => {
         setseen((report.seenBy || []).indexOf(`010001`)>=0)
    }, [report])
  
    return (
        <div>
            <IonItem onClick={() => setviewReport(true)}>
                <IonGrid>
                    <IonRow>
                        <IonCol className={`ion-align-self-start`}>
                           {report.photoUrl&& <IonAvatar>
                                <IonImg src={report.photoUrl} />
                            </IonAvatar>}
                           {!report.photoUrl&& <UserAvatar name={report.author} ></UserAvatar>}
                        </IonCol>
                        <IonCol className={`ion-align-self-center ion-text-capitalize`} >
                            <IonRow>
                                <div >
                                    <IonLabel>{report.author}</IonLabel>
                                </div>
                                <div style={{height:`30px`}}></div>
                                <div>
                                    <IonLabel>{report.category}</IonLabel>
                                </div>
                            </IonRow>
                            <IonRow>
                                <IonNote>
                                   {report.description}
                                </IonNote>
                            </IonRow>
                        </IonCol>
                        <IonCol className={`ion-align-self-center ion-text-center`}>
                            <IonRow style={{ textAlign: `center` }}>
                               {!seen&& <IonCol>
                                    <IonBadge color={`success`}><div style={{ width: `4px`, height: `4px` }}></div> </IonBadge>
                                    {/* <IonIcon color={`success`} icon={checkmarkDone}></IonIcon> */}
                                </IonCol>}
                            </IonRow>
                            <IonRow   className={`ion-text-center`}>
                                <IonNote className={`ion-text-center`} style={{ textAlign: `center` }} color={`secondary`}>
                                    <TimeAgo timestamp={time}></TimeAgo>
                                </IonNote>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
            <ViewReportModal report={report} onDidDismiss={() => setviewReport(false)} isOpen={viewReport}></ViewReportModal>
            {/* <ReportStatistics></ReportStatistics> */}
        </div>
    )
}


export default ReportCard

export const UserAvatar: React.FC<{name:string}> = ({name}) => {

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
            name={name.trim()[0]}
            size={57}
            // radius={20}
            color="#fff"
            // backgroundColor="rgb(55,55,22)"
            backgroundColors={arrayWithColors}
        />
    )
}