import actionTypes from "../../constants/actionTypes";
import actions from "../../actions/journeyActions";

import tripsPanelReducer from "./tripsPanel/tripsPanelReducer";
import searchPanelReducer from "./searchPanel/searchPanelReducer";
import suggestionsPanelReducer from "./suggestionsPanel/suggestionsPanelReducer";

const initialState = {
  tripsPanel: tripsPanelReducer(undefined, { type: null }),
  searchPanel: searchPanelReducer(undefined, { type: null }),
  suggestionsPanel: suggestionsPanelReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
      return {
        ...state,
        searchPanel: searchPanelReducer(state.searchPanel, action)
      };
    default:
      return state;
  }
};
