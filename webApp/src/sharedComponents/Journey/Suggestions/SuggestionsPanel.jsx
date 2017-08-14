import React, { Component } from "react";
import actions from "../../../actions/journeyActions";
import { View, Text, Image, StyleSheet } from "react-primitives";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
class PlaceSuggestionsPanel extends Component {
  handleImageClick({ place }) {
    this.props.actions.searchPanelInputsUpdateAutoSuggest({
      value: place.name,
      inputType: "destination",
      autoSuggest: {}
    });
  }
  render() {
    const { suggestions, onImageClick } = this.props;

    let placeSuggestions = [];
    Object.keys(suggestions).map(
      suggestionType =>
        (placeSuggestions = [
          ...placeSuggestions,
          ...suggestions[suggestionType]
        ])
    );
    return (
      <View
        style={{
          position: "absolute",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          width: "100%",
          height: "80%",
          left: "0"
        }}
      >
        {suggestions.trips.map(place => {
          if (place.photos) {
            const width =
              100 * place.photos[0].height / place.photos[0].width + "px";
            return (
              <Image
                key={place.photos[0].photo_reference}
                source={`https://maps.googleapis.com/maps/api/place/photo?maxheight=100&photoreference=${place
                  .photos[0]
                  .photo_reference}&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0`}
                style={{ height: "100px", width: width, margin: "5px" }}
                onClick={() => this.handleImageClick({ place })}
              />
            );
          } else {
            return <View />;
          }
        })}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    suggestionsPanel: state.journey.panels.suggestionsPanel,
    suggestions: state.journey.suggestions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(
  PlaceSuggestionsPanel
);
