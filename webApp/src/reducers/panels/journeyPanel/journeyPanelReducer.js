import actionTypes from "../../../constants/actionTypes";
import moment from "moment";
const initialState = {
  expanded: true,
  startDate: moment(),
  endDate: moment().add(7, "days")
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHIFT_JOURNEY_PANEL_DATE_RANGE:
      {
        const range = state.endDate.diff(state.startDate, "minutes");
        const deltaToMinutes = Math.sign(action.delta) * range / 10;

        const newStartDate = moment(state.startDate).add(
          deltaToMinutes,
          "minutes"
        );

        const newEndDate = moment(state.endDate).add(deltaToMinutes, "minutes");
        return {
          ...state,
          startDate: newStartDate,
          endDate: newEndDate
        };
      }
      break;

    case actionTypes.ZOOM_JOURNEY_PANEL_DATE_RANGE:
      {
        const range = state.endDate.diff(state.startDate, "minutes");
        const deltaToMinutes = Math.sign(action.delta) * range / 10;
        const newStartDate = moment(state.startDate).add(
          deltaToMinutes,
          "minutes"
        );
        const newEndDate = moment(state.endDate).add(
          -deltaToMinutes,
          "minutes"
        );
        return {
          ...state,
          startDate: newStartDate,
          endDate: newEndDate
        };
      }
      break;
    default:
      return state;
  }
};
