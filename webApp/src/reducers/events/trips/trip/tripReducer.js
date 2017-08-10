import actionTypes from "../../../../constants/actionTypes";
import moment from "moment";
const blue = "#324D5C";
const green = "#46B29D";
const yellow = "#F0CA4D";
const orange = "#E37B40";
const red = "#DE5B49";
// const colorGenerator = ({ index }) => {
//   const colors = [blue, green, yellow, orange, red];
//   return colors[index];
// };
const initialState = {
  index: 0,
  // color: colorGenerator({ index: state.trips.length }),
  filters: {
    route: 0
  },
  settings: {
    origin: "",
    destination: "",
    travelMode: "TRANSIT",
    transitOptions: {
      departureTime: moment(),
      arrivalTime: moment()
    }
  },
  routes: []
};
export default (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case actionTypes.TRIPS_CREATE_TRIP:
      {
        debugger;
        const newState = {
          ...state,
          ...action.trip
        };
        return newState;
      }
      break;
    case actionTypes.TRIPS_UPDATE_TRIP: {
      return newState;
    }
    default:
      return state;
  }
};
