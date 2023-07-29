import { ACTION_TYPES } from "../constants";


export default function authenticatedReducer(state=false, action) {

   if (action.type === ACTION_TYPES.SET_AUTHENTICATED)
      return action.payload;

   return state;
}