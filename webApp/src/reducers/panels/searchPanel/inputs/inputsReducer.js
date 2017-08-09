import actionTypes from "../../../../constants/actionTypes";
import autoSuggestReducer from "./autoSuggest/autoSuggestReducer";
import dateTimeReducer from "./dateTime/dateTimeReducer";
const initialState = {
  autoSuggest: autoSuggestReducer(undefined, {}),
  dateTime: dateTimeReducer(undefined, {})
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
