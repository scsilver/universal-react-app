import actionTypes from "../../../../constants/actionTypes";
import autoSuggestReducer from "./autoSuggest/autoSuggestReducer";

import dateTimeReducer from "./dateTime/dateTimeReducer";
const initialState = {
  autoSuggest: autoSuggestReducer(undefined, { type: null }),
  dateTime: dateTimeReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
      return { ...state, autoSuggest: action.autoSuggest };
      break;
    default:
      return state;
  }
};
