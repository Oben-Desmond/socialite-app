import { IonAvatar, IonBackdrop, IonBadge, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from "@ionic/react";
import { add, banOutline, checkmarkDone, close, people, peopleOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LetterAvatar from "../LetterAvatar";
import ReportStatistics from "./report-statistics";
import ViewReportModal from "./ViewReportModal";
import TimeAgo from '../timeago';
import { reportInterface } from "../../interfaces/reportTypes";
import { UserInterface } from "../../interfaces/users";
import { selectUser } from "../../states/reducers/userReducers";
import { useSelector } from "react-redux";



interface stylesInterface {
    grid: React.CSSProperties
}




const styles: stylesInterface = {
    grid: {

    }
}


const ReportCard: React.FC<{ report: reportInterface }> = ({ report }) => {
    const [viewReport, setviewReport] = useState(false);
    const user: UserInterface = useSelector(selectUser)
    const [seen, setseen] = useState(false)
    console.log(user.email, report.author);
    useEffect(() => {
        setseen((report.seenBy || []).filter(item => (item.code == `010001`)).length > 0);

    }, [report])

    return (
        <div>
            <IonItem disabled={!report.location && !report.author && report.images.length <= 0} onClick={() => setviewReport(true)}>
                <IonGrid>
                    <IonRow>
                        <IonCol className={`ion-align-self-centuser.photoUrler`}>
                            {report.author && <>
                                {(report.photoUrl || (user.photoUrl && user.email == report.author)) ? <IonAvatar style={{width:'50px', height:'50px'}}>
                                    <IonImg src={report.photoUrl || user.photoUrl} />
                                </IonAvatar> : <UserAvatar name={report.author} ></UserAvatar>}</>}
                            {
                                !report.author && <IonIcon size={`large`} icon={banOutline} />
                            }
                        </IonCol>
                        <IonCol className={`ion-align-self-center ion-text-capitalize`} >
                            <IonRow>
                                <div >
                                    <IonLabel>{report.author}</IonLabel>
                                </div>
                                <div style={{ height: `30px` }}></div>
                                <div>
                                    <IonLabel>{report.category}</IonLabel>
                                </div>
                            </IonRow>
                            <IonRow>
                                <IonNote>
                                    {report.description.substr(0, 100).trim()}...
                                </IonNote>
                            </IonRow>
                        </IonCol>
                        <IonCol className={`ion-align-self-center ion-text-center`}>
                            <IonRow style={{ textAlign: `center` }}>
                                {(!seen && user.email !== report.author) && <IonCol>
                                    <IonBadge color={`success`}><div style={{ width: `4px`, height: `4px` }}></div> </IonBadge>
                                    {/* <IonIcon color={`success`} icon={checkmarkDone}></IonIcon> */}
                                </IonCol>}
                            </IonRow>
                            <IonRow className={`ion-text-center`}>
                                <IonNote className={`ion-text-center`} style={{ textAlign: `center` }} color={`secondary`}>
                                    <TimeAgo timestamp={report.timestamp}></TimeAgo>
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

export const UserAvatar: React.FC<{ name: string }> = ({ name }) => {

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
        <div style={{transform:'scale(0.8)'}}>
            <LetterAvatar
                name={name.trim()[0]}
                size={50}
                // radius={20}
                color="#fff"
                // backgroundColor="rgb(55,55,22)"
                backgroundColors={arrayWithColors}
            />
        </div>
    )
}