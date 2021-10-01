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
import ReportersModal from "./ReportersModal";
import LetteredAvatar from "../LetterAvatar";



interface stylesInterface {
    grid: React.CSSProperties
}




const styles: stylesInterface = {
    grid: {

    }
}


const ReportersCard: React.FC<{ report: reportInterface }> = ({ report }) => {
    const [viewReport, setviewReport] = useState(false);
    const user: UserInterface = useSelector(selectUser)
    const [seen, setseen] = useState(false)
    console.log(user.email, report.author);
    useEffect(() => {
        setseen((report.seenBy || []).filter(item => (item.code == `010001`)).length > 0);

    }, [report])

    return (
        <div className='ion-padding-top'>
            <IonItem disabled={!report.location && !report.author && report.images.length <= 0} onClick={() => setviewReport(true)} button >
                {report.author ? <Avatar name={report.author.trim()} photoUrl={report.photoUrl} usePicture={!!report.photoUrl} ></Avatar> : <IonIcon size={`large`} icon={banOutline} />}
                <IonNote><b>{report.author}</b> sent a report <b><i>"{report.description}"</i></b></IonNote>
                <IonNote className={`ion-margin-start`}>
                    <TimeAgo timestamp={report.timestamp}></TimeAgo>
                </IonNote>
            </IonItem>
            {/* <ReportStatistics></ReportStatistics> */}
            <ReportersModal report={report} onDidDismiss={() => setviewReport(false)} isOpen={viewReport}></ReportersModal>
            {/* <ReportStatistics></ReportStatistics> */}
        </div>
    )
}


export function Avatar(props: { usePicture: boolean, photoUrl: string, name: string }) {
    const { usePicture, name, photoUrl } = props
    return (
        <> {usePicture ? <IonAvatar slot={`start`}>
            <IonImg src={photoUrl} />
        </IonAvatar> : <div style={{ marginBottom: 5, marginRight: 10, transform: 'translateY(-5px) scale(0.8)' }} >
            <LetteredAvatar name={name[0]} ></LetteredAvatar>
        </div>}</>
    )
}



export default ReportersCard

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