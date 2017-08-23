import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-primitives";
import Autocomplete from "react-autocomplete";
import actions from "../../../actions/journeyActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
class TripSearchPanel extends Component {
  static get defaultProps() {
    return {
      cities: []
    };
  }
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKey = this.handleOnKey.bind(this);
    this.handleCityClick = this.handleCityClick.bind(this);
  }
  handleCityClick({ value }) {
    const inputType = "destination";
    const autoSuggest = [];
    this.props.actions.searchPanelInputsUpdateAutoSuggest({
      value,
      inputType,
      autoSuggest
    });
  }
  handleOnChange({ value, inputType, autoSuggest }) {
    this.props.actions.searchPanelInputsUpdateAutoSuggest({
      value,
      inputType,
      autoSuggest
    });
    this.props.actions.searchPanelInputsUpdateAutoSuggestRequest({
      value,
      inputType,
      autoSuggest
    });
  }
  handleOnKey({ event, inputs }) {
    if (event.key == "Enter") {
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
      onClick,
      suggestions: { cities }
    } = this.props;
    const autocompleteProps = {
      style: styles.autocomplete.styleProp,
      onKeyPress: event => this.handleOnKey({ event, inputs })
    };

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
                backgroundColor: "white"
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
                backgroundColor: "white"
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
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          {cities.map(city => {
            return (
              <View
                style={{
                  height: "20px",
                  borderRadius: "5px",
                  backgroundColor: "grey",
                  display: "inline-flex"
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold" }}
                  onClick={() => this.handleCityClick({ value: city.name })}
                >
                  {city.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    searchPanel: state.journey.panels.searchPanel,
    suggestions: state.journey.suggestions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TripSearchPanel);

const styles = {
  tripSearchPanel: {
    width: "100%",
    background: "rgba(255,255,255, 0.9)",
    position: "absolute",
    display: "inline-block",
    boxSizing: "border-box",
    height: "100px",
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

      zIndex: 99
    }
  }
};
