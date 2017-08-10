import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TripDetails from "./Trip/TripDetails";
import TripTitle from "./Trip/TripTitle";
import Step from "./Trip/Routes/Route/Steps/Step/Step";
import { View, Text, Image, StyleSheet } from "react-primitives";
import actions from "../../../src/actions/journeyActions";

class TripPanel extends Component {
  render() {
    const { events: { trips } } = this.props;
    return (
      <View style={styles.tripPanel}>
        {trips.map(trip => {
          return (
            <View
              style={{
                margin: "5px"
              }}
            >
              <TripTitle trip={trip} />
              <TripDetails trip={trip} />
              {trip.routes[
                trip.filters.route
              ].legs[0].steps.map((step, index) => {
                return <Step step={step} index={index} trip={trip} />;
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
    right: "100px",
    backgroundColor: "lightgrey",
    padding: "5px"
  }
};
const mapStateToProps = state => {
  return {
    tripPanel: state.journey.panels.tripPanel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TripPanel);
