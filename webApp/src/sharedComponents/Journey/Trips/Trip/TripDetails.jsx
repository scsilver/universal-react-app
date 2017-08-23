import React, { Component } from "react";
import { View, Text } from "react-primitives";
import moment from "moment";
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
export default class TripDetails extends Component {
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
            color: colorGenerator({ index: trip.id })
          }}
        >
          {moment(trip.tripSettings.transitOptions.departureTime).format(
            "h:mm"
          )}
        </Text>
        <Text
          style={{
            display: "inline-block",
            color: colorGenerator({ index: trip.id + 1 })
          }}
        >
          {moment(trip.tripSettings.transitOptions.arrivalTime).format("h:mm")}
        </Text>
      </View>
    );
  }
}
