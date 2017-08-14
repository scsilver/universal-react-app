import actionTypes from "../../../../constants/actionTypes";
import moment from "moment";

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
  tripSettings: {
    origin: "",
    destination: "",
    travelMode: "TRANSIT",
    color: "",
    transitOptions: {
      departureTime: moment(),
      arrivalTime: moment()
    }
  },
  routes: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRIPS_CREATE_TRIP:
      {
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
