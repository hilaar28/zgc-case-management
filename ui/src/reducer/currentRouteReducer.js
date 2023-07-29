import { ACTION_TYPES } from "../constants";


export default function currentRouteReducer(state='/', action) {

   if (action.type === ACTION_TYPES.SET_CURRENT_ROUTE)
      return action.payload;

   return state;
}