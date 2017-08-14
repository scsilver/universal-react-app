import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TripDetails from "./Trip/TripDetails";
import TripTitle from "./Trip/TripTitle";
import Step from "./Trip/Routes/Route/Steps/Step/Step";
import { View, Text, Image, StyleSheet } from "react-primitives";
import actions from "../../../actions/journeyActions";
const blue = "#1A4F63";
const green = "#72B556";
const yellow = "#FFC628";
const orange = "#FC643D";
const teal = "#068587";
const red = "#FC643D";
const colorGenerator = ({ index }) => {
  const colors = [blue, teal, green, yellow, orange, red];
  return colors[index % 6];
};
class TripPanel extends Component {
  handleOnHover({ trip }) {
    const { map } = this.props;
    // var bounds = new google.maps.LatLngBounds(trip.routes[0].bounds.toJSON());
    map.fitBounds(trip.routes[0].bounds);
  }
  render() {
    const { events: { trips } } = this.props;
    return (
      <View style={styles.tripPanel}>
        {trips.map(trip => {
          return (
            <View
              style={{
                margin: "5px",
                borderTop: `4px solid ${trip.color}`,
                borderBottom: `4px solid ${colorGenerator({
                  index: trip.id + 1
                })}`
              }}
              onMouseEnter={() => this.handleOnHover({ trip })}
              key={
                trip.tripSettings.origin + "_" + trip.tripSettings.destination
              }
            >
              <TripTitle trip={trip} />
              <TripDetails trip={trip} />
              {trip.routes[
                trip.filters.route
              ].legs[0].steps.map((step, index) => {
                return (
                  <Step
                    key={step.instructions}
                    step={step}
                    index={index}
                    trip={trip}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}
const styles = {
  tripPanel: {
    position: "absolute",
    // alignSelf: "flex-start",
    right: "0",
    padding: "5px",
    height: "80%",
    overflowY: "scroll"
  }
};
const mapStateToProps = state => {
  return {
    tripPanel: state.journey.panels.tripPanel,
    events: state.journey.events
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TripPanel);
