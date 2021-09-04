import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonList, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from "@ionic/react";
import { close, people, peopleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LetterAvatar from "../LetterAvatar";
import ViewReportModal from "./ViewReportModal";


interface stylesInterface {
    grid: React.CSSProperties
}




const styles: stylesInterface = {
    grid: {

    }
}


const ReportCard: React.FC = () => {
    const [viewReport, setviewReport] = useState(false);

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
                        <IonCol className={`ion-align-self-end`}>
                            <IonNote color={`secondary`}>2:00PM</IonNote>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
           <ViewReportModal onDidDismiss={() => setviewReport(false)} isOpen={viewReport}></ViewReportModal>
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