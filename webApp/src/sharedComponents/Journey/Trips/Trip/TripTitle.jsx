import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text } from "react-primitives";

export default class TripTitle extends Component {
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
          padding: "5px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text
          style={{
            display: "inline-block",
            fontSize: "16px",
            fontWeight: "700"
          }}
        >
          {firstLeg.start_address}
        </Text>
        <Text
          style={{
            display: "inline-block",
            fontSize: "16px",
            fontWeight: "700"
          }}
        >
          {lastLeg.end_address}
        </Text>
      </View>
    );
  }
}
