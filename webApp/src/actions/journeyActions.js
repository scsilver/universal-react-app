import actionTypes from "../constants/actionTypes";
import lodash from "lodash";
import moment from "moment";
const actions = {
  searchPanelInputsUpdateAutoSuggest: ({ value, inputType, autoSuggest }) => {
    autoSuggest[inputType].value = value;
    return {
      type: actionTypes.INPUTS_UPDATE_AUTOSUGGEST,
      autoSuggest: autoSuggest
    };
  },
  tripDirectionsRequest: ({ tripDirections }) => ({
    type: actionTypes.TRIP_DIRECTIONS_REQUEST,
    tripDirections
  })
};
const thunks = {
  // example of a thunk using the redux-thunk middleware
  tripRequest: ({ inputs }) => {
    return dispatch => {
      const DirectionsService = new google.maps.DirectionsService();

      // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
      // in this case at this point we could call a service that would persist the fuel savings
      debugger;
      dispatch({
        type: actionTypes.NOTIFICATION_UPDATE_SPINNER,
        spinner: true
      });
      debugger;
      let newState = {};
      let newTrip = {
        filters: {
          route: 0
        },
        tripSettings: {
          origin: inputs.autoSuggest.origin.value,
          destination: inputs.autoSuggest.destination.value,
          travelMode: inputs.travelMode || "TRANSIT",
          transitOptions: {
            departureTime:
              inputs.dateTime.originDeparture.toDate() || moment().toDate(),
            arrivalTime:
              inputs.dateTime.destinationArrival.toDate() || moment().toDate()
          }
        },
        routes: []
      };
      const queryObj = {
        origin: newTrip.tripSettings.origin,
        destination: newTrip.tripSettings.destination,
        travelMode: newTrip.tripSettings.travelMode,
        transitOptions: {
          departureTime: newTrip.tripSettings.transitOptions.departureTime
        }
      };
      DirectionsService.route(queryObj, (res, status) => {
        const arrivalTime = lodash.get(
          res,
          `.routes[0].legs[0].arrival_time.value`,
          ""
        );
        newTrip.routes = res.routes;
        dispatch({
          type: actionTypes.UPDATE_INPUTS,
          inputs: {
            ...inputs,
            autocomplete: {
              origin: inputs.autoSuggest.destination.value,
              destination: ""
            },
            dateTime: {
              originDeparture: moment(inputs.dateTime.destinationArrival)
            }
          }
        });

        //
        dispatch({
          type: actionTypes.NOTIFICATION_UPDATE_SPINNER,
          spinner: false
        });

        // this.suggestedPlacesRequest({ location: suggestionLocation });
        dispatch({
          type: actionTypes.TRIPS_CREATE_TRIP,
          trip: newTrip
        });
      });
    };
  }
};

const a = { ...actions, ...thunks };
export default a;
