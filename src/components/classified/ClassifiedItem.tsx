
import React, { useState } from "react";
import ClassifiedItemModal, { CalculateDistanceKm } from "./itemmodal";
import "./style.css";
import "../../pages/style/Classifieds.css";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";


const ClassifiedItem: React.FC<{ item: classifiedItemInterface }> = ({ item }) => {

    const [viewItem, setviewItem] = useState(false)
    return (
        <>
            <div onClick={() => setviewItem(true)} className="card">
                <img src={item.item_images[0]}  ></img>
                <div className="info">
                    <span className="label">{item.item_name}</span>
                    {item.item_features.length > 0 && <span className="desc">{item.item_features[0].substr(0,20)}</span>}
                    <span className="price">{item.item_cost}</span>
                </div>
            </div>
            <ClassifiedItemModal distance={CalculateDistanceKm({long:0.2839,lat:7.8989},item.item_location)} item={item} onDidDismiss={() => { setviewItem(false) }} isOpen={viewItem}></ClassifiedItemModal>
        </>
    )
}

export default ClassifiedItem