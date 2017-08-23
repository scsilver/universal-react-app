import React, { Component } from "react";
import PropTypes from "prop-types";
import { times } from "lodash";
import { View, Text, Image, StyleSheet } from "react-primitives";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  DirectionsRenderer
} from "react-google-maps";
import request from "superagent";
import moment from "moment";
import Autocomplete from "react-autocomplete";
import lodash from "lodash";
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
const tripDirectionsSelector = ({ trips }) => {
  let directions = [];
  trips.map(
    trip =>
      directions.push({
        color: trip.tripSettings.color,
        request: {
          destination: trip.tripSettings.destination,
          origin: trip.tripSettings.origin,
          travelMode: trip.tripSettings.travelMode
        },
        routes: [trip.routes[trip.filters.route]],
        status: "OK"
      })

    //   tripRoute => directions.push[tripRoute]

    // trip.routes[trip.filters.route].legs.map(
    //   tripRouteLeg => directions.push[tripRouteLeg]
    // )
  );
  return directions;
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.addRoutes = this.addRoutes.bind(this);
    this.removeRoute = this.removeRoute.bind(this);
    this.handleClickStepEvent = this.handleClickStepEvent.bind(this);
    this.handleRoutesOnClick = this.handleRoutesOnClick.bind(this);
    this.handleSearchOnClick = this.handleSearchOnClick.bind(this);
    this.handleSearchOffClick = this.handleSearchOffClick.bind(this);
    this.handleMapCenterChanged = this.handleMapCenterChanged.bind(this);
    this.handleMapMounted = this.handleMapMounted.bind(this);
    this.suggestedPlacesRequest = this.suggestedPlacesRequest.bind(this);
    this.onPlaceClick = this.onPlaceClick.bind(this);

    // const suggestions = {
    //   planSuggestions: [plan:{}],
    //   tripSuggestions: [trips: string],
    //   placeOfStaySuggestions: Place
    // }

    // const journey = {
    //   trips: [],
    //   startDate: new Date(),
    //   endDate: new Date(),
    //    PlacesofStay: [googlePlace]
    //

    //   days: [
    //   morningPlaceOfStay: googlePlace,
    //   eveningPlaceOfStay: googlePlace,

    //   plans: [{
    //     place: googlePlace
    //     time: newDate
    //     planType: oneOF('breakfast, brunch, lunch, happyhour, dinner, evening, recreation... ')

    //   }]
    //   planTravel: {
    //     legs,
    //   }

    //   ]

    //   ]
    // }
    // const trip = {
    //   filters: {
    //     route: number
    //   },
    //   tripSettings: {
    //     origin: "string",
    //     destination: "string",
    //     travelMode: "TRANSIT",
    //     transitOptions: {
    //       departureTime: new Date(),
    //       arrivalTime: new Date()
    //     }
    //   },
    //   routes: []
    // };
    this.state = {
      suggestions: { placeSuggestions: [] },
      routesPanel: {
        expanded: true
      },
      searchPanel: {
        expanded: false
      },
      map: { center: { lat: 0, lng: 0 } },
      trips: [], //a trip {selected: {route}, origin: string, destination, transitMode: 'TRANSIT', transitOptions: {departureTime: date, arrivalTime}},
      inputs: {
        origin: "london",
        originPredictions: [],
        destinationPredictions: [],
        destination: "paris",
        departureTime: moment(),
        arrivalTime: moment()
      },
      spinner: false
    };
  }

  static get defaultProps() {
    return {
      days: daysGenerator({ numberOfDays: 28 })
    };
  }
  handleMapMounted(map) {
    this._map = map;
  }
  suggestedPlacesRequest({ location }) {
    request
      .get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat +
          "," +
          location.lng}&radius=${(591657550.5 / 2) ^
          (this._map.getZoom() -
            1)}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`
      )
      .end((err, res) => {
        if (!err) {
          this.setState({
            suggestions: { placeSuggestions: res.body.results }
          });
        }
      });
  }
  handleOnChange({ value, inputType }) {
    let nextInputs = {
      ...this.state.inputs
    };
    nextInputs[inputType] = value;

    this.setState({ inputs: nextInputs });
    request
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${nextInputs[
          inputType
        ]}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`
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
              this.setState({
                inputs: { ...this.state.inputs, originPredictions }
              });
              break;
            case "destination":
              const destinationPredictions = res.body.predictions.map(p => {
                return {
                  text: p.description
                };
              });
              this.setState({
                inputs: { ...this.state.inputs, destinationPredictions }
              });
              break;
            default:
              break;
          }
        }
      });

    // let nextInputs = {
    //   origin: this.state.inputs.origin,
    //   destination: this.state.inputs.destination,
    //   departureTime: this.state.inputs.departureTime
    // };
    // nextInputs[inputType] = event.target.value;

    // this.setState({ inputs: nextInputs });
  }
  handleClickStepEvent({ event, step, window }) {
    const {
      transit: {
        line: { short_name },
        departure_time: { value },
        departure_stop: { name }
      }
    } = step;
    window.open(
      `https://www.google.com/search?q=${short_name}+leaving+at+${moment(
        value
      ).format("DD/MM/YY hh:mm A")}+from+${name}`
    );
  }
  handleKey({ event }) {
    const state = this.state;
    if (event.key === "Enter") {
      this.setState({ spinner: true });
      let newState = {};
      let newTrip = {
        filters: {
          route: 0
        },
        tripSettings: {
          color: colorGenerator({ index: state.trips.length }),
          origin: state.inputs.origin,
          destination: state.inputs.destination,
          travelMode: state.inputs.travelMode || "TRANSIT",
          transitOptions: {
            departureTime:
              state.inputs.departureTime.toDate() || moment().toDate(),
            arrivalTime: state.inputs.arrivalTime.toDate() || moment().toDate()
          }
        },
        routes: []
      };
      const DirectionsService = new google.maps.DirectionsService();
      const queryObj = {
        origin: newTrip.tripSettings.origin,
        destination: newTrip.tripSettings.destination,
        travelMode: newTrip.tripSettings.travelMode,
        transitOptions: {
          departureTime: newTrip.tripSettings.transitOptions.departureTime
        }
      };
      DirectionsService.route(queryObj, (res, status) => {
        const suggestionLocation = {
          lat: res.routes[0].legs[0].end_location.lat(),
          lng: res.routes[0].legs[0].end_location.lng()
        };

        const arrivalTime = lodash.get(
          res,
          `.routes[0].legs[0].arrival_time.value`,
          ""
        );
        newTrip.routes = res.routes;
        const setInputs = {
          ...state.inputs,
          origin: state.inputs.destination,
          destination: "",
          departureTime: moment(arrivalTime)
        };

        this.suggestedPlacesRequest({ location: suggestionLocation });

        this.setState({
          spinner: false,
          trips: [...state.trips, newTrip],
          inputs: setInputs
        });
      });
    }
  }
  handleRoutesOnClick({ event }) {
    this.setState({
      routesPanel: {
        expanded: !this.state.routesPanel.expanded
      }
    });
  }
  handleSearchOnClick({ event }) {
    event.stopPropagation();
    this.setState({
      searchPanel: {
        expanded: true
      }
    });
  }
  handleSearchOffClick({ event }) {
    this.setState({
      searchPanel: {
        expanded: false
      }
    });
  }
  handleOnSubmit({ value, inputType }) {
    const {
      inputs,
      inputs: { origin, destination, departureTime }
    } = this.state;
    let nextInputs = {
      ...inputs,
      origin: this.state.inputs.origin,
      destination: this.state.inputs.destination,
      departureTime: this.state.inputs.departureTime
    };
    nextInputs[inputType] = value;

    this.setState({ inputs: nextInputs });
  }

  addRoutes({ newRoutes }) {
    const state = this.state;
    const routes = [...state.routes, ...newRoutes];
    this.setState({
      routes
    });
  }
  removeRoute({ key }) {
    const routes = [...this.state.routes].filter(route => route.key != key);
    this.setState({
      routes
    });
  }
  legSelector() {}
  handleMapCenterChanged() {
    // const nextCenter = this._map.getCenter();
    // this.setState({
    //   // Because center now is a controlled variable, we need to set it to new
    //   // value when "center_changed". Or in the next render it will use out-dated
    //   // state.center and reset the center of the map to the old location.
    //   // We can never drag the map.
    //   center: nextCenter
    // });
  }
  onPlaceClick({ place }) {
    const nextInputs = { ...this.state.inputs, destination: place.name };
    this.setState({ inputs: nextInputs });
  }
  render() {
    const { days } = this.props;
    const {
      suggestions,
      routes,
      map: { center },
      inputs: { origin, destination },
      trips,
      routesPanel,
      searchPanel
    } = this.state;
    const googleMapURL =
      "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0";

    let stepList = [];
    // legList.map(l => {
    //   l.steps.map(s => stepList.push(s));
    // });r
    rrc;
    const directions = tripDirectionsSelector({ trips });
    return (
      <View onClick={event => this.handleSearchOffClick({ event })}>
        <GettingStartedGoogleMap
          containerElement={
            <div style={{ height: window.innerHeight, width: "100%" }} />
          }
          mapElement={
            <div style={{ height: window.innerHeight, width: "100%" }} />
          }
          onMapLoad={this.handleMapMounted}
          defaultZoom={3}
          defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
          center={center}
          onCenterChanged={this.handleMapCenterChanged}
          // Pass the map reference here as props
          googleMapURL={googleMapURL}
          directions={directions}
          placeSuggestions={suggestions.placeSuggestions}
          suggestedMarkerClick={this.onPlaceClick}
        />
        {this.state.spinner &&
          <View style={{ position: "relative", height: "0px" }}>
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "white",
                opacity: 0.5
              }}
            />
          </View>}
        <PlaceSuggestionsPanel
          onImageClick={this.onPlaceClick}
          placeSuggestions={suggestions.placeSuggestions}
        />
        <SearchPanel
          expanded={searchPanel.expanded}
          onClick={event => this.handleSearchOnClick({ event })}
        >
          <Autocomplete
            wrapperStyle={{
              width: "30%",
              display: "inline-block",
              padding: "5px",
              boxSizing: "border-box"
            }}
            menuStyle={{
              borderRadius: "3px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0)",
              padding: "2px 0",
              position: "fixed",
              overflow: "auto",
              maxHeight: "50%" // TODO: don't cheat, let it flow to the bottom
            }}
            inputProps={{
              style: {
                padding: "5px",

                width: "100%",
                boxSizing: "border-box"
              },
              onKeyPress: event => this.handleKey({ event })
            }}
            getItemValue={item => item.text}
            items={this.state.inputs.originPredictions}
            renderItem={(item, isHighlighted) =>
              <View
                style={{
                  padding: "5px",
                  backgroundColor: isHighlighted
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.4)",
                  zIndex: 99
                }}
              >
                {item.text}
              </View>}
            value={origin}
            onChange={event =>
              this.handleOnChange({
                value: event.target.value,
                inputType: "origin"
              })}
            onSelect={value =>
              this.handleOnChange({ value, inputType: "origin" })}
          />
          <Autocomplete
            wrapperStyle={{
              width: "30%",
              display: "inline-block",
              padding: "5px",
              boxSizing: "border-box"
            }}
            menuStyle={{
              borderRadius: "3px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, .5)",
              color: "black",
              padding: "2px 0",
              position: "fixed",
              overflow: "auto",
              maxHeight: "50%" // TODO: don't cheat, let it flow to the bottom
            }}
            inputProps={{
              style: {
                padding: "5px",
                color: "black",

                width: "100%",
                boxSizing: "border-box"
              },
              onKeyPress: event => this.handleKey({ event })
            }}
            getItemValue={item => item.text}
            items={this.state.inputs.destinationPredictions}
            renderItem={(item, isHighlighted) =>
              <View
                style={{
                  padding: "5px",
                  color: "black",

                  backgroundColor: isHighlighted
                    ? "rgba(255,255,255,.8)"
                    : "rgba(255,255,255,.4)",
                  zIndex: 99
                }}
              >
                {item.text}
              </View>}
            value={destination}
            onChange={event =>
              this.handleOnChange({
                value: event.target.value,
                inputType: "destination"
              })}
            onSelect={value =>
              this.handleOnChange({ value, inputType: "destination" })}
          />
        </SearchPanel>

        <RoutesPanel
          expanded={routesPanel.expanded}
          onClick={event => this.handleRoutesOnClick({ event })}
          trips={trips}
        >
          <TripList trips={trips} />
        </RoutesPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  eventText: {
    color: "#E6E2AF"
  },
  event: {
    marginTop: 10,
    height: 40,
    width: 80,
    borderRadius: "5px",
    backgroundColor: "#046380",
    alignItems: "center",
    justifyContent: "center"
  },
  eventsContainer: {
    paddingBottom: 10
  },
  dayHeader: {
    borderColor: "black",
    borderBottomWidth: 1
  },
  day: {
    width: 100,
    backgroundColor: "white",
    borderColor: "black",
    borderRightWidth: 1,
    alignItems: "center"
  },
  daysContainer: {
    flexDirection: "row"
  },
  calendar: {
    width: 1000
  },

  image: {
    height: 50,
    width: 50
  },
  text: {
    fontSize: 20
  },
  stepList: {},
  stepListText: {
    display: "block",

    flex: 1,
    fontSize: "12px",
    color: "white"
  },
  tripList: {
    // alignSelf: "flex-start",

    backgroundColor: "lightgrey",
    padding: "5px"
  },
  tripList: {},
  trip: {
    padding: "5px"
  },
  legText: {},
  legEventBegin: {
    marginTop: 10,
    height: 40,
    width: 90,
    borderRadius: "5px",
    backgroundColor: "#046380",
    alignItems: "center",
    justifyContent: "center"
  },
  legEventEnd: {
    marginTop: 10,
    height: 40,
    width: 90,
    borderRadius: "5px",
    backgroundColor: "#046380",
    alignItems: "center",
    justifyContent: "center"
  },
  legEventText: {
    textAlign: "center",
    fontSize: 16,
    color: "#E6E2AF"
  },
  stepEvent: {
    marginTop: 10,
    height: 80,
    width: 90,
    borderRadius: "5px",
    backgroundColor: "#E6E2AF",
    alignItems: "center",
    justifyContent: "center"
  },
  stepEventText: {
    textAlign: "center",
    fontSize: 12,
    color: "black"
  }
});
Calendar.propTypes = {};
const daysGenerator = ({ numberOfDays }) => {
  let days = [];
  times(numberOfDays, n =>
    days.push({
      text: `day ${n}`,
      events: [
        { text: `event ${n * 3 + 1}` },
        { text: `event ${n * 3 + 2}` },
        { text: `event ${n * 3 + 3}` }
      ]
    })
  );
  return days;
};
export default Calendar;
{
  /* <EventsContainer>
                  {legList.map((l, i) => {
                    return (
                      <View>
                        <LegEventBegin leg={l} />
                        {l.steps.map(s =>
                          <StepEvent
                            handleClickStepEvent={this.handleClickStepEvent}
                            key={s.html_instructions}
                            step={s}
                          />
                        )}
                        <LegEventEnd leg={l} />
                      </View>
                    );
                  })}
                </EventsContainer> */
}
