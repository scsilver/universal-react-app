import actionTypes from "../../../constants/actionTypes";

import tripReducer from "./trip/tripReducer";

const initialState = [];
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRIPS_CREATE_TRIP:
      {
        debugger;
        const createdTrip = tripReducer(null, action);
        const newState = [...state, createdTrip];
        return [...newState];
      }
      break;
    case actionTypes.TRIPS_UPDATE_TRIP:
      {
        const updatedTripIndex = action.updatedTrip.index;
        const newState = [
          ...state.slice(0, updatedTripIndex - 1),
          action.updatedTrip,
          ...state.slice(updatedTripIndex + 1)
        ];
        const newStateWithNewIndexs = newState.map((trip, index) => {
          return { ...trip, index };
        });

        return [...newStateWithNewIndexs];
      }
      break;
    case actionTypes.TRIPS_DELETE_TRIP:
      {
        const deletedTripIndex = action.deletedTrip.index;

        const newState = [
          ...state.slice(0, deletedTripIndex - 1),
          ...state.slice(deletedTripIndex + 1)
        ];
        const newStateWithNewIndexs = newState.map((trip, index) => {
          return { ...trip, index };
        });
        return [...newStateWithNewIndexs];
      }
      break;
    default:
      return state;
  }
};
