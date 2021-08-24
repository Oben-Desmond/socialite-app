import { countryInfoInterface } from "../../interfaces/country"
import { actionInterface } from "../../interfaces/redux"
import { UPDATE_COUNTRY_INFO } from "../constants"

const init:countryInfoInterface | any={}

const countryReducer=(state=init, action:actionInterface)=>{
   
      switch(action.type){
          case  UPDATE_COUNTRY_INFO: return action.payload

          default : return state;
      }
}


export const selectCountry=(state:any)=> state.countryReducer

export default countryReducer;