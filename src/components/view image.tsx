import { IonSlide, IonImg, IonModal, IonFab, IonFabButton, IonIcon, IonBackdrop } from "@ionic/react";
import { trashOutline, arrowBack, close } from "ionicons/icons";
import React from "react";
 

const ViewImage:React.FC<{img:string}>=({img})=>{

    const [viewImage, setviewImage] = React.useState(false)

    return(
        <div>
        <IonSlide  onClick={()=>setviewImage(true)} style={{display:`block`}}>
        <IonImg className={`ion-padding-start`} src={img}/>
        </IonSlide>
        <IonModal cssClass={`view-img`} isOpen={viewImage} onDidDismiss={()=>{setviewImage(false)}}>
            <IonSlide>
                <img style={{width:`100%`}} src={img}/>
            </IonSlide>
         
            <IonFab horizontal={`center`} vertical={`bottom`}>
                <IonBackdrop></IonBackdrop> 
                   
                <IonFabButton color={`secondary`}>
                    <IonIcon icon={close}></IonIcon>
                </IonFabButton>
            </IonFab>
        </IonModal>

        </div>
    )
}


export default ViewImage