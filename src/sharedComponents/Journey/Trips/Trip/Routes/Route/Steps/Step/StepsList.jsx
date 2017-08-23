import React, { Component } from "react";

import { View, Text, Image, StyleSheet } from "react-primitives";

export default class StepList extends Component {
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
          padding: "5px"
        }}
      >
        {steps.map(step => {
          return (
            <Text key={step.instructions} style={styles.stepListText}>
              {step.instructions}
            </Text>
          );
        })}
      </View>
    );
  }
}
