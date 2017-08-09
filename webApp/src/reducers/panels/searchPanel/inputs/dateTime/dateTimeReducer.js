import actionTypes from "../../../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  originDeparture: moment(),
  destinationArrival: moment()
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
