
import React, { useEffect, useState } from "react";
import ClassifiedItemModal, { CalculateDistanceKm } from "./itemmodal";
import "./style.css";
import "../../pages/style/Classifieds.css";
import { classifiedItemInterface } from "../../interfaces/classifiedItems";
import { useSelector } from "react-redux";
import { selectLocation } from "../../states/reducers/location-reducer";
import { Currency, selectCurrency } from "../../states/reducers/currency_reducer";
import { selectCountry } from "../../states/reducers/countryReducer";
import { countryInfoInterface } from "../../interfaces/country";


const ClassifiedItem: React.FC<{ item: classifiedItemInterface }> = ({ item }) => {
 
    const user_location: { long: number, lat: number } = useSelector(selectLocation)
    const [viewItem, setviewItem] = useState(false)
    const [distance, setdistance] = useState(getDistance())
    const currency_state: Currency = useSelector(selectCurrency)
    const countryInfo: countryInfoInterface = useSelector(selectCountry)
    const [cost_value, setcost_value] = useState(``);

    useEffect(() => {
        const newCurrency:Currency={
            ...currency_state,
            name:`FCFA`
        }
        if (cost_value == `` && countryInfo.country.toLowerCase() == `za`) {
            setcost_value(getCostValue(currency_state, item.item_cost));
            return;
        }
        if (cost_value == `` && countryInfo.country.toLowerCase() == `cm`) {
            setcost_value(getCostValue(newCurrency, item.item_cost));
            return;
        }
        else if(cost_value == `` ){
            setcost_value(getCostValue({...newCurrency, name:`$`}, item.item_cost));
            return;
        }
        setcost_value(getCostValue(currency_state, item.item_cost));
        // console.log(getCostValue(currency_state, item.item_cost))

    }, [currency_state])

    function getDistance(){
        if(!item?.item_location){
            return 3000;
        }
        return Math.round(CalculateDistanceKm(item?.item_location||{long:4.3,lat:3.3}, user_location))
    }

    if (!item) {
        return <></>
    }
    return (
        <>
            <div onClick={() => setviewItem(true)} className="card">
                <img style={{ minHeight: `20vh` }} src={item.item_images[0]}  ></img>
                <div className="info">
                    <span className="label">{item.item_name}</span>
                    {item.item_features.length > 0 && <span className="desc">{item.item_features[0].substr(0, 20)}</span>}
                    <span style={{ color: `var(--ion-color-secondary)` }} className="desc">{(distance) > 0 ? distance + `km from you` : `few meters from you`} </span>
                    <span className="price">{cost_value}</span>
                </div>
            </div>
            <ClassifiedItemModal distance={distance} item={item} onDidDismiss={() => { setviewItem(false) }} isOpen={viewItem}></ClassifiedItemModal>
        </>
    )
}

export default ClassifiedItem

function extractCurrency(str: string): { currency: string, value: string } {
    const numbers = `123456780`
    let value = ``
    let currency = ``
    for (let index = 0; index < str.length; index++) {
        if (numbers.indexOf(str[index]) >= 0) {
            value += str[index];
        }
        else {
            currency += str[index];
        }
    }
    return ({
        value,
        currency
    })
}

function encodeCurrency(value: string, currency: string): string {

    if (currency.match(`CFA`)) {
        return value + ` ` + currency
    }
    return currency + value
}

function getCostValue(current_currency: Currency, cost: string): string {
    const currency_value = extractCurrency(cost);

    return encodeCurrency(currency_value.value, current_currency.name);
}