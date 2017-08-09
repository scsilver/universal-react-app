import actionTypes from "../../../../constants/actionTypes";
import autoSuggestReducer from "./autoSuggest/autoSuggestReducer";
import dateTimeReducer from "./dateTime/dateTimeReducer";
const initialState = {
  autoSuggest: autoSuggestReducer(undefined, { type: null }),
  dateTime: dateTimeReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
