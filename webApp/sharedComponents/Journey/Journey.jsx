import React, { Component } from "react";
import PropTypes from "prop-types";
//
import { View } from "react-primitives";
import Map from "./JourneyMap";
//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../src/actions/journeyActions";

class Journey extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View />;
  }
}
//  <Map
//           containerElement={
//             <div style={{ height: window.innerHeight, width: "100%" }} />
//           }
//           mapElement={
//             <div style={{ height: window.innerHeight, width: "100%" }} />
//           }
//           onMapLoad={this.handleMapMounted}
//           defaultZoom={3}
//           defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
//           center={center}
//           onCenterChanged={this.handleMapCenterChanged}
//           googleMapURL={googleMapURL}
//           directions={directions}
//           placeSuggestions={suggestions.placeSuggestions}
//           suggestedMarkerClick={this.onPlaceClick}
//         />
//         <PlaceSuggestionsPanel
//           onImageClick={this.onPlaceClick}
//           placeSuggestions={suggestions.placeSuggestions}
//         />
//         <SearchPanel
//           expanded={searchPanel.expanded}
//           onClick={event => this.handleSearchOnClick({ event })}
//         />
//         <RoutesPanel
//           expanded={routesPanel.expanded}
//           onClick={event => this.handleRoutesOnClick({ event })}
//           trips={trips}
//         />
const mapStateToProps = state => ({
  trips: state.trips
});

const mapDispatchToProps = dispatch => {
  actions: bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Journey);
