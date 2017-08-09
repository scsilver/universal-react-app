import { combineReducers } from "redux";
import journeyReducer from "./journeyReducer";
import { routerReducer } from "react-router-redux";

const rootReducer = combineReducers({
  journeyReducer,
  routing: routerReducer
});

export default rootReducer;
