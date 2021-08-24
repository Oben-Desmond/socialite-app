
import React, { useState } from "react";
import ClassifiedItemModal, { CalculateDistanceKm } from "./itemmodal";
import "./style.css";
import "../../pages/style/Classifieds.css";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import { useSelector } from "react-redux";
import { selectLocation } from "../../states/reducers/location-reducer";


const ClassifiedItem: React.FC<{ item: classifiedItemInterface }> = ({ item }) => {
   
    const user_location:{long:number, lat:number} = useSelector(selectLocation)
    const [viewItem, setviewItem] = useState(false)
    const [distance, setdistance] =  useState(Math.round(CalculateDistanceKm(item.item_location,user_location)))
    if(!item){
        return <></>
    }
    return (
        <>
            <div onClick={() => setviewItem(true)} className="card">
                <img src={item.item_images[0]}  ></img>
                <div className="info">
                    <span className="label">{item.item_name}</span>
                    {item.item_features.length > 0 && <span className="desc">{item.item_features[0].substr(0,20)}</span>}
                    <span style={{color:`var(--ion-color-secondary)`}} className="desc">{(distance)>0?distance+`km from you`:`few meters from you`} </span>
                    <span className="price">{item.item_cost}</span>
                </div>
            </div>
            <ClassifiedItemModal distance={distance} item={item} onDidDismiss={() => { setviewItem(false) }} isOpen={viewItem}></ClassifiedItemModal>
        </>
    )
}

export default ClassifiedItem