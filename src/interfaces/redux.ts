import { classifiedItemInterface } from "./classifiedItems";
import { countryInfoInterface } from "./country";
import { UserInterface } from "./users";

export interface actionInterface{
      type:string,
      payload:any,
}


export interface StoreStateInteface{
      userReducer:UserInterface,
      countryReducer:countryInfoInterface,
      classifiedItemReducer:any
}