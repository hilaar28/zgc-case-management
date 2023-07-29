import { ACTION_TYPES } from "../constants";


export default function userReducer(state=null, action) {

   if (action.type === ACTION_TYPES.SET_USER)
      return action.payload;

   return state;
}