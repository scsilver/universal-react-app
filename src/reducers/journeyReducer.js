import actionTypes from "../constants/actionTypes";
import actions from "../actions/journeyActions";

import eventsReducer from "./events/eventsReducer";
import suggestionsReducer from "./suggestions/suggestionsReducer";
import mapReducer from "./map/mapReducer";
import panelsReducer from "./panels/panelsReducer";
import notificationsReducer from "./notifications/notificationsReducer";

const initialState = {
  events: eventsReducer(undefined, {}),
  suggestions: suggestionsReducer(undefined, {}),
  map: mapReducer(undefined, {}),
  panels: panelsReducer(undefined, {}),
  notifications: notificationsReducer(undefined, {})
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_INPUTS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
    case actionTypes.SHIFT_JOURNEY_PANEL_DATE_RANGE:
    case actionTypes.ZOOM_JOURNEY_PANEL_DATE_RANGE:
      return { ...state, panels: panelsReducer(state.panels, action) };
    case actionTypes.TRIPS_CREATE_TRIP:
      return { ...state, events: eventsReducer(state.events, action) };
    case actionTypes.SUGGESTED_TRIPS_REQUEST:
    case actionTypes.SUGGESTED_CITIES_REQUEST:
      return {
        ...state,
        suggestions: suggestionsReducer(state.suggestions, action)
      };

    default:
      return state;
  }
};
