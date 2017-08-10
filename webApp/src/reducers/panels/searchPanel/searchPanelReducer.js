import actionTypes from "../../../constants/actionTypes";
import inputsReducer from "./inputs/inputsReducer";
import actions from "../../../actions/journeyActions";

const initialState = {
  expanded: true,
  inputs: inputsReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
      return { ...state, inputsReducer: inputsReducer(state.inputs, action) };
    default:
      return state;
  }
};
