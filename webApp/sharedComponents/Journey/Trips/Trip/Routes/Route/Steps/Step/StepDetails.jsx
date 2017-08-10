import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, Image, StyleSheet } from "react-primitives";

export default class StepDetails extends Component {
  render() {
    const { step, trip } = this.props;
    const width = step.instructions.split("").length * 5;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flex: 1,
          height: "100%",
          minWidth: `${width}px`
        }}
      >
        <Text
          style={{
            display: "flex",
            textAlign: "right",
            fontWeight: "800",
            fontSize: 16,
            flex: 1
          }}
        >
          {step.instructions}
          {"   "}
        </Text>

        <Text
          style={{
            display: "flex"
          }}
        >
          {step.distance.text}
        </Text>

        <Text
          style={{
            display: "flex"
          }}
        >
          {step.duration.text}
        </Text>
      </View>
    );
  }
}
