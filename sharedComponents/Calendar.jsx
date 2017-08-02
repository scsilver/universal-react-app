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

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.addRoutes = this.addRoutes.bind(this);
    this.removeRoute = this.removeRoute.bind(this);
    this.handleClickStepEvent = this.handleClickStepEvent.bind(this);
    this.state = {
      routes: [],
      directions: [],
      inputs: {
        origin: "",
        destination: "",
        departureTime: moment()
      }
    };
  }
  static get defaultProps() {
    return {
      days: daysGenerator({ numberOfDays: 28 })
    };
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
  handleKey({ event, inputType }) {
    const {
      inputs: { origin, destination, departureTime },
      directions
    } = this.state;

    if (event.key === "Enter") {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: "TRANSIT",
          transitOptions: { departureTime: departureTime.toDate() }
        },
        (res, status) => {
          this.setState({
            directions: [...directions, res],
            inputs: {
              origin: destination,
              destination: "",
              departureTime: moment(
                res.routes[0].legs[res.routes[0].legs.length - 1].arrival_time
                  .value
              )
            }
          });
          // addRoutes({ directions: res })
        }
      );
    }
  }
  handleOnSubmit({ event, inputType }) {
    let nextInputs = {
      origin: this.state.inputs.origin,
      destination: this.state.inputs.destination,
      departureTime: this.state.inputs.departureTime
    };
    nextInputs[inputType] = event.target.value;

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
  render() {
    const { days } = this.props;
    const { routes, inputs: { origin, destination }, directions } = this.state;
    const googleMapURL =
      "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0";
    let legList = [];
    directions.map(d => {
      d.routes.map(r => r.legs.map(l => legList.push(l)));
    });
    let stepList = [];
    // legList.map(l => {
    //   l.steps.map(s => stepList.push(s));
    // });
    return (
      <View>
        <GettingStartedGoogleMap
          routes={routes}
          containerElement={<div style={{ height: `600px`, width: "900px" }} />}
          mapElement={<div style={{ height: `600px`, width: "900px" }} />}
          defaultZoom={3}
          defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
          // Pass the map reference here as props
          googleMapURL={googleMapURL}
          directions={directions}
        />
        <input
          value={origin}
          onChange={event =>
            this.handleOnSubmit({ event, inputType: "origin" })}
          onKeyPress={event => this.handleKey({ event, inputType: "origin" })}
        />
        <input
          value={destination}
          onChange={event =>
            this.handleOnSubmit({ event, inputType: "destination" })}
          onKeyPress={event =>
            this.handleKey({ event, inputType: "destination" })}
        />

        <LegList legs={legList} />
        <DaysContainer>
          {days.map(day => {
            return (
              <Day key={day.text}>
                <DayHeader day={day} />
                <EventsContainer>
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
                </EventsContainer>
              </Day>
            );
          })}
        </DaysContainer>
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
  >
    {props.directions &&
      props.directions.map(d => <DirectionsRenderer directions={d} />)}

    {props.routes.map(route => {
      return route.legs.map(leg => {
        return leg.steps.map(step => {
          return (
            <Polyline
              key={route.name}
              path={google.maps.geometry.encoding.encodePath(step.polyline)}
            />
          );
        });
      });
    })}
  </GoogleMap>
);
class StepList extends Component {
  static get defaultProps() {
    return {
      steps: []
    };
  }
  render() {
    const { steps } = this.props;
    return (
      <View style={styles.stepList}>
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
class LegList extends Component {
  static get defaultProps() {
    return {
      legs: []
    };
  }
  render() {
    const { legs } = this.props;
    return (
      <View style={styles.legList}>
        {legs.map(leg => {
          return (
            <View style={styles.leg}>
              <Text style={styles.legText}>
                {`${leg.start_address} ${leg.end_address} ${leg.duration.text}`}
              </Text>
              <StepList steps={leg.steps} />
            </View>
          );
        })}
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
    fontSize: 16,
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
  stepList: {
    backgroundColor: "grey",
    marginLeft: "10px",
    paddingLeft: "10px"
  },
  stepListText: {
    fontSize: "12px",
    color: "white"
  },
  legList: {
    paddingLeft: "10px",
    backgroundColor: "lightgrey"
  },
  legListText: {
    fontSize: "16px"
  },
  leg: {},
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
