import { combineReducers, createStore } from "redux";
import userReducer from "./states/reducers/userReducers";
import countryReducer from "./states/reducers/countryReducer";
import locationReducer from "./states/reducers/location-reducer";
import ClassifiedReviewsReducer from "./states/reducers/reviews-reducer";
import favoritesReducer from "./states/reducers/favoritesReducer";


const Reducers= combineReducers({userReducer, countryReducer, locationReducer, ClassifiedReviewsReducer,  favoritesReducer})
const store = createStore(Reducers, {})


export default store ;