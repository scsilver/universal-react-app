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
const blue = "#324D5C";
const green = "#46B29D";
const yellow = "#F0CA4D";
const orange = "#E37B40";
const red = "#DE5B49";
const colorGenerator = ({ index }) => {
  const colors = [blue, green, yellow, orange, red];
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

    this.tripRequest = this.tripRequest.bind(this);
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
  tripRequest({ state }) {}

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
        const arrivalTime = lodash.get(
          res,
          `.routes[0].legs[${res.routes[0].legs.length -
            1}].arrival_time.value`,
          ""
        );
        newTrip.routes = res.routes;
        const setInputs = {
          ...state.inputs,
          origin: state.inputs.destination,
          destination: "",
          departureTime: moment(arrivalTime)
        };

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
  render() {
    const { days } = this.props;
    const {
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
    // });
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
        <View style={{ height: "200px" }} />
      </View>
    );
  }
}

class RoutesPanel extends Component {
  render() {
    const { expanded, onClick, trips } = this.props;
    const display = expanded ? "flex" : "none";
    const padding = expanded ? "10px" : "0px";
    const hasTrips = trips.length > 0;
    return (
      <View
        style={{
          position: "absolute",
          right: "0px",
          top: "10%",
          height: "50%",
          overflowY: "scroll",
          flex: 1,
          display: "flex",
          flexDirection: "row"
        }}
      >
        <View
          onClick={onClick}
          style={{
            position: "relative",
            display: "inline-block",
            width: "30px",
            padding: "5px",
            height: "30px",
            backgroundColor: "white"
          }}
        >
          <Image
            style={{
              position: "relative",
              width: "20px",
              height: "20px"
            }}
            source={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ic_directions_48px.svg/2000px-Ic_directions_48px.svg.png"
            }
          />
        </View>
        {hasTrips &&
          expanded &&
          <View
            style={{
              display: display,
              height: "100%",
              padding: padding,
              backgroundColor: "rgba(255,255,255,0.7)"
            }}
          >
            {this.props.children}
          </View>}
      </View>
    );
  }
}

