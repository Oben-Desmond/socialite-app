import { combineReducers, createStore } from "redux";
import userReducer from "./states/reducers/userReducers";
import countryReducer from "./states/reducers/countryReducer";
import locationReducer from "./states/reducers/location-reducer";
import ClassifiedReviewsReducer from "./states/reducers/reviews-reducer";
import favoritesReducer from "./states/reducers/favoritesReducer";
import serviceReducer from "./states/reducers/service-reducer";
import NotificationReducer from "./states/reducers/InAppNotifications";


const Reducers= combineReducers({userReducer, countryReducer, locationReducer, ClassifiedReviewsReducer,  favoritesReducer, serviceReducer, NotificationReducer})
const store = createStore(Reducers, {})


export default store ;