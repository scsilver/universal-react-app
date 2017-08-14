import actionTypes from "../../../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  value: "london",
  suggestions: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
      return {
        ...state,
        value: action.value
      };
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.suggestions
      };

    default:
      return state;
  }
};
