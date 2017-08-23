import actionTypes from "../../constants/actionTypes";
import actions from "../../actions/journeyActions";

import tripsPanelReducer from "./tripsPanel/tripsPanelReducer";
import searchPanelReducer from "./searchPanel/searchPanelReducer";
import suggestionsPanelReducer from "./suggestionsPanel/suggestionsPanelReducer";
import journeyPanelReducer from "./journeyPanel/journeyPanelReducer";

const initialState = {
  tripsPanel: tripsPanelReducer(undefined, { type: null }),
  searchPanel: searchPanelReducer(undefined, { type: null }),
  suggestionsPanel: suggestionsPanelReducer(undefined, { type: null }),
  journeyPanel: journeyPanelReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_INPUTS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
      return {
        ...state,
        searchPanel: searchPanelReducer(state.searchPanel, action)
      };
    case actionTypes.SHIFT_JOURNEY_PANEL_DATE_RANGE:
    case actionTypes.ZOOM_JOURNEY_PANEL_DATE_RANGE:
      return {
        ...state,
        journeyPanel: journeyPanelReducer(state.journeyPanel, action)
      };
    default:
      return state;
  }
};
