import actionTypes from "../../../../../constants/actionTypes";
import moment from "moment";
import destinationReducer from "./destinationReducer";
import originReducer from "./originReducer";
const initialState = {
  origin: originReducer(undefined, () => {
    type: null;
  }),

  destination: destinationReducer(undefined, () => {
    type: null;
  })
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST:
      return action.autoSuggest;
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE:
      return {
        ...state,
        destination: destinationReducer(state.destination, action)
      };
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS:
    case actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE:
      return {
        ...state,
        origin: originReducer(state.origin, action)
      };

    default:
      return state;
  }
};
