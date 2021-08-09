import { IonSlide, IonImg, IonModal, IonFab, IonFabButton, IonIcon, IonBackdrop } from "@ionic/react";
import { trashOutline, arrowBack } from "ionicons/icons";
import React from "react";
 

const ImageSlide:React.FC<{img:string, deleteItem:()=>void}>=({img, deleteItem})=>{

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
            <IonFab  onClick={()=>{
                    setviewImage(false);
                    deleteItem();
                    }}  horizontal={`end`} vertical={`bottom`}>
                <IonFabButton color={`danger`}>
                    <IonIcon icon={trashOutline}></IonIcon>
                </IonFabButton>
            </IonFab>
            <IonFab horizontal={`start`} vertical={`bottom`}>
                <IonBackdrop></IonBackdrop> 
                   
                <IonFabButton color={`secondary`}>
                    <IonIcon icon={arrowBack}></IonIcon>
                </IonFabButton>
            </IonFab>
        </IonModal>

        </div>
    )
}


export default ImageSlide