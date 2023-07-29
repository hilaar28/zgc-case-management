
import { ACTION_TYPES } from "../constants";


export default function sensorHistoryReducer(state=null, action) {

   if (action.type === ACTION_TYPES.SET_SENSOR_HISTORY)
      return action.payload;

   return state;
}