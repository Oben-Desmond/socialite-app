import { combineReducers, createStore } from "redux";
import userReducer from "./states/reducers/userReducers";
import countryReducer from "./states/reducers/countryReducer";
import locationReducer from "./states/reducers/location-reducer";
import ClassifiedReviewsReducer from "./states/reducers/reviews-reducer";


const Reducers= combineReducers({userReducer, countryReducer, locationReducer, ClassifiedReviewsReducer})
const store = createStore(Reducers, {})


export default store ;