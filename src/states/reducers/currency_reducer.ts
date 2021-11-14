import { actionInterface } from "../../interfaces/redux";


export interface Currency{
    name:string,
    equivalent: Object
}
 

export const initial_state:Currency={
    name:"R",
    equivalent:{
        "R":1,
        "$":0.96,
        "FCFA":200,
        [`¥`]:100,
    }
}

const actions={

    update_currency:(payload:Currency):actionInterface=>{
        console.log(payload);
         
        return({
            payload,
            type:`update_currency`
        })
     }
}


export default function CurrencyReducer(state=initial_state, action:actionInterface  ){
            console.log(action.type);
            
        switch (action.type) {
            case `update_currency`: return action.payload;
               
            default: return state;
               
        }    
}

export const selectCurrency = (state:any)=>state.CurrencyReducer;

export const { update_currency } = actions