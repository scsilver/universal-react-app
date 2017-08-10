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
  debugger;

  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
      debugger;

      return { ...state, panels: panelsReducer(state.panels, action) };
    case actionTypes.TRIPS_CREATE_TRIP:
      debugger;

      return { ...state, events: eventsReducer(state.events, action) };

    default:
      return state;
  }
};
