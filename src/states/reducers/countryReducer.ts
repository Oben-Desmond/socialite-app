import { countryInfoInterface } from "../../interfaces/country"
import { actionInterface } from "../../interfaces/redux"
import { UPDATE_COUNTRY_INFO } from "../constants"

const init:countryInfoInterface | any={}

const userReducer=(state=init, action:actionInterface)=>{
   
      switch(action.type){
          case  UPDATE_COUNTRY_INFO: return action.payload

          default : return state;
      }
}


export default userReducer;