import actionTypes from "../../../../constants/actionTypes";
import autoSuggestReducer from "./autoSuggest/autoSuggestReducer";

import dateTimeReducer from "./dateTime/dateTimeReducer";
const initialState = {
  autoSuggest: autoSuggestReducer(undefined, { type: null }),
  dateTime: dateTimeReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_INPUTS:
      return action.inputs;
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
      return {
        ...state,
        autoSuggest: autoSuggestReducer(state.autoSuggest, action)
      };

    default:
      return state;
  }
};
