import { actionInterface } from "../../interfaces/redux"
import { UserInterface } from "../../interfaces/users"
import { UPDATE_USER } from "../constants"

const init:UserInterface | any={}

const userReducer=(state=init, action:actionInterface)=>{
   
      switch(action.type){
          case UPDATE_USER: return action.payload

          default : return state;
      }
}


export const selectUser=(state:any)=>state.userReducer


export default userReducer;