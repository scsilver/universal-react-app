import actionTypes from "../../../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  value: "paris",
  suggestions: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
      return {
        ...state,
        value: action.value
      };
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.suggestions
      };

    default:
      return state;
  }
};
