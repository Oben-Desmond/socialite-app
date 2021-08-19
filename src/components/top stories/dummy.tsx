import { IonSkeletonText } from "@ionic/react";
import React from "react";
import   "../styles/skeletons.css";


const SkeletonHome: React.FC = () => {
    return (
        <div className="home-skeleton">
            <SkeletonWidget></SkeletonWidget>
            <SkeletonWidget></SkeletonWidget>
            <SkeletonWidget></SkeletonWidget>
            <SkeletonWidget></SkeletonWidget>
            <SkeletonWidget></SkeletonWidget>
            <SkeletonWidget></SkeletonWidget>
        </div>
    )
}

export default SkeletonHome


const SkeletonWidget = () => {
    return (
        <div className={`home-skeleton-widget`}>
            <SkeletonHeader></SkeletonHeader>
            <IonSkeletonText className={`title`}></IonSkeletonText>
            <IonSkeletonText animated className={`description`}></IonSkeletonText>
            <IonSkeletonText className={`description`}></IonSkeletonText>
        </div>
    )
}

export const SkeletonHeader= ()=>{
  return<IonSkeletonText className={`head`}></IonSkeletonText>
}
