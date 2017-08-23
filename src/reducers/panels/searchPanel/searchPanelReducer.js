import actionTypes from "../../../constants/actionTypes";
import inputsReducer from "./inputs/inputsReducer";
import actions from "../../../actions/journeyActions";

const initialState = {
  expanded: true,
  inputs: inputsReducer(undefined, { type: null })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_INPUTS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
      return { ...state, inputs: inputsReducer(state.inputs, action) };
    default:
      return state;
  }
};
