import actionTypes from "../../../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  origin: {
    value: "london",
    suggestions: []
  },
  destination: {
    value: "paris",
    suggestions: []
  }
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
