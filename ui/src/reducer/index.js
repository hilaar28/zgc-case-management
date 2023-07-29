import { combineReducers } from "redux";
import currentRouteReducer from "./currentRouteReducer";
import authenticatedReducer from "./authenticatedReducer";
import sensorHistoryReducer from "./sensorHistoryReducer";
import entitiesReducer from "./entitiesReducer";


const reducer = combineReducers({
   authenticated: authenticatedReducer,
   currentRoute: currentRouteReducer,
   sensorHistory: sensorHistoryReducer,
   entities: entitiesReducer
});

export default reducer;