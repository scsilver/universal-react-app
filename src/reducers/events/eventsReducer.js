import actionTypes from "../../constants/actionTypes";

import tripsReducer from "./trips/tripsReducer";
import plansReducer from "./plans/plansReducer";
import placesOfStayReducer from "./placesOfStay/placesOfStayReducer";

const initialState = {
  trips: tripsReducer(undefined, { type: null }),
  plans: plansReducer(undefined, { type: null }),
  placesOfStay: placesOfStayReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRIPS_CREATE_TRIP:
      return { ...state, trips: tripsReducer(state.trips, action) };

    case actionTypes.TRIP_DIRECTIONS_REQUEST:
      return { ...state };

    default:
      return state;
  }
};
