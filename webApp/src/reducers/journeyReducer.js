import actionTypes from "../constants/actionTypes";

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
    case actionTypes.TRIP_DIRECTIONS_REQUEST:
      return { ...state };

    default:
      return state;
  }
};
