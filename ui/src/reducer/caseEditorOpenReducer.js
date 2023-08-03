import { ACTION_TYPES } from "../constants";


export default function caseEditorOpenReducer(state=false, action) {

   if (action.type === ACTION_TYPES.OPEN_CASE_EDITOR)
      return true;
   else if (action.type === ACTION_TYPES.CLOSE_CASE_EDITOR)
      return false;

   return state;
}