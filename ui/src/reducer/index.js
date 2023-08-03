import { combineReducers } from "redux";
import currentRouteReducer from "./currentRouteReducer";
import authenticatedReducer from "./authenticatedReducer";
import sensorHistoryReducer from "./sensorHistoryReducer";
import entitiesReducer from "./entitiesReducer";
import userReducer from "./userReducer";
import caseEditorOpenReducer from "./caseEditorOpenReducer";


const reducer = combineReducers({
   authenticated: authenticatedReducer,
   currentRoute: currentRouteReducer,
   sensorHistory: sensorHistoryReducer,
   entities: entitiesReducer,
   user: userReducer,
   caseEditorOpen: caseEditorOpenReducer
});

export default reducer;