import actionTypes from "../../constants/actionTypes";

import tripsPanelReducer from "./tripsPanel/tripsPanelReducer";
import searchPanelReducer from "./searchPanel/searchPanelReducer";
import suggestionsPanelReducer from "./suggestionsPanel/suggestionsPanelReducer";

const initialState = {
  tripsPanel: tripsPanelReducer(undefined, {}),
  searchPanel: searchPanelReducer(undefined, {}),
  suggestionsPanel: suggestionsPanelReducer(undefined, {})
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
