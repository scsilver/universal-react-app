import actionTypes from "../../constants/actionTypes";

import tripsReducer from "./trips/tripsReducer";
import plansReducer from "./plans/plansReducer";
import placesOfStayReducer from "./placesOfStay/placesOfStayReducer";

const initialState = {
  trips: tripsReducer(undefined, {}),
  plans: plansReducer(undefined, {}),
  placesOfStay: placesOfStayReducer(undefined, {})
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRIP_DIRECTIONS_REQUEST:
      return { ...state };

    default:
      return state;
  }
};
