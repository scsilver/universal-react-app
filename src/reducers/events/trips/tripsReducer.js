import actionTypes from "../../../constants/actionTypes";

import tripReducer from "./trip/tripReducer";
const blue = "#1A4F63";
const green = "#72B556";
const yellow = "#FFC628";
const orange = "#FC643D";
const teal = "#068587";
const red = "#FC643D";
const colorGenerator = ({ index }) => {
  const colors = [blue, teal, green, yellow, orange, red];
  return colors[index];
};
const initialState = [];
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRIPS_CREATE_TRIP:
      {
        const newTripId = state.length;
        const createdTrip = tripReducer(
          { id: newTripId, color: colorGenerator({ index: newTripId }) },
          action
        );
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
