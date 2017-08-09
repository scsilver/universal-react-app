import actionTypes from "../../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  index: 0,
  filters: {
    route: null
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
    case actionTypes.TRIP_FILTERS_UPDATE_ROUTES: {
      return newState;
    }
    default:
      return state;
  }
};
