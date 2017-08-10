import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-primitives";
import Autocomplete from "react-autocomplete";
import actions from "../../../src/actions/journeyActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
class TripSearchPanel extends Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKey = this.handleOnKey.bind(this);
  }
  handleOnChange({ value, inputType, autoSuggest }) {
    this.props.actions.searchPanelInputsUpdateAutoSuggest({
      value,
      inputType,
      autoSuggest
    });
  }
  handleOnKey({ event, inputs }) {
    if ((event.key = "Enter")) {
      this.props.actions.tripRequest({ inputs });
    }
  }
  render() {
    const {
      searchPanel: {
        expanded,
        inputs: { autoSuggest: { origin, destination } },
        inputs: { autoSuggest },
        inputs
      },
      onClick
    } = this.props;
    const autocompleteProps = {
      style: styles.autocomplete.styleProp,
      onKeyPress: event => this.handleOnKey({ event, inputs })
    };
    debugger;

    return (
      <View onClick={onClick} style={styles.tripSearchPanel}>
        <Autocomplete
          wrapperStyle={styles.autocomplete.wrapper}
          menuStyle={styles.autocomplete.menu}
          inputProps={autocompleteProps}
          getItemValue={item => item.text}
          items={origin.suggestions}
          value={origin.value}
          renderItem={(item, isHighlighted) =>
            <View
              style={{
                ...styles.autocomplete.suggestions,
                backgroundColor: isHighlighted
                  ? "rgba(255,255,255,.8)"
                  : "rgba(255,255,255,.4)"
              }}
            >
              {item.text}
            </View>}
          onChange={event =>
            this.handleOnChange({
              value: event.target.value,
              inputType: "origin",
              autoSuggest
            })}
          onSelect={value => {
            debugger;
            this.handleOnChange({ value, inputType: "origin", autoSuggest });
          }}
        />
        <Autocomplete
          wrapperStyle={styles.autocomplete.wrapper}
          menuStyle={styles.autocomplete.menu}
          inputProps={autocompleteProps}
          getItemValue={item => item.text}
          items={destination.suggestions}
          value={destination.value}
          renderItem={(item, isHighlighted) =>
            <View
              style={{
                ...styles.autocomplete.suggestions,
                backgroundColor: isHighlighted
                  ? "rgba(255,255,255,.8)"
                  : "rgba(255,255,255,.4)"
              }}
            >
              {item.text}
            </View>}
          onChange={event =>
            this.handleOnChange({
              value: event.target.value,
              inputType: "destination",
              autoSuggest
            })}
          onSelect={value =>
            this.handleOnChange({
              value,
              inputType: "destination",
              autoSuggest
            })}
        />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return { searchPanel: state.journey.panels.searchPanel };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TripSearchPanel);

const styles = {
  tripSearchPanel: {
    left: "200px",
    position: "absolute",
    top: "20px",
    display: "inline-block",
    boxSizing: "border-box",
    zIndex: 999
  },
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
      color: "black",

      zIndex: 99
    }
  }
};
