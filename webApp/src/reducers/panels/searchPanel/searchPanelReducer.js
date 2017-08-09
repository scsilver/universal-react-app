import actionTypes from "../../../constants/actionTypes";
import inputsReducer from "./inputs/inputsReducer";
const initialState = {
  expanded: true,
  inputs: inputsReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
