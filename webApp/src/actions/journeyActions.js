import actionTypes from "../constants/actionTypes";
import lodash from "lodash";
import moment from "moment";
import request from "superagent";
const blue = "#1A4F63";
const green = "#72B556";
const yellow = "#FFC628";
const orange = "#FC643D";
const teal = "#068587";
const red = "#FC643D";
const colorGenerator = ({ index }) => {
  const colors = [blue, teal, green, yellow, orange, red];
  return colors[index];
};
const suggestedPlacesRequest = ({ location, dispatch }) => {
  request
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat +
        "," +
        location.lng}&type=cities&radius=50000&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`
    )
    .end((err, res) => {
      if (!err) {
        dispatch({
          type: actionTypes.SUGGESTED_TRIPS_REQUEST,
          trips: res.body.results
        });
      }
    });
};
const actions = {
  shiftJourneyPanelDateRange: delta => ({
    type: actionTypes.SHIFT_JOURNEY_PANEL_DATE_RANGE,
    delta
  }),
  zoomJourneyPanelDateRange: delta => ({
    type: actionTypes.ZOOM_JOURNEY_PANEL_DATE_RANGE,
    delta
  }),
  tripDirectionsRequest: ({ tripDirections }) => ({
    type: actionTypes.TRIP_DIRECTIONS_REQUEST,
    tripDirections
  }),
  notificationUpdateSpinner: spinner => ({
    type: actionTypes.NOTIFICATION_UPDATE_SPINNER,
    spinner
  }),
  searchPanelInputsUpdateAutoSuggest: ({ value, inputType }) => ({
    type:
      inputType == "origin"
        ? actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE
        : actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE,
    value
  })
};
const thunks = {
  searchPanelInputsUpdateAutoSuggestRequest: ({
    value,
    inputType,
    autoSuggest
  }) => {
    return dispatch => {
      // switch (inputType) {
      //   case "destination":
      //     dispatch({
      //       type: actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_VALUE,
      //       value: value
      //     });

      //     break;
      //   case "origin":
      //     dispatch({
      //       type: actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_VALUE,
      //       value: value
      //     });
      //     break;
      //   default:
      //     break;
      // }

      request
        .get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${autoSuggest[
            inputType
          ].value}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`
        )
        .end((err, res) => {
          if (!err) {
            switch (inputType) {
              case "origin":
                const originPredictions = res.body.predictions.map(p => {
                  return {
                    text: p.description
                  };
                });
                dispatch({
                  type:
                    actionTypes.INPUTS_UPDATE_AUTOSUGGEST_ORIGIN_SUGGESTIONS,
                  suggestions: originPredictions
                });
                break;
              case "destination":
                const destinationPredictions = res.body.predictions.map(p => {
                  return {
                    text: p.description
                  };
                });
                dispatch({
                  type:
                    actionTypes.INPUTS_UPDATE_AUTOSUGGEST_DESTINATION_SUGGESTIONS,
                  suggestions: destinationPredictions
                });
                break;
              default:
                break;
            }
          }
        });
    };
  },
  // example of a thunk using the redux-thunk middleware
  tripRequest: ({ inputs }) => {
    return dispatch => {
      const DirectionsService = new google.maps.DirectionsService();

      // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
      // in this case at this point we could call a service that would persist the fuel savings
      dispatch({
        type: actionTypes.NOTIFICATION_UPDATE_SPINNER,
        spinner: true
      });
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
            arrivalTime: lodash.get(
              inputs,
              "dateTime.destinationArrival.toDate()",
              moment().toDate()
            )
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
          `routes[0].legs[0].arrival_time.value`,
          null
        );
        const departureTime = lodash.get(
          res,
          `routes[0].legs[0].departure_time.value`,
          null
        );
        const suggestionLocation = {
          lat: lodash
            .get(res, "routes[0].legs[0].end_location", { lat: () => 0.0 })
            .lat(),
          lng: lodash
            .get(res, "routes[0].legs[0].end_location", { lng: () => 0.0 })
            .lng()
        };

        suggestedPlacesRequest({ location: suggestionLocation, dispatch });
        newTrip.routes = res.routes;
        newTrip.tripSettings.transitOptions.departureTime = moment(
          departureTime
        ).toDate();
        newTrip.tripSettings.transitOptions.arrivalTime = moment(
          arrivalTime
        ).toDate();
        if (lodash.get(res, `routes[0].legs[0]`, false)) {
          dispatch({
            type: actionTypes.UPDATE_INPUTS,
            inputs: {
              ...inputs,
              autoSuggest: {
                origin: {
                  value: inputs.autoSuggest.destination.value,
                  suggestions: []
                },
                destination: { value: "", suggestions: [] }
              },
              dateTime: {
                originDeparture: moment(arrivalTime)
              }
            }
          });

          //
          dispatch({
            type: actionTypes.NOTIFICATION_UPDATE_SPINNER,
            spinner: false
          });

          suggestedPlacesRequest({ location: suggestionLocation, dispatch });
          dispatch({
            type: actionTypes.TRIPS_CREATE_TRIP,
            trip: newTrip
          });
        } else {
          console.log("failed routes");
        }
      });
    };
  }
};

const a = { ...actions, ...thunks };
export default a;
