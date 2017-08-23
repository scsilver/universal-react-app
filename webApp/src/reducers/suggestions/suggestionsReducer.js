import actionTypes from "../../constants/actionTypes";

import tripsReducer from "./trips/tripsReducer";
import plansReducer from "./plans/plansReducer";
import placesOfStayReducer from "./placesOfStay/placesOfStayReducer";

const initialState = {
  cities: [],

  trips: tripsReducer(undefined, { type: null }),
  plans: plansReducer(undefined, { type: null }),
  placesOfStay: placesOfStayReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case actionTypes.SUGGESTED_CITIES_REQUEST:
      return { ...state, cities: action.cities };

    case actionTypes.SUGGESTED_TRIPS_REQUEST:
      return { ...state, trips: action.trips };

    default:
      return state;
  }
};
