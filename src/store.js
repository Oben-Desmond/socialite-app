import { combineReducers, createStore } from "redux";
import userReducer from "./states/reducers/userReducers";
import countryReducer from "./states/reducers/countryReducer";



const Reducers= combineReducers({userReducer, countryReducer})
const store = createStore(Reducers, {})


export default store ;