class SearchPanel extends Component {
  render() {
    const { expanded, onClick } = this.props;
    const bottomOffset = expanded ? "70px" : "70px";
    return (
      <View
        onClick={onClick}
        style={{
          left: "50px",
          position: "relative",
          bottom: bottomOffset,
          display: "inline-block",
          boxSizing: "border-box",
          zIndex: 999
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

class StepEvent extends Component {
  render() {
    const { step, handleClickStepEvent } = this.props;
    return (
      <View
        style={styles.stepEvent}
        onClick={event => handleClickStepEvent({ event, step, window })}
      >
        {step.transit &&
          <View
            style={{
              height: "30px",
              padding: "5px",
              backgroundColor: step.transit.line.color
            }}
          >
            <Text style={{ color: step.transit.line.text_color }}>
              {step.transit.line.short_name}
            </Text>}
          </View>}
        {step.transit &&
          <Text style={styles.stepEventText}>
            {moment(step.transit.departure_time.value).format("hh:mm")}{" "}
            {moment(step.transit.arrival_time.value).format("hh:mm")}
          </Text>}
      </View>
    );
  }
}
class LegEventBegin extends Component {
  render() {
    const { leg } = this.props;
    return (
      <View style={styles.legEventBegin}>
        <Text style={styles.legEventText}>
          {moment(leg.departure_time.value).format("D MMM h:mm:a")}
        </Text>
      </View>
    );
  }
}
class LegEventEnd extends Component {
  render() {
    const { leg } = this.props;

    return (
      <View style={styles.legEventEnd}>
        <Text style={styles.legEventText}>
          {moment(leg.arrival_time.value).format("D MMM h:mm:a")}
        </Text>
      </View>
    );
  }
}

const GettingStartedGoogleMap = withGoogleMap(props =>
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
    onCenterChanged={props.onCenterChanged}
  >
    {props.directions &&
      props.directions.map(d =>
        <DirectionsRenderer
          options={{
            preserveViewport: true,
            polylineOptions: {
              strokeColor: d.color,
              strokeOpacity: 0.7,
              strokeWeight: 5
            }
          }}
          directions={d}
        />
      )}
  </GoogleMap>
);
class StepList extends Component {
  static get defaultProps() {
    return {
      steps: []
    };
  }
  render() {
    const { steps, trip } = this.props;
    return (
      <View
        style={{
          display: "inline-block",
          flex: 0.8,
          padding: "5px",
          backgroundColor: trip.tripSettings.color
        }}
      >
        {steps.map(step => {
          return (
            <Text style={styles.stepListText}>
              {step.instructions}
            </Text>
          );
        })}
      </View>
    );
  }
}
class TripList extends Component {
  static get defaultProps() {
    return {
      trips: []
    };
  }
  render() {
    const { trips } = this.props;
    return (
      <View style={styles.tripList}>
        {trips.map(trip => {
          return (
            <View
              style={{
                margin: "5px",
                borderTop: `solid 4px ${trip.tripSettings.color}`
              }}
            >
              <TripTitle trip={trip} />
              <TripDetails trip={trip} />
              {trip.routes[trip.filters.route].legs.map((leg, index) => {
                return <Leg leg={leg} index={index} trip={trip} />;
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

class Leg extends Component {
  render() {
    const { leg, trip, index } = this.props;
    return (
      <View
        style={{
          display: "inline-block",
          backgroundColor: "white",
          padding: "5px",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          display: "inline-flex"
        }}
      >
        <View
          style={{
            display: "inline-block",
            backgroundColor: "white",
            flexDirection: "column",
            justifyContent: "center",
            flex: 0.2
          }}
        >
          <Text
            style={{
              display: "block",
              flex: 1,
              textAlign: "center"
            }}
          >
            Leg{" "}
          </Text>
          <Text
            style={{
              display: "block",
              textAlign: "center",
              flex: 1,
              fontSize: "30px",
              lineHeight: "50px"
            }}
          >
            {index + 1}
          </Text>
        </View>
        <StepList steps={leg.steps} trip={trip} />
      </View>
    );
  }
}

class TripTitle extends Component {
  render() {
    const { trip } = this.props;
    const legs = trip.routes[trip.filters.route].legs;
    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    return (
      <View
        style={{
          display: "inline-block",
          backgroundColor: "white",
          padding: "5px"
        }}
      >
        <Text style={{ display: "inline-block", float: "left" }}>
          {firstLeg.start_address}
        </Text>
        <Text style={{ display: "inline-block", float: "right" }}>
          {lastLeg.end_address}
        </Text>
      </View>
    );
  }
}

class TripDetails extends Component {
  render() {
    const { trip } = this.props;
    const legs = trip.routes[trip.filters.route].legs;
    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    return (
      <View
        style={{
          display: "inline-block",
          backgroundColor: "white",
          padding: "5px"
        }}
      >
        <Text style={{ display: "inline-block", float: "left" }}>
          {firstLeg.departure_time.text}
        </Text>
        <Text style={{ display: "inline-block", float: "right" }}>
          {lastLeg.arrival_time.text}
        </Text>
      </View>
    );
  }
}

class Event extends Component {
  render() {
    const { event } = this.props;
    return (
      <View style={styles.event}>
        <Text style={styles.eventText}>
          {event.text}
        </Text>
      </View>
    );
  }
}
class EventsContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.eventsContainer}>
        {children}
      </View>
    );
  }
}
class DayHeader extends Component {
  render() {
    const { day } = this.props;
    return (
      <View style={styles.dayHeader}>
        <Text>
          {day.text}
        </Text>
      </View>
    );
  }
}
class Day extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.day}>
        {children}
      </View>
    );
  }
}
class DaysContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <View style={styles.daysContainer}>
        {children}
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
