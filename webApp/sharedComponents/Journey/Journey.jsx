import React, { Component } from "react";
import PropTypes from "prop-types";
//
import { View } from "react-primitives";
import Map from "./JourneyMap";
//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../src/actions/journeyActions";

const tripDirectionsSelector = ({ trips }) => {
  let directions = [];
  trips.map(trip =>
    directions.push({
      color: trip.tripSettings.color,
      request: {
        destination: trip.tripSettings.destination,
        origin: trip.tripSettings.origin,
        travelMode: trip.tripSettings.travelMode
      },
      routes: [trip.routes[trip.filters.route]],
      status: "OK"
    })
  );
  return directions;
};

export const Journey = props => {
  const googleMapURL =
    "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyB_O7dkvfLlFZ7DZYZPhEbLrJeG8br6up0";
  const {
    journey: {
      suggestions,
      events,
      map,
      panels: { searchPanel, tripsPanel, suggestionsPanel }
    }
  } = props;
  const directions = tripDirectionsSelector({ trips: events.trips });

  return (
    <View>
      <Map
        containerElement={
          <div style={{ height: window.innerHeight, width: "100%" }} />
        }
        mapElement={
          <div style={{ height: window.innerHeight, width: "100%" }} />
        }
        //        onMapLoad={this.handleMapMounted}
        defaultZoom={3}
        defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
        center={map.center}
        // onCenterChanged={this.handleMapCenterChanged}
        googleMapURL={googleMapURL}
        directions={directions}
        placeSuggestions={suggestions.trips}
        //suggestedMarkerClick={this.onPlaceClick}
      />
    </View>
  );
};
//         <PlaceSuggestionsPanel
//        ;
//   }
// }
//    onImageClick={this.onPlaceClick}
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
// const mapStateToProps = state => ({
//   trips: state.trips
// });

// const mapDispatchToProps = dispatch =>  {
//   actions: bindActionCreators(actions, dispatch);
// };

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  actions: bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Journey);
