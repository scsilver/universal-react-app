import actionTypes from "../../../constants/actionTypes";
import inputsReducer from "./inputs/inputsReducer";
const initialState = {
  expanded: false,
  inputs: inputsReducer(undefined, {})
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
