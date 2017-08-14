import React, { Component } from "react";
import Autocomplete from "react-autocomplete";
import request from "superagent";
import { View, Text, Image, StyleSheet } from "react-primitives";

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.requestSuggestions = this.requestSuggestions.bind(this);
  }
  requestSuggestions({ value, inputType }) {
    // request
    //   .get(
    //     `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`
    //   )
    //   .end((err, res) => {
    //     if (!err) {
    //       //   this.setState({ suggestions: res.body.predictions });
    //     }
    //   });
    this.props.handleOnChange({ value, inputType });
  }
  render() {
    const { suggestions } = this.state;
    const {
      inputProps,
      handleOnChange,
      handleOnKey,
      inputType,
      value
    } = this.props;
    return (
      <View>
        <Autocomplete
          wrapperStyle={styles.autocomplete.wrapper}
          menuStyle={styles.autocomplete.menu}
          getItemValue={item => item.text}
          items={[]}
          value={value}
          inputProps={inputProps}
          renderItem={(item, isHighlighted) =>
            <View
              style={{
                ...styles.autocomplete.suggestions,
                backgroundColor: "red"
              }}
            >
              {item.text}
            </View>}
          onChange={event =>
            this.requestSuggestions({
              value: event.target.value,
              inputType
            })}
        />
      </View>
    );
  }
}
const styles = {
  autocomplete: {
    wrapper: {
      width: "30%",
      display: "inline-block",
      padding: "5px",
      boxSizing: "border-box"
    },
    menu: {
      borderRadius: "3px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      background: "rgba(255, 255, 255, 0)",
      padding: "2px 0",
      position: "fixed",
      overflow: "auto",
      maxHeight: "50%" // TODO: don't cheat, let it flow to the bottom
    },
    styleProp: {
      padding: "5px",
      width: "100%",
      boxSizing: "border-box"
    },
    suggestions: {
      padding: "5px",

      zIndex: 99
    }
  }
};